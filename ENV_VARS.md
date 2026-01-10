# Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no Vercel Dashboard (Settings > Environment Variables):

## Database (Supabase)
- `DATABASE_URL` - URL de conexão PostgreSQL do Supabase
- `DIRECT_URL` - URL direta para migrations (opcional mas recomendado)

## Stripe
- `STRIPE_SECRET_KEY` - Chave secreta do Stripe (sk_...)
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook (whsec_...)
- `NEXT_PUBLIC_APP_URL` - URL da aplicação (ex: https://viabetel.com)

## Email (Gmail SMTP)
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER` - Email da conta Gmail
- `SMTP_PASS` - App Password do Gmail
- `EMAIL_FROM` - Email remetente
- `EMAIL_TO` - Email destinatário

## Como configurar Stripe Webhook

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio.vercel.app/api/webhooks/stripe`
4. Eventos a escutar: `checkout.session.completed`
5. Copie o signing secret (whsec_...) e adicione em `STRIPE_WEBHOOK_SECRET`
