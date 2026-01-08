# Configuração de Envio de Emails - Via Betel

## ⚠️ AÇÃO NECESSÁRIA - Configure no Vercel

Você precisa adicionar as variáveis de ambiente no seu projeto Vercel:

1. Acesse: https://vercel.com/seu-usuario/seu-projeto/settings/environment-variables
2. Adicione as seguintes variáveis:

```
RESEND_API_KEY=re_LruyNf8d_8h82SE6ooi4PzN4AaaNwPwHf
EMAIL_TO=seuemail@exemplo.com
```

3. **IMPORTANTE**: Substitua `seuemail@exemplo.com` pelo email onde você quer receber as notificações
4. Clique em "Save" e faça um novo deploy

---

## Como Funciona

O sistema agora envia emails automáticos sempre que um aluno ou instrutor preenche o formulário. Os dados são enviados tanto para seu email quanto mantém o redirecionamento para WhatsApp.

## Configuração Rápida com Resend (Recomendado)

### Passo 1: Crie uma conta no Resend
- Acesse: https://resend.com
- Crie uma conta gratuita (100 emails/dia grátis)

### Passo 2: Obtenha sua API Key
- No dashboard do Resend, vá em "API Keys"
- Clique em "Create API Key"
- Copie a chave gerada (começa com `re_`)

### Passo 3: Configure as Variáveis de Ambiente no Vercel
- Acesse seu projeto no Vercel
- Vá em **Settings → Environment Variables**
- Adicione as seguintes variáveis:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_TO=seuemail@exemplo.com
```

**Importante**: O `EMAIL_TO` deve ser o email onde você quer receber as notificações de cadastro.

### Passo 4: Faça novo deploy
- O Vercel vai aplicar as novas variáveis automaticamente
- Ou force um novo deploy em: Deployments → Redeploy

## Domínio de Email

### Modo Sandbox (Padrão)
Por padrão, o sistema usa `onboarding@resend.dev` que funciona **imediatamente sem configuração**.

**Limitações do Sandbox:**
- Só envia emails para o endereço cadastrado na conta Resend
- Perfeito para desenvolvimento e testes

### Domínio Personalizado (Opcional)
Para usar `noreply@viabetel.com.br`:

1. No Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite `viabetel.com.br`
4. Configure os registros DNS no seu provedor:
   - **SPF**: TXT record
   - **DKIM**: TXT record  
   - **DMARC**: TXT record (opcional)
5. Aguarde verificação (pode levar até 24h)
6. Atualize o código em `app/api/send-email/route.ts`:
   ```typescript
   from: "Via Betel <noreply@viabetel.com.br>",
   ```

## O que você receberá por email

### Formulário de Aluno
- Nome completo
- WhatsApp
- Cidade/UF
- Categoria desejada (A, B, C, D, E)
- Objetivo
- Melhor horário para aulas

### Formulário de Instrutor
- Nome completo
- WhatsApp
- Cidade/UF
- Categorias que ensina
- Anos de experiência
- Possui veículo próprio
- Disponibilidade semanal completa (dias e períodos)

## Verificar se está funcionando

Após configurar:

1. **Preencha um formulário de teste**
2. **Verifique seu email** (pode cair no spam na primeira vez)
3. **Se não receber**, verifique os logs do Vercel:
   - Dashboard → seu projeto
   - Functions → clique na última execução
   - Veja os logs de erro

## Modo de Desenvolvimento Local

Sem `RESEND_API_KEY` configurada, o sistema registra os emails no console do servidor para você testar localmente sem precisar configurar nada.

## Troubleshooting

**Erro 403 - Domain not verified**
- Use o domínio sandbox `onboarding@resend.dev` (já configurado por padrão)
- Ou verifique seu domínio personalizado no Resend

**Emails não chegam**
- Verifique a caixa de spam
- Confirme que `EMAIL_TO` está correto no Vercel
- Verifique os logs do Vercel para erros

**Erro 401 - Invalid API Key**
- Confirme que copiou a API Key completa do Resend
- Verifique se configurou `RESEND_API_KEY` no Vercel
- Faça um novo deploy após adicionar variáveis
