# Google OAuth Setup - Via Betel

## Passo 1: Configurar no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client ID**
5. Escolha **Web application**
6. Configure:

### Authorized JavaScript origins
```
https://viabetel.com
https://viabetel.vercel.app
http://localhost:3000
```

### Authorized redirect URIs
```
https://viabetel.com/auth/callback
https://viabetel.vercel.app/auth/callback
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

7. Copie o **Client ID** e **Client Secret**

## Passo 2: Configurar no Supabase

1. Acesse: https://supabase.com/dashboard/project/[PROJECT_ID]/auth/providers
2. Encontre **Google** na lista de providers
3. Ative o toggle "Enable Sign in with Google"
4. Cole o **Client ID** e **Client Secret** do Google
5. Copie o **Callback URL** fornecido pelo Supabase (ex: `https://[PROJECT_ID].supabase.co/auth/v1/callback`)
6. Adicione essa URL também nas **Authorized redirect URIs** do Google Console

## Passo 3: Variáveis de Ambiente (já configuradas no Vercel)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://goprgbfccixpwvshonvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
NEXT_PUBLIC_SITE_URL=https://viabetel.com
```

## Passo 4: Testar

1. Acesse: https://viabetel.com/auth/login
2. Clique em "Continuar com Google"
3. Faça login com sua conta Google
4. Você será redirecionado para `/auth/callback` e depois para a home `/`

## Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL de callback está exatamente igual no Google Console e no Supabase
- Não esqueça de adicionar todas as variações (localhost, preview, produção)

### Erro: "Email not confirmed"
- Configure o email template no Supabase Dashboard
- Ou desabilite confirmação de email em Development (não recomendado para produção)

### Usuário não aparece no banco
- Verifique se a tabela `profiles` existe
- Execute o script SQL para criar a tabela (se necessário)

## Fluxo Completo

1. Usuário clica "Continuar com Google"
2. Redireciona para Google OAuth
3. Google redireciona para Supabase callback
4. Supabase redireciona para `/auth/callback` da aplicação
5. App troca o code por session
6. Redireciona para home `/` com sessão ativa
