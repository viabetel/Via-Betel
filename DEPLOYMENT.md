# Guia de Deploy - Via Betel

## Deploy Rápido no Vercel

### Passo 1: Preparar Banco de Dados

#### Opção A: Neon (Recomendado)
1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a `DATABASE_URL` fornecida

#### Opção B: Supabase
1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a Connection String (modo URI)

### Passo 2: Deploy no Vercel

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://...
   ```
5. Clique em "Deploy"

### Passo 3: Configurar Banco de Dados

Após o deploy, execute no terminal local:

```bash
# Com DATABASE_URL do Vercel/Neon/Supabase
DATABASE_URL="sua_url_aqui" npx prisma db push
```

Ou use o Vercel CLI:

```bash
vercel env pull .env
npx prisma db push
```

### Passo 4: Testar

1. Acesse sua URL do Vercel
2. Teste o fluxo:
   - Clique em "Chamar no WhatsApp" no hero
   - Acesse `/aluno` e preencha o formulário
   - Verifique se abre o WhatsApp com os dados

## Comandos Úteis

```bash
# Build local
npm run build

# Testar build local
npm start

# Migrations (desenvolvimento)
npx prisma migrate dev

# Push schema (produção)
npx prisma db push

# Visualizar banco
npx prisma studio
```

## Troubleshooting

### Erro: Prisma Client não encontrado
```bash
npx prisma generate
```

### Erro: Cannot connect to database
- Verifique se a `DATABASE_URL` está correta
- Confirme que o IP do Vercel está na whitelist (Neon/Supabase geralmente permitem todos)

### Build falha no Vercel
- Certifique-se que `prisma generate` está no `postinstall` do package.json
- Verifique os logs do Vercel para erros específicos

## Analytics (Opcional)

### Google Analytics 4
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Meta Pixel
```env
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
```

Adicione essas variáveis no Vercel Dashboard > Settings > Environment Variables

## Monitoramento

### Leads no Banco
Use Prisma Studio ou conecte-se direto ao PostgreSQL:
```bash
npx prisma studio
```

### Logs do Vercel
- Acesse o Dashboard do Vercel
- Selecione seu projeto
- Vá em "Logs" para ver requisições e erros

---

✅ Com isso, sua aplicação estará rodando em produção com banco de dados real e tracking de conversões!
