-- Migration: Limite de 7 conversas mensais para instrutores sem plano ativo
-- Regras:
-- 1. Instrutores SEM plano ativo podem responder até 7 alunos diferentes por mês
-- 2. O contador reseta automaticamente no início de cada mês
-- 3. Se já respondeu aquele aluno no mesmo mês, não conta novamente
-- 4. Instrutores COM plano ativo não têm limite

-- Tabela para controlar uso mensal de cada instrutor
CREATE TABLE IF NOT EXISTS monthly_chat_usage (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  used_conversations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT monthly_chat_usage_user_year_month_key UNIQUE (user_id, year, month)
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_monthly_chat_usage_user_id ON monthly_chat_usage(user_id);

-- Tabela para registrar quais conversas já foram contabilizadas
CREATE TABLE IF NOT EXISTS conversation_usage_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  first_reply_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT conversation_usage_logs_unique UNIQUE (user_id, conversation_id, year, month)
);

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_conversation_usage_logs_user_period 
  ON conversation_usage_logs(user_id, year, month);

-- Comentário explicativo
COMMENT ON TABLE monthly_chat_usage IS 
  'Controla limite de 7 conversas/mês para instrutores sem plano. Reset automático mensal.';

COMMENT ON TABLE conversation_usage_logs IS 
  'Registra quais conversas já foram contabilizadas para evitar contagem dupla no mesmo mês.';
