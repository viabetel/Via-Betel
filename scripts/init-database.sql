-- Script para inicializar o banco de dados PostgreSQL da Via Betel
-- Execute este script apenas UMA vez após configurar o DATABASE_URL

-- Criar a tabela Lead se não existir
CREATE TABLE IF NOT EXISTS "Lead" (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  categoria VARCHAR(50),
  objetivo VARCHAR(100),
  horario VARCHAR(50),
  categorias VARCHAR(255),
  experiencia VARCHAR(100),
  disponibilidade VARCHAR(255),
  veiculo VARCHAR(100),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS "Lead_tipo_idx" ON "Lead"(tipo);
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");

-- Adicionar comentários
COMMENT ON TABLE "Lead" IS 'Tabela de leads de alunos e instrutores da Via Betel';
COMMENT ON COLUMN "Lead".tipo IS 'Tipo do lead: aluno ou instrutor';
