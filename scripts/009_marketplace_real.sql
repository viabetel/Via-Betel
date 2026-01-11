-- ============================================
-- MARKETPLACE REAL + CHAT REALTIME + SECURITY
-- ============================================

-- 1. CREATE ENUMS
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'VIEWED', 'RESPONDED', 'AGREED', 'COMPLETED', 'CANCELED', 'EXPIRED');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING_DOCS', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED');
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'FILE');
CREATE TYPE "DocumentType" AS ENUM ('CNH', 'CERTIFICADO', 'VINCULO');

-- 2. REQUESTS TABLE (solicitações do aluno)
CREATE TABLE "requests" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "instructorId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL, -- "A", "B", "C", "D", "E"
  "city" TEXT NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
  "budget" INTEGER, -- em centavos
  "preferredDate" TIMESTAMP,
  "expiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "profiles" ("id") ON DELETE CASCADE
);

CREATE INDEX "requests_studentId_idx" ON "requests" ("studentId");
CREATE INDEX "requests_instructorId_idx" ON "requests" ("instructorId");
CREATE INDEX "requests_status_idx" ON "requests" ("status");
CREATE INDEX "requests_createdAt_idx" ON "requests" ("createdAt" DESC);

-- 3. REQUEST_EVENTS TABLE (timeline)
CREATE TABLE "request_events" (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- "CREATED", "VIEWED", "RESPONDED", "AGREED", "COMPLETED", "CANCELED"
  "data" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "request_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests" ("id") ON DELETE CASCADE
);

CREATE INDEX "request_events_requestId_idx" ON "request_events" ("requestId");

-- 4. CONVERSATIONS TABLE (chat por request)
CREATE TABLE "conversations" (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL UNIQUE,
  "studentId" TEXT NOT NULL,
  "instructorId" TEXT NOT NULL,
  "lastMessageAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "conversations_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests" ("id") ON DELETE CASCADE
);

CREATE INDEX "conversations_requestId_idx" ON "conversations" ("requestId");
CREATE INDEX "conversations_studentId_idx" ON "conversations" ("studentId");
CREATE INDEX "conversations_instructorId_idx" ON "conversations" ("instructorId");

-- 5. MESSAGES TABLE
CREATE TABLE "messages" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "type" "MessageType" NOT NULL DEFAULT 'TEXT',
  "content" TEXT NOT NULL,
  "fileUrl" TEXT,
  "fileType" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations" ("id") ON DELETE CASCADE
);

CREATE INDEX "messages_conversationId_idx" ON "messages" ("conversationId", "createdAt" DESC);

-- 6. MESSAGE_READS TABLE (track lidos)
CREATE TABLE "message_reads" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lastReadAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("conversationId", "userId"),
  CONSTRAINT "message_reads_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations" ("id") ON DELETE CASCADE
);

-- 7. DOCUMENTS TABLE (verificação de instrutor)
CREATE TABLE "documents" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL,
  "type" "DocumentType" NOT NULL,
  "documentUrl" TEXT NOT NULL,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_DOCS',
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "documents_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profiles" ("id") ON DELETE CASCADE
);

CREATE INDEX "documents_ownerId_idx" ON "documents" ("ownerId");
CREATE INDEX "documents_status_idx" ON "documents" ("status");

-- 8. AUDIT_LOGS TABLE
CREATE TABLE "audit_logs" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT,
  "action" TEXT NOT NULL, -- "REQUEST_CREATED", "MESSAGE_SENT", "DOCUMENT_APPROVED", "USER_BANNED"
  "resourceType" TEXT NOT NULL, -- "request", "message", "document", "user"
  "resourceId" TEXT,
  "details" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs" ("actorId");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" ("action");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs" ("createdAt" DESC);

-- 9. ADD VERIFICATION_STATUS TO PROFILES
ALTER TABLE "profiles" ADD COLUMN "verificationStatus" "VerificationStatus" DEFAULT 'PENDING_DOCS';
ALTER TABLE "profiles" ADD COLUMN "bannedAt" TIMESTAMP;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - OBRIGATORIO
-- ============================================

-- Enable RLS
ALTER TABLE "requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "request_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "message_reads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- REQUESTS RLS
CREATE POLICY "requests_select_own_or_assigned" ON "requests"
  FOR SELECT USING (
    "studentId" = auth.uid()
    OR "instructorId" = auth.uid()
    OR (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "requests_insert_student" ON "requests"
  FOR INSERT WITH CHECK (
    "studentId" = auth.uid()
    AND (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'STUDENT'
  );

CREATE POLICY "requests_update_own" ON "requests"
  FOR UPDATE USING (
    "studentId" = auth.uid()
    OR "instructorId" = auth.uid()
    OR (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

-- CONVERSATIONS RLS
CREATE POLICY "conversations_select_participants" ON "conversations"
  FOR SELECT USING (
    "studentId" = auth.uid()
    OR "instructorId" = auth.uid()
    OR (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "conversations_insert_on_request" ON "conversations"
  FOR INSERT WITH CHECK (true);

-- MESSAGES RLS
CREATE POLICY "messages_select_participants" ON "messages"
  FOR SELECT USING (
    "conversationId" IN (
      SELECT "id" FROM "conversations"
      WHERE "studentId" = auth.uid() OR "instructorId" = auth.uid()
    )
    OR (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "messages_insert_participants" ON "messages"
  FOR INSERT WITH CHECK (
    "conversationId" IN (
      SELECT "id" FROM "conversations"
      WHERE "studentId" = auth.uid() OR "instructorId" = auth.uid()
    )
  );

-- DOCUMENTS RLS
CREATE POLICY "documents_select_own_or_admin" ON "documents"
  FOR SELECT USING (
    "ownerId" = auth.uid()
    OR (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "documents_insert_own" ON "documents"
  FOR INSERT WITH CHECK (
    "ownerId" = auth.uid()
  );

-- AUDIT_LOGS RLS (apenas admin pode ler)
CREATE POLICY "audit_logs_select_admin" ON "audit_logs"
  FOR SELECT USING (
    (SELECT "role" FROM "profiles" WHERE "id" = auth.uid()) = 'ADMIN'
  );

-- ============================================
-- FUNCTIONS E TRIGGERS
-- ============================================

-- Update updatedAt
CREATE OR REPLACE FUNCTION update_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requests_update_timestamp
BEFORE UPDATE ON "requests"
FOR EACH ROW
EXECUTE FUNCTION update_requests_updated_at();

-- Auto-update lastMessageAt
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "conversations" SET "lastMessageAt" = NOW() WHERE "id" = NEW."conversationId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_update_last_message
AFTER INSERT ON "messages"
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();
