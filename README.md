# Via Betel - Instrutores de Condução

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/contato-6728s-projects/v0-katachi)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/EVI4HheW4RQ)

## Overview

Plataforma completa para conectar alunos que desejam obter sua CNH com instrutores certificados. Sistema otimizado para conversão de tráfego do Instagram com CTAs estratégicos e captação rápida de leads.

## Principais Funcionalidades

- ✅ Landing page otimizada com CTAs para WhatsApp
- ✅ Formulário de captação rápida em `/aluno`
- ✅ Backend real com Prisma + PostgreSQL
- ✅ Sistema de analytics (GA4 + Meta Pixel)
- ✅ Design responsivo mobile-first
- ✅ Integração WhatsApp com mensagens pré-preenchidas

## Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: PostgreSQL (Neon/Supabase)
- **ORM**: Prisma
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Deploy Rápido

### 1. Configure o Banco de Dados

Escolha uma opção:

**Neon (Recomendado)**
- Acesse https://neon.tech
- Crie um projeto e copie a DATABASE_URL

**Supabase**
- Acesse https://supabase.com  
- Crie um projeto e copie a Connection String

### 2. Configure as Variáveis de Ambiente

No Vercel Dashboard, adicione:

```env
DATABASE_URL=postgresql://user:password@host/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host/database
```

Opcional (Analytics):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
```

### 3. Execute as Migrations

Com a DATABASE_URL configurada, execute:

```bash
npx prisma db push
```

Ou usando Vercel CLI:

```bash
vercel env pull .env
npx prisma db push
```

## Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npx prisma generate

# 3. Criar tabelas no Supabase (usa DIRECT_URL)
npx prisma db push

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Supabase Setup (sem PC)

Se você não tem acesso ao terminal local ou prefere criar as tabelas diretamente no Vercel:

### 1. Configure o Token de Bootstrap

No Vercel Dashboard, adicione a variável de ambiente:

```env
BOOTSTRAP_TOKEN=seu-token-secreto-aqui
```

Escolha um valor aleatório e seguro (ex: `bootstrap_2024_abc123xyz`)

### 2. Execute o Bootstrap

Após o deploy, faça uma chamada POST para criar a tabela:

```bash
curl -X POST https://seu-dominio.vercel.app/api/admin/bootstrap \
  -H "x-bootstrap-token: seu-token-secreto-aqui"
```

Resposta esperada:

```json
{
  "ok": true,
  "created": true,
  "message": "Tabela leads criada com sucesso"
}
```

### 3. Valide a Conexão

Verifique se tudo está funcionando:

```bash
curl https://seu-dominio.vercel.app/api/health/db
```

Resposta esperada:

```json
{
  "ok": true,
  "count": 0,
  "message": "Conexão com banco de dados OK"
}
```

### 4. Visualize no Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Table Editor**
4. Verá a tabela `leads` criada e pronta para uso

### Notas de Segurança

- O `BOOTSTRAP_TOKEN` é necessário apenas uma vez para criar a tabela
- Após criar a tabela, você pode remover este endpoint se quiser
- NUNCA compartilhe o token publicamente
- Use tokens diferentes para cada ambiente (dev/staging/prod)

## Comandos Úteis

```bash
# Build de produção
npm run build

# Testar build
npm start

# Visualizar banco de dados
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

## Estrutura do Projeto

```
├── app/
│   ├── aluno/          # Landing page de captação
│   ├── api/
│   │   ├── health/db/  # Health check do banco
│   │   └── admin/      # Endpoints administrativos
│   ├── instrutor/      # Cadastro de instrutores
│   └── page.tsx        # Landing page principal
├── components/
│   ├── hero-section.tsx
│   ├── materials-section.tsx
│   ├── footer.tsx
│   └── ...
├── prisma/
│   └── schema.prisma   # Schema do banco
└── lib/
    └── prisma.ts       # Cliente Prisma singleton
```

## Fluxo de Conversão

1. **Usuário vem do Instagram** → Hero com CTAs visíveis
2. **Clica em "Chamar no WhatsApp"** → Abre WhatsApp com mensagem pré-preenchida
3. **Ou clica em "Quero orçamento rápido"** → Vai para `/aluno`
4. **Preenche formulário** → Lead salvo no banco + abre WhatsApp
5. **Analytics registra** → Eventos trackados (GA4/Meta Pixel)

## Monitoramento

### Ver Leads no Banco

```bash
npx prisma studio
```

### Ver Logs no Vercel

- Acesse o Dashboard do Vercel
- Selecione o projeto
- Vá em "Logs"

### Verificar Conexão

Acesse o endpoint de health check:

Local:
```bash
curl http://localhost:3000/api/health/db
```

Produção:
```bash
curl https://seu-dominio.vercel.app/api/health/db
```

Resposta esperada quando tudo está OK:

```json
{
  "ok": true,
  "count": 0,
  "message": "Conexão com banco de dados OK",
  "timestamp": "2024-01-09T..."
}
```

### Visualizar Dados no Supabase

**Opção 1: Prisma Studio (Local)**

```bash
npx prisma studio
```

**Opção 2: Supabase Table Editor**

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Table Editor**
4. Verá a tabela `leads` criada pelo Prisma

## Troubleshooting

**Erro: Prisma Client não encontrado**

```bash
npx prisma generate
```

**Erro: "Tabelas não criadas"**

```bash
npx prisma db push
```

**Erro: "Cannot reach database server"**

- Verifique se as URLs estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se a senha está correta nas connection strings

**Erro: "Cannot connect to database"**

- Verifique a `DATABASE_URL`
- Confirme whitelist de IPs (Neon/Supabase)

**Erro no Vercel Deploy**

- Confirme que `DATABASE_URL` e `DIRECT_URL` estão configuradas nas Environment Variables
- O script `postinstall` com `prisma generate` já está configurado

**Erro: "too many connections"**

- Certifique-se de usar `DATABASE_URL` com `?pgbouncer=true` (Transaction pooler)
- Isso é essencial para ambientes serverless como Vercel

## Deployment

Your project is live at:

**[https://vercel.com/contato-6728s-projects/v0-katachi](https://vercel.com/contato-6728s-projects/v0-katachi)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/EVI4HheW4RQ](https://v0.app/chat/EVI4HheW4RQ)**

## Licença

MIT

---

Desenvolvido com ❤️ por Via Betel
