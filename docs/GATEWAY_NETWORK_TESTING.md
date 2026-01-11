# Checklist de Testes - Gateway com DevTools Network

## Objetivo
Validar que a navegação do gateway é SPA (sem page reload) exceto quando apropriado.

---

## Setup Prévio
1. Abra DevTools (F12) → Aba "Network"
2. Configure filtro para "Fetch/XHR" apenas (não mostrar recursos estáticos)
3. Limpe cache do browser (DevTools → ⋮ → "Limpar cache do navegador")

---

## Teste 1: Header "Começar" → /inscricao
**Esperado**: SPA navegação (1 document request)

### Steps:
1. Acesse https://viabetel.com
2. Abra DevTools Network
3. Clique no botão "Começar" no header
4. Observe o Network

**Evidência Esperada**:
- ✅ 1 request type "document" para /inscricao
- ✅ Status 200
- ✅ Sem recarregar a página inteira
- ✅ TopLoadingBar anima por 800ms

**Rejeitar Se**:
- ❌ Múltiplos document requests
- ❌ Full page reload (window.location)
- ❌ Status de erro

---

## Teste 2: /inscricao "Criar conta" → /auth/sign-up
**Esperado**: SPA navegação com pré-seleção de userType

### Steps:
1. Clique em "Começar" (Test 1)
2. Em /inscricao, clique no card "Aluno"
3. Clique no botão "Criar conta"
4. Observe o Network

**Evidência Esperada**:
- ✅ 1 request type "document" para /auth/sign-up?userType=student
- ✅ Botão mostra "Redirecionando..." com spinner
- ✅ TopLoadingBar anima novamente
- ✅ URL muda para /auth/sign-up

**Rejeitar Se**:
- ❌ Botão sem feedback visual durante clique
- ❌ window.location redirect (hard navigation)
- ❌ Perda do parâmetro userType

---

## Teste 3: /inscricao "Já tenho conta" → Modal de Login
**Esperado**: Modal abre SEM navegação (não há document request)

### Steps:
1. Em /inscricao (Test 1), clique no card "Aluno"
2. Clique em "Já tenho conta"
3. Observe o Network

**Evidência Esperada**:
- ✅ ZERO requests (modal abre localmente)
- ✅ Sem TopLoadingBar
- ✅ Botão "Já tenho conta" não tem feedback de loading
- ✅ Modal aparece com campos de email/senha

**Rejeitar Se**:
- ❌ 1 ou mais document requests
- ❌ Page reload
- ❌ TopLoadingBar anima

---

## Teste 4: Modal Login - Envio de Email/Senha
**Esperado**: POST para /auth/callback + SPA redirect

### Steps:
1. Em /inscricao, abra modal "Já tenho conta"
2. Digite email + senha válidos
3. Clique em "Entrar"
4. Observe o Network (inclua Fetch/XHR + Doc)

**Evidência Esperada**:
- ✅ 1 POST request para validação de senha
- ✅ Após sucesso, 1 document request para /aluno ou /instrutor
- ✅ Botão "Entrar" mostra "Entrando..." com spinner
- ✅ TopLoadingBar anima após POST
- ✅ Redirecionamento é SPA (não é location.href)

**Rejeitar Se**:
- ❌ Múltiplos POSTs (retry de clique)
- ❌ window.location.href redirect
- ❌ Botão sem feedback durante POST

---

## Teste 5: Header "Entrar" → /inscricao?mode=login
**Esperado**: SPA navegação com modal de login pré-aberto

### Steps:
1. Volte para Home
2. Clique em "Entrar" no header
3. Observe o Network

**Evidência Esperada**:
- ✅ 1 document request para /inscricao?mode=login
- ✅ Modal de login abre automaticamente (sem clique extra)
- ✅ TopLoadingBar anima
- ✅ Sem reload da página

**Rejeitar Se**:
- ❌ Modal não abre automaticamente
- ❌ URL sem parâmetro mode=login
- ❌ window.location redirect

---

## Teste 6: Redirecionamento com returnTo
**Esperado**: SPA navegação + preservação de returnTo via sessionStorage

### Steps:
1. Acesse `/marketplace` como deslogado
2. Middleware redireciona para `/inscricao?returnTo=/marketplace`
3. Faça login
4. Observe o Network + URL final

**Evidência Esperada**:
- ✅ 1 document request para /inscricao
- ✅ URL contém ?returnTo=/marketplace
- ✅ Após login, redirecionamento para /marketplace (1 document request)
- ✅ returnTo foi lido do sessionStorage
- ✅ Sem reload, SPA puro

**Rejeitar Se**:
- ❌ returnTo perdido após login
- ❌ Múltiplos redirects (ex: /inscricao → /aluno → /marketplace)
- ❌ window.location redirect

---

## Teste 7: Google OAuth Redirect (Externo - ESPERADO HARD)
**Esperado**: Hard navigation para Google OAuth (window.location redirect LEGÍTIMO)

### Steps:
1. Em /inscricao, clique em "Cadastro com Google"
2. Observe o Network

**Evidência Esperada**:
- ✅ Botão mostra "Conectando..." com spinner
- ✅ Redireciona para accounts.google.com (hard redirect, esperado)
- ✅ URL contém parâmetros userType + returnTo codificados
- ✅ Após Google auth, volta para /auth/callback com code

**Rejeitar Se**:
- ❌ Botão sem feedback
- ❌ Erro de redirect para Google
- ❌ Parâmetros userType/returnTo perdidos

---

## Resumo de Validação

| Teste | SPA? | Document Requests | TopLoadingBar | Feedback de Button | Status |
|-------|------|------------------|---------------|-------------------|--------|
| 1 - Header Começar | ✅ | 1 | Sim | N/A | ✅ |
| 2 - Criar Conta | ✅ | 1 | Sim | Spinner | ✅ |
| 3 - Modal Login | ✅ | 0 | Não | Sem feedback | ✅ |
| 4 - Email/Senha | ✅ | 1 POST + 1 Doc | Sim | Spinner | ✅ |
| 5 - Header Entrar | ✅ | 1 | Sim | N/A | ✅ |
| 6 - returnTo | ✅ | 2 (inscricao + final) | Sim | Spinner | ✅ |
| 7 - Google OAuth | ❌ (Hard, esperado) | Hard redirect | Sim | Spinner | ✅ |

---

## Conclusão
Se todos os 7 testes passarem com ✅, o gateway está 100% funcional e otimizado para produção com:
- ✅ SPA navegação pura (sem page reload)
- ✅ Feedback visual em toda transição
- ✅ TopLoadingBar global indicando navegação
- ✅ returnTo preservado e funcional
- ✅ Google OAuth com hard redirect esperado
- ✅ Sem cliques duplos (buttons disabled durante loading)
