-- Create InstructorVerificationStatus enum
CREATE TYPE "InstructorVerificationStatus" AS ENUM ('INCOMPLETO', 'EM_ANALISE', 'APROVADO', 'REPROVADO');

-- Create instructor_profiles table
CREATE TABLE "instructor_profiles" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "city" TEXT,
  "state" TEXT,
  "categories" TEXT,
  "yearsExp" INTEGER,
  "isLinkedToAutoescola" BOOLEAN NOT NULL DEFAULT false,
  "autoescolaName" TEXT,
  "autoescolaCnpj" TEXT,
  "cnhUrl" TEXT,
  "certificadoUrl" TEXT,
  "vinculoUrl" TEXT,
  "status" "InstructorVerificationStatus" NOT NULL DEFAULT 'INCOMPLETO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "instructor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Create index for userId lookups
CREATE INDEX "instructor_profiles_userId_idx" ON "instructor_profiles"("userId");

-- Add trigger to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_instructor_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_instructor_profiles_timestamp
BEFORE UPDATE ON "instructor_profiles"
FOR EACH ROW
EXECUTE FUNCTION update_instructor_profiles_updated_at();
