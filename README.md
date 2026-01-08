# Via Betel - Plataforma de Conexão entre Alunos e Instrutores de Direção

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
```bash
# Acesse https://neon.tech
# Crie um projeto e copie a DATABASE_URL
```

**Supabase**
```bash
# Acesse https://supabase.com  
# Crie um projeto e copie a Connection String
```

### 2. Configure as Variáveis de Ambiente

No Vercel Dashboard, adicione:
```env
DATABASE_URL=postgresql://...
```

Opcional (Analytics):
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
```

### 3. Execute as Migrations

```bash
# Com a DATABASE_URL configurada
npx prisma db push

# Ou usando Vercel CLI
vercel env pull .env
npx prisma db push
```

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar banco de dados local
cp .env.example .env
# Edite .env com sua DATABASE_URL

# Executar migrations
npx prisma db push

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

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
│   ├── api/leads/      # API para salvar leads
│   ├── cadastro/       # Página de cadastro
│   └── login/          # Página de login
├── components/
│   ├── hero-section.tsx
│   ├── materials-section.tsx
│   ├── footer.tsx
│   └── ...
├── prisma/
│   └── schema.prisma   # Schema do banco
└── lib/
    └── analytics.ts    # Sistema de tracking
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

## Troubleshooting

**Erro: Prisma Client não encontrado**
```bash
npx prisma generate
```

**Erro: Cannot connect to database**
- Verifique a `DATABASE_URL`
- Confirme whitelist de IPs (Neon/Supabase)

**Build falha no Vercel**
- Verifique se `prisma generate` está no `postinstall`
- Veja os logs detalhados no Vercel

## Deployment

Your project is live at:

**[https://vercel.com/contato-6728s-projects/v0-katachi](https://vercel.com/contato-6728s-projects/v0-katachi)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/EVI4HheW4RQ](https://v0.app/chat/EVI4HheW4RQ)**

## Documentação Adicional

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia completo de deploy
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

## Licença

MIT

---

Desenvolvido com ❤️ por Via Betel
