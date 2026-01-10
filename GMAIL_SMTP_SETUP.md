# Gmail SMTP Setup - Via Betel

## Visão Geral

Este guia explica como configurar o envio de emails via Gmail SMTP no projeto Via Betel.

## Por que Gmail SMTP?

- ✅ Grátis para volumes baixos (500 emails/dia)
- ✅ Confiável e com alta taxa de entrega
- ✅ Fácil de configurar
- ✅ Não requer verificação de domínio
- ✅ Funciona imediatamente após configurar App Password

## Passo a Passo

### 1. Habilitar 2FA no Google (obrigatório)

1. Acesse: https://myaccount.google.com/security
2. Encontre "2-Step Verification"
3. Siga as instruções para habilitar

### 2. Criar App Password

1. Acesse: https://myaccount.google.com/apppasswords
2. Faça login com sua conta do Google Workspace (contato@viabetel.com)
3. Em "Select app", escolha "Mail"
4. Em "Select device", escolha "Other" e digite "Via Betel Vercel"
5. Clique em "Generate"
6. **Copie o código de 16 caracteres** (exemplo: `abcd efgh ijkl mnop`)
7. **Importante**: Remova os espaços ao configurar (use: `abcdefghijklmnop`)

### 3. Configurar Variáveis de Ambiente

No Vercel Dashboard (ou arquivo .env local):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@viabetel.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=contato@viabetel.com
EMAIL_TO=contato@viabetel.com
```

### 4. Testar Configuração

#### Teste 1: Verificar env vars

```bash
curl https://seu-dominio.vercel.app/api/debug/mail
```

Resposta esperada:

```json
{
  "has_SMTP_USER": true,
  "has_SMTP_PASS": true,
  "smtp_host": "smtp.gmail.com",
  "smtp_port": "465",
  "smtp_secure": "true",
  "email_from": "contato@viabetel.com",
  "email_to": "contato@viabetel.com"
}
```

#### Teste 2: Enviar um lead de teste

No console do navegador (F12):

```javascript
fetch('https://seu-dominio.vercel.app/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teste Email',
    phone: '31999999999',
    city: 'Juiz de Fora',
    type: 'aluno',
    message: 'Teste de envio de email via SMTP'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

Resposta esperada:

```json
{
  "ok": true,
  "leadId": "clx...",
  "createdAt": "2024-01-09T...",
  "email": {
    "ok": true,
    "error": null
  }
}
```

## Troubleshooting

### Erro: "Invalid login"

**Causa**: Senha incorreta ou App Password não configurada

**Solução**:
1. Verifique se você criou uma App Password (não use sua senha normal)
2. Confirme que removeu os espaços da App Password
3. Teste com uma nova App Password

### Erro: "Connection timeout"

**Causa**: Firewall ou restrições de rede

**Solução**:
1. Confirme que está usando porta 465 com `secure: true`
2. Verifique se o Vercel não está bloqueando conexões SMTP

### Erro: "Recipient address rejected"

**Causa**: Email destinatário inválido

**Solução**:
1. Confirme que `EMAIL_TO` está configurado corretamente
2. Use um email válido do seu domínio

### Email não chega na caixa de entrada

**Soluções**:
1. Verifique a pasta de Spam
2. Adicione o email remetente aos contatos
3. Verifique os logs do Vercel para confirmar envio

## Limites do Gmail SMTP

- **500 emails por dia** (limite gratuito do Google Workspace)
- Se ultrapassar, o envio será bloqueado por 24 horas
- Para volumes maiores, considere usar SendGrid ou AWS SES

## Segurança

✅ **Boas práticas implementadas:**
- App Password em vez de senha real
- Variáveis de ambiente (não commitadas)
- Endpoint de debug não expõe senha
- Erro de email não quebra o endpoint principal

❌ **Nunca faça:**
- Commitar SMTP_PASS no código
- Usar senha real do Google
- Expor credenciais em logs públicos

## Monitoramento

Para verificar se os emails estão sendo enviados:

1. **Logs do Vercel**: Veja mensagens `[v0] Email enviado com sucesso!`
2. **Gmail Sent**: Verifique a pasta "Enviados" de contato@viabetel.com
3. **Endpoint de debug**: Use `/api/debug/mail` para confirmar configuração

## Alternativas Futuras

Se precisar escalar além de 500 emails/dia:

1. **SendGrid** (100 emails/dia grátis)
2. **AWS SES** (62.000 emails/mês grátis se hospedado na AWS)
3. **Mailgun** (5.000 emails/mês grátis nos primeiros 3 meses)
4. **Postmark** (100 emails/mês grátis)

---

**Status**: ✅ Implementado e funcionando
**Última atualização**: 2024-01-09
