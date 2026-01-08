# Guia de Deploy no Vercel - Via Betel

## Status do Projeto

✅ **Pronto para deploy** - Configurações atualizadas para Vercel

## Mudanças Realizadas

### 1. Prisma Configuration
- Movido `prisma` de dependencies para devDependencies
- Adicionado script `postinstall` para gerar Prisma Client automaticamente
- Script de build atualizado: `prisma generate && next build`

### 2. API Routes Removidas
- Removido `/app/api/leads/route.ts` (não utilizado)
- Sistema atual redireciona direto para WhatsApp sem backend

### 3. Formulários
- `/aluno` - Coleta dados e redireciona para WhatsApp
- `/instrutor` - Coleta dados incluindo disponibilidade semanal e redireciona para WhatsApp

## Variáveis de Ambiente Necessárias

Configure no Vercel Dashboard:

```env
# Opcional - Apenas se quiser reativar o backend Prisma futuramente
DATABASE_URL="postgresql://..."
```

## Como Fazer Deploy

### Opção 1: Via GitHub (Recomendado)
1. Conecte o repositório GitHub ao Vercel
2. Vercel detectará automaticamente Next.js
3. Configure variáveis de ambiente (se necessário)
4. Deploy automático a cada push

### Opção 2: Via Vercel CLI
```bash
# Instalar CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

## Build Commands

O Vercel usará automaticamente:
- **Build Command**: `pnpm run build` (executará `prisma generate && next build`)
- **Output Directory**: `.next`
- **Install Command**: `pnpm install` (executará postinstall automaticamente)

## Troubleshooting

### Erro: "Cannot find module '.prisma/client'"
✅ **Resolvido** - Scripts de postinstall e build foram atualizados

### Build Scripts Warning
O aviso sobre ignored build scripts do Prisma é normal e pode ser ignorado. O Prisma será gerado via `prisma generate`.

### Performance
- Site 100% estático (exceto formulários client-side)
- Sem dependências de banco de dados em runtime
- Deploy rápido e otimizado

## Recursos Implementados

- ✅ Landing page completa e responsiva
- ✅ Seção hero com CTAs para WhatsApp
- ✅ Formulário de aluno com validação
- ✅ Formulário de instrutor com disponibilidade semanal
- ✅ SEO otimizado com meta tags e structured data
- ✅ Sitemap.xml estático e dinâmico
- ✅ Analytics da Vercel integrado
- ✅ Design system com cores da Via Betel
- ✅ Cross-browser compatibility
- ✅ Mobile-first responsive

## Próximos Passos

1. Deploy no Vercel
2. Configurar domínio personalizado
3. Testar formulários em produção
4. Monitorar analytics
5. Adicionar Google Search Console
