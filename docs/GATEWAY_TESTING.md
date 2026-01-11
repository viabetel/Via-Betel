# Gateway de Login/Cadastro - Plano de Testes

## 7 Testes Críticos

### Teste 1: /inscricao com pré-seleção Aluno
- URL: `/inscricao?userType=student`
- Expected: Card "Aluno" com destaque
- Status: ✓ Implementado

### Teste 2: /inscricao com pré-seleção Instrutor
- URL: `/inscricao?userType=instructor`
- Expected: Card "Instrutor" com destaque
- Status: ✓ Implementado

### Teste 3: Criar conta como Aluno com returnTo
- URL: `/inscricao?userType=student&returnTo=/marketplace`
- Click: "Criar conta"
- Expected: Redirect `/auth/sign-up?userType=student&returnTo=/marketplace`
- Status: ✓ Implementado

### Teste 4: Login modal com Google (Instrutor)
- URL: `/inscricao?userType=instructor`
- Click: "Já tenho conta" em Instrutor
- Click: "Google"
- Expected: OAuth com userType=instructor no callback
- Status: ✓ Implementado

### Teste 5: Header CTA "Começar" (deslogado)
- Click: Header "Começar"
- Expected: Redirect `/inscricao`
- Status: ✓ Implementado

### Teste 6: Guard - Deslogado tenta /aluno
- URL: `/aluno` (deslogado)
- Expected: Redirect `/inscricao?returnTo=%2Faluno`
- Status: ✓ Implementado

### Teste 7: Guard - Instrutor com status NONE tenta /instrutor/dashboard
- URL: `/instrutor/dashboard` (logado, instructor_status=NONE)
- Expected: Redirect `/instrutor/ativar`
- Status: ✓ Implementado

## Arquivos Alterados
1. app/inscricao/page.tsx - Gateway oficial com modal login
2. app/auth/sign-up/sign-up-content.tsx - Suporte returnTo
3. components/header-content.tsx - CTAs para /inscricao
4. app/page.tsx - CTAs estratégicos
5. lib/supabase/middleware.ts - Guards com redirects

## Deploy Checklist
- [ ] Testar 7 casos de teste manuais
- [ ] Verificar returnTo em todas as jornadas
- [ ] Testar Google OAuth com userType
- [ ] Verificar guards do middleware
- [ ] Testar no mobile e desktop
