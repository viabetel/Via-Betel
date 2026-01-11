-- =====================================================
-- MIGRATION: Sistema de Planos e Assinaturas
-- =====================================================

-- 1. Criar enum PlanInterval
DO $$ BEGIN
  CREATE TYPE "PlanInterval" AS ENUM ('MONTHLY', 'YEARLY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Adicionar EXPIRED ao enum SubscriptionStatus
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

-- 3. Criar tabela plans
CREATE TABLE IF NOT EXISTS "plans" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "interval" "PlanInterval" NOT NULL,
  "features" JSONB NOT NULL,
  "maxListings" INTEGER NOT NULL DEFAULT 1,
  "highlight" BOOLEAN NOT NULL DEFAULT false,
  "badge" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "plans_slug_key" ON "plans"("slug");

-- 4. Adicionar colunas planId, startedAt, expiresAt, canceledAt à subscriptions
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "planId" TEXT;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "canceledAt" TIMESTAMP(3);

-- Tornar stripeCustomerId e stripeSubscriptionId opcionais
ALTER TABLE "subscriptions" ALTER COLUMN "stripeCustomerId" DROP NOT NULL;
ALTER TABLE "subscriptions" ALTER COLUMN "stripeSubscriptionId" DROP NOT NULL;

-- Remover coluna currentPeriodEnd se existir (substituída por expiresAt)
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "currentPeriodEnd";

-- Criar índice no planId
CREATE INDEX IF NOT EXISTS "subscriptions_planId_idx" ON "subscriptions"("planId");

-- 5. Inserir planos padrão
INSERT INTO "plans" ("id", "slug", "name", "description", "priceCents", "interval", "features", "maxListings", "highlight", "badge", "updatedAt")
VALUES 
  (
    'plan_free',
    'gratuito',
    'Gratuito',
    'Ideal para começar e testar a plataforma',
    0,
    'MONTHLY',
    '["Perfil básico no marketplace", "Receber até 3 solicitações/mês", "Chat com alunos", "Suporte por email"]',
    1,
    false,
    NULL,
    CURRENT_TIMESTAMP
  ),
  (
    'plan_basic',
    'basico',
    'Básico',
    'Para instrutores que querem mais visibilidade',
    4990,
    'MONTHLY',
    '["Tudo do Gratuito", "Perfil destacado", "Até 10 solicitações/mês", "Badge \"Verificado\"", "Estatísticas básicas", "Suporte prioritário"]',
    3,
    false,
    'verificado',
    CURRENT_TIMESTAMP
  ),
  (
    'plan_pro',
    'profissional',
    'Profissional',
    'Máxima exposição e recursos premium',
    9990,
    'MONTHLY',
    '["Tudo do Básico", "Aparecer no topo das buscas", "Solicitações ilimitadas", "Badge \"PRO\"", "Estatísticas avançadas", "1 impulsionamento grátis/mês", "Suporte VIP WhatsApp"]',
    10,
    true,
    'pro',
    CURRENT_TIMESTAMP
  ),
  (
    'plan_pro_yearly',
    'profissional-anual',
    'Profissional Anual',
    'Melhor custo-benefício - 2 meses grátis!',
    99900,
    'YEARLY',
    '["Tudo do Profissional", "2 meses grátis (pague 10, leve 12)", "Badge \"PRO\" exclusivo", "3 impulsionamentos grátis/mês", "Consultoria de perfil"]',
    10,
    true,
    'pro',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("id") DO NOTHING;
