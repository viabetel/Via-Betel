# Configuração de Envio de Emails - Via Betel

## ⚠️ CONFIGURAÇÃO ATUAL

O sistema está configurado para enviar emails para: **contatoviabetel@gmail.com**

A API Key do Resend já está configurada: `re_LruyNf8d_8h82SE6ooi4PzN4AaaNwPwHf`

## ✅ Pronto para Uso

O sistema já está funcionando! Quando alguém preencher o formulário de aluno ou instrutor:
1. Um email será enviado automaticamente para **contatoviabetel@gmail.com**
2. O usuário será redirecionado para WhatsApp (mantém funcionalidade existente)

## 📧 Como Funciona

### Modo Sandbox (Configuração Atual)
O sistema usa o domínio sandbox do Resend (`onboarding@resend.dev`) que funciona imediatamente.

**Limitação Importante**: Em modo sandbox, o Resend **só permite enviar emails para o email cadastrado na conta Resend**. Certifique-se de que contatoviabetel@gmail.com está cadastrado como email principal na sua conta Resend, caso contrário os emails não serão entregues.

### O que você receberá por email

#### Formulário de Aluno
- Nome completo
- WhatsApp
- Cidade/UF
- Categoria desejada (A, B, C, D, E)
- Objetivo
- Melhor horário para aulas

#### Formulário de Instrutor
- Nome completo
- WhatsApp
- Cidade/UF
- Categorias que ensina
- Anos de experiência
- Possui veículo próprio
- Disponibilidade semanal completa (dias e períodos)

## 🚀 Como Testar

1. Acesse /aluno ou /instrutor no site
2. Preencha o formulário com dados de teste
3. Clique em enviar
4. Verifique o email em **contatoviabetel@gmail.com** (pode cair no spam na primeira vez)

## 🔧 Configuração no Vercel

As variáveis de ambiente necessárias no Vercel:

```
RESEND_API_KEY=re_LruyNf8d_8h82SE6ooi4PzN4AaaNwPwHf
```

Não é necessário configurar `EMAIL_TO` pois já está fixo no código como `contatoviabetel@gmail.com`.

## 📨 Domínio Personalizado (Opcional - Futuro)

Se quiser usar um email personalizado como `noreply@viabetel.com`:

### Passo 1: Verificar Domínio no Resend
1. Acesse: https://resend.com/domains
2. Clique em **Add Domain**
3. Digite `viabetel.com`
4. Configure os registros DNS fornecidos pelo Resend:
   - **SPF**: `v=spf1 include:_spf.resend.com ~all`
   - **DKIM**: (valor fornecido pelo Resend)
   - **DMARC** (opcional): `v=DMARC1; p=none`

### Passo 2: Atualizar o Código
Após domínio verificado, edite `app/api/send-email/route.ts`:

```typescript
from: "Via Betel <noreply@viabetel.com>",
```

Com domínio verificado, você poderá enviar para qualquer email.

## 🐛 Troubleshooting

**Emails não chegam**
- Verifique se contatoviabetel@gmail.com é o email principal da sua conta Resend
- Verifique a caixa de spam de contatoviabetel@gmail.com
- Acesse os logs do Vercel: Dashboard → Functions → última execução
- Procure por erros com `[v0]` no início

**Erro 403 - Domain not verified**
- Normal em modo sandbox
- Certifique-se de que contatoviabetel@gmail.com é o email da conta Resend
- Para enviar para outros emails, você precisa verificar um domínio personalizado

**Erro 401 - Invalid API Key**
- Verifique se a API Key está configurada corretamente no Vercel
- Faça um novo deploy após configurar variáveis

## 📊 Plano Gratuito do Resend

- 100 emails por dia
- 3,000 emails por mês
- Perfeito para começar!
