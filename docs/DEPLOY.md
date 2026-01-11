# Deploy - Via Betel

## Configuração de Variáveis de Ambiente

### Banco de Dados (Supabase/PostgreSQL)

Para que as migrations do Prisma funcionem corretamente no deploy da Vercel, configure **duas** variáveis de ambiente:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão do app (pode usar pooler/pgbouncer) | `postgresql://user:pass@host:6543/db?pgbouncer=true` |
| `DIRECT_URL` | URL direta do Postgres (porta 5432, sem pooler) | `postgresql://user:pass@host:5432/db` |

### Por que duas URLs?

- **DATABASE_URL**: Usada em runtime pelo app. Pode usar connection pooler (pgbouncer) para melhor performance.
- **DIRECT_URL**: Usada pelo Prisma durante migrations (`prisma migrate deploy`). Migrations precisam de conexão direta, sem pooler.

### Supabase

No Supabase, você encontra as URLs em: **Project Settings > Database > Connection string**

- **Session mode (port 5432)**: Use para `DIRECT_URL`
- **Transaction mode (port 6543)**: Use para `DATABASE_URL`

Exemplo:
```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## Build e Migrations

O build executa automaticamente:
1. `prisma generate` - Gera o Prisma Client
2. `prisma migrate deploy` - Aplica migrations pendentes
3. `next build` - Build do Next.js

### Se DIRECT_URL não estiver configurada

Se `DIRECT_URL` não estiver configurada ou não for acessível durante o build:
- O comando `prisma migrate deploy` pode falhar
- O app ainda funcionará com fallback hardcoded para planos
- Recomendado: Configure corretamente para ter dados persistidos

### Migrations manuais

Se preferir não rodar migrations automáticas no build:
1. Remova `prisma migrate deploy` do script de build em `package.json`
2. Execute os scripts SQL manualmente no Supabase SQL Editor
3. Scripts estão em `/scripts/*.sql`

## Outras Variáveis Necessárias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (server-side only) |

## Troubleshooting

### Erro P2021: Table does not exist

Se ocorrer este erro durante o build:
1. Verifique se `DIRECT_URL` está configurada corretamente
2. Verifique se o banco está acessível (não bloqueado por firewall)
3. Execute as migrations manualmente via Supabase SQL Editor

### Erro de conexão durante build

A Vercel precisa acessar o banco durante o build para migrations. Se seu banco estiver em VPC privada, considere:
1. Configurar IP allowlist na Vercel
2. Ou desabilitar migrations automáticas e executar manualmente
