# Backend Setup - Via Betel

## Visão Geral
Sistema de captação de leads para alunos e instrutores usando Next.js + Prisma + PostgreSQL.

## Arquivos Criados/Modificados

### Server Actions
- `app/actions/leads.ts` - Server Actions para criar leads de aluno e instrutor

### Páginas
- `app/aluno/page.tsx` - Landing page para alunos
- `app/aluno/aluno-client.tsx` - Componente client com formulário de aluno
- `app/instrutor/page.tsx` - Landing page para instrutores
- `app/instrutor/instrutor-client.tsx` - Componente client com formulário de instrutor

### API (mantida para compatibilidade)
- `app/api/leads/route.ts` - API route (pode ser removida se não for usada)

### Banco de Dados
- `prisma/schema.prisma` - Schema com model Lead unificado

## Configuração

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/viabetel?schema=public"

# Exemplo para produção (Vercel Postgres)
# DATABASE_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
```

### 2. Instalação de Dependências
```bash
npm install @prisma/client
npm install -D prisma
```

### 3. Migrations do Prisma
```bash
# Gerar o Prisma Client
npx prisma generate

# Criar/aplicar migrations
npx prisma migrate dev --name init

# Para produção
npx prisma migrate deploy
```

## Estrutura do Banco de Dados

### Model Lead
```prisma
model Lead {
  id               String   @id @default(cuid())
  tipo             String   // "aluno" ou "instrutor"
  nome             String
  whatsapp         String
  cidade           String
  categoria        String?  // categoria desejada pelo aluno
  objetivo         String?
  horario          String?
  categorias       String?  // categorias que o instrutor ensina
  experiencia      String?
  disponibilidade  String?
  veiculo          String?
  createdAt        DateTime @default(now())
  
  @@map("leads")
}
```

## Fluxo de Funcionamento

### Para Alunos (/aluno)
1. Usuário preenche formulário com:
   - Nome, WhatsApp, Cidade/UF
   - Categoria desejada (A, B, C, D, E)
   - Objetivo (primeira habilitação, reabilitação, etc)
   - Melhor horário
2. Ao submeter, chama `createLeadAluno()`
3. Server Action valida e salva no banco
4. Abre WhatsApp com mensagem preenchida

### Para Instrutores (/instrutor)
1. Usuário preenche formulário com:
   - Nome, WhatsApp, Cidade/UF
   - Categorias que ensina (multi-select)
   - Anos de experiência
   - Disponibilidade
   - Possui veículo próprio
2. Ao submeter, chama `createLeadInstrutor()`
3. Server Action valida e salva no banco
4. Abre WhatsApp com mensagem preenchida

## Server Actions vs API Routes

Este projeto usa **Server Actions** (preferência) ao invés de API Routes porque:
- Melhor performance (executam no servidor sem overhead HTTP)
- Type-safe com TypeScript
- Integração direta com Prisma
- Melhor DX (Developer Experience)
- Compatível com serverless

## Deploy na Vercel

### Passo 1: Conectar Postgres
1. Vá em seu projeto na Vercel
2. Storage → Create Database → Postgres
3. Copie a `DATABASE_URL` gerada

### Passo 2: Configurar Env Vars
Adicione no Vercel:
- `DATABASE_URL` - URL do Postgres da Vercel

### Passo 3: Deploy
```bash
# Commit e push
git add .
git commit -m "Add backend with Server Actions"
git push

# Vercel vai automaticamente:
# 1. Detectar Prisma
# 2. Rodar prisma generate
# 3. Fazer o build
```

### Passo 4: Rodar Migrations em Produção
```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

## Verificação

### Testar Localmente
```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
# (adicionar DATABASE_URL)

# 3. Rodar migrations
npx prisma migrate dev

# 4. Iniciar dev server
npm run dev

# 5. Testar:
# - http://localhost:3000/aluno
# - http://localhost:3000/instrutor
```

### Verificar no Prisma Studio
```bash
npx prisma studio
```
Abre interface visual do banco em http://localhost:5555

## Troubleshooting

### Erro: "PrismaClient is unable to connect"
- Verificar se DATABASE_URL está correto
- Verificar se o banco está rodando
- Verificar credenciais

### Erro: "Table 'leads' does not exist"
- Rodar: `npx prisma migrate dev`
- Ou: `npx prisma db push` (força sincronização)

### Erro em Produção
- Verificar se DATABASE_URL está nas env vars da Vercel
- Verificar se migrations foram aplicadas: `npx prisma migrate deploy`

## Arquivos Importantes

```
app/
├── actions/
│   └── leads.ts           # Server Actions (PRINCIPAL)
├── aluno/
│   ├── page.tsx           # Landing page aluno
│   └── aluno-client.tsx   # Form aluno
├── instrutor/
│   ├── page.tsx           # Landing page instrutor
│   └── instrutor-client.tsx # Form instrutor
└── api/
    └── leads/
        └── route.ts       # API route (opcional)

prisma/
└── schema.prisma          # Schema do banco
```

## Próximos Passos

1. ✅ Backend funcional para aluno e instrutor
2. ✅ Validação de campos obrigatórios
3. ✅ Persistência em PostgreSQL
4. ✅ WhatsApp com mensagem preenchida
5. 🔄 (Opcional) Dashboard admin para ver leads
6. 🔄 (Opcional) Email notifications
7. 🔄 (Opcional) Analytics de conversão
