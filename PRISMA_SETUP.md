# 🗄️ Configuração do Prisma com Supabase

## ✅ Status Atual

O projeto está configurado com:
- ✅ Prisma 6.2.0 (estável)
- ✅ Schema definido com tabelas Lead e Instructor
- ✅ Connection pooling configurado
- ✅ Cliente Prisma com validação robusta

## 🚀 Como Sincronizar o Banco de Dados

### 1. Configure as Variáveis de Ambiente

No Vercel ou arquivo `.env.local`:

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**Importante:**
- `DATABASE_URL`: Use a connection pooler URL (porta 6543) do Supabase
- `DIRECT_URL`: Use a direct connection URL (porta 5432) para migrations

### 2. Execute o Push do Schema

```bash
npm run db:push
```

Este comando irá:
1. Verificar se as variáveis de ambiente estão configuradas
2. Sincronizar o schema do Prisma com o banco Supabase
3. Criar as tabelas automaticamente
4. Gerar o Prisma Client

### 3. Verifique a Conexão

Acesse: `https://seu-site.vercel.app/api/health/db`

Você verá:
- ✅ Status da conexão
- 📊 Contagem de registros nas tabelas
- ⚠️ Avisos se houver problemas

### 4. (Opcional) Abrir Prisma Studio

Para visualizar e editar dados:

```bash
npm run db:studio
```

## 🔧 Troubleshooting

### Erro: "DATABASE_URL não está configurada"

**Solução:** Configure as variáveis de ambiente no Vercel:
1. Acesse seu projeto no Vercel Dashboard
2. Settings → Environment Variables
3. Adicione `DATABASE_URL` e `DIRECT_URL`
4. Redeploy o projeto

### Erro: "Can't reach database server"

**Causas possíveis:**
- URLs do Supabase incorretas
- Senha errada
- Firewall bloqueando conexão

**Solução:**
1. Verifique as credenciais no Supabase Dashboard
2. Settings → Database → Connection string
3. Copie as URLs corretas (pooler e direct)

### Tabelas não aparecem no Supabase

**Solução:**
1. Execute `npm run db:push` localmente ou no Vercel
2. Verifique no Supabase Dashboard → Table Editor
3. As tabelas devem aparecer automaticamente

## 📝 Schema Atual

```prisma
model Lead {
  id           String   @id @default(cuid())
  name         String
  email        String
  phone        String
  category     String
  city         String?
  preferredSchedule String?
  message      String?
  createdAt    DateTime @default(now())
}

model Instructor {
  id                String   @id @default(cuid())
  name              String
  email             String
  phone             String
  category          String
  experience        Int
  city              String?
  availability      Json?
  documents         String?
  vehicle           String?
  createdAt         DateTime @default(now())
}
```

## 🎯 Próximos Passos

1. ✅ Execute `npm run db:push` para criar as tabelas
2. ✅ Teste o endpoint `/api/health/db`
3. ✅ Preencha os formulários de aluno/instrutor
4. ✅ Verifique os dados no Supabase Dashboard

---

**Nota:** O sistema está configurado para funcionar sem banco de dados (apenas enviando emails). As tabelas são opcionais caso você queira armazenar os dados também no Supabase.
