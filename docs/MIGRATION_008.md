# Migration 008: Instructor Profile

## Objetivo
Criar a tabela `instructor_profiles` para armazenar dados de perfil de instrutores durante o processo de onboarding.

## Como executar no Supabase

1. **Acesse o SQL Editor do Supabase:**
   - Vá para seu projeto no [Supabase Dashboard](https://app.supabase.com)
   - Clique em **SQL Editor** na sidebar esquerda
   - Clique em **New Query**

2. **Cole o script abaixo e execute:**

```sql
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
  CONSTRAINT "instructor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users" ("id") ON DELETE CASCADE
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
```

3. **Clique em "Run"** para executar o script
4. **Verifique** se as tabelas foram criadas em **Table Editor**

## Testes manuais após execução

| Teste | Ação | Resultado esperado |
|-------|------|-------------------|
| Acesso público | Visite `/planos` sem estar logado | Página carrega com todos os planos visíveis |
| Redirecionamento login | Clique em plano como não-logado | Redireciona para `/auth/login?returnTo=/planos/checkout?plan=...` |
| Checkout - logado | Clique em plano como instrutor logado | Vai para checkout com validações de cartão |
| Validação cartão | Digite cartão inválido e envie | Mostra erro "Número de cartão inválido" |
| Validação expiry | Digite validade expirada e envie | Mostra erro "Data de validade inválida" |
| Checkout sucesso | Preencha todos os dados corretamente e envie | Redireciona para `/conta/meus-planos?success=true` |

## Troubleshooting

**Erro: "relation \"instructor_profiles\" does not exist"**
- Certifique-se de que executou o script SQL 008 no SQL Editor
- Verifique se a tabela aparece em **Table Editor** > Public

**Erro: "permission denied for schema public"**
- Verifique se sua role do Supabase tem permissões corretas
- Tente executar como usuário admin

**Erro ao fazer migration via Prisma**
- A migration automática só funciona com `DIRECT_URL` válida
- Alternativa: execute manualmente o SQL no Supabase
