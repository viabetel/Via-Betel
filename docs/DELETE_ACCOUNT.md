# Excluir Conta - Documentação Completa

## Visão Geral

Sistema seguro de exclusão de conta que remove todos os dados do usuário de forma transacional e permanente, incluindo:
- Dados do usuário no Prisma (Instructor, Subscription, Boosts, MonthlyChatUsage, etc.)
- Profile do Supabase
- Usuário da Supabase Auth

## Arquivos Implementados

### 1. Backend - API Segura
**Arquivo:** `app/api/account/delete/route.ts`

- POST `/api/account/delete`
- Valida autenticação via Supabase Auth
- Exige confirmação digitada: "EXCLUIR"
- Executa deleção em transação Prisma
- Remove usuário do Supabase Auth com service role key
- Trata erros de forma segura

### 2. Supabase Admin Client
**Arquivo:** `lib/supabase/admin.ts`

- Cria cliente admin usando `SUPABASE_SERVICE_ROLE_KEY`
- Função `createAdminClient()` para operações admin-only
- Nunca exposto ao client-side

### 3. UI / Frontend
**Arquivo:** `app/conta/configuracoes/configuracoes-client.tsx`

- Seção "Zona de Perigo" na página de configurações
- Modal de confirmação com avisos visuais (vermelho)
- Input para digitar "EXCLUIR" (case-insensitive)
- Loading state e tratamento de erros
- Logout automático após sucesso
- Redirecionamento para home

## Env Vars Necessárias

Verifique se estão configuradas no Vercel (Settings > Environment Variables):

| Variável | Descrição | Status |
|----------|-----------|--------|
| `SUPABASE_URL` | URL do projeto Supabase | ✓ Presente |
| `SUPABASE_ANON_KEY` | Chave anônima (client) | ✓ Presente |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave admin (server-only) | ✓ Presente |
| `DATABASE_URL` | URL do banco com pooler | ✓ Presente |
| `DIRECT_URL` | URL direta para migrations | ✓ Presente |

## Fluxo de Exclusão

```
1. Usuário clica "Excluir minha conta"
   ↓
2. Modal pede confirmação digitando "EXCLUIR"
   ↓
3. Botão habilitado → POST /api/account/delete
   ↓
4. Valida autenticação (user.id)
   ↓
5. Busca instructor vinculado ao email
   ↓
6. Deleta em transação Prisma:
   - LeadProposals do instrutor
   - Boosts do instrutor
   - Subscriptions do instrutor
   - Instructor
   - MonthlyChatUsage do usuário
   - ConversationUsageLog do usuário
   ↓
7. Deleta profile no Supabase (tabela public.profiles)
   ↓
8. Deleta usuário do Supabase Auth (admin client)
   ↓
9. Frontend faz logout
   ↓
10. Redireciona para / com ?deleted=true
```

## Segurança

- ✓ Validação de autenticação no servidor
- ✓ Proteção contra CSRF (Next.js nativo)
- ✓ Service role key nunca exposta no client
- ✓ Transação atômica (tudo ou nada)
- ✓ Sem exposição de IDs de outros usuários
- ✓ Confirmação obrigatória digitada

## Tabelas Afetadas

| Modelo | Ação | Motivo |
|--------|------|--------|
| Instructor | DELETE | Removido com cascata |
| LeadProposal | DELETE CASCADE | FK instructorId |
| Subscription | DELETE CASCADE | FK instructorId |
| Boost | DELETE CASCADE | FK instructorId |
| MonthlyChatUsage | DELETE | Limpeza de uso |
| ConversationUsageLog | DELETE | Limpeza de logs |
| public.profiles | DELETE | Supabase |
| auth.users | DELETE | Supabase Auth |

## Checklist de Testes Manuais

### ✓ Teste 1: Usuário comum deleta conta com sucesso
```
1. Faça login como usuário comum
2. Vá para /conta/configuracoes
3. Role até "Zona de Perigo"
4. Clique "Excluir minha conta"
5. Modal abre
6. Digite "EXCLUIR" no input
7. Botão "Excluir permanentemente" habilita
8. Clique no botão
9. Loading state mostra "Excluindo..."
10. Redirecionado para home
11. ✓ Verificar: Usuário deslogado, session vazia
```

### ✓ Teste 2: Instrutor deleta conta e dados são removidos
```
1. Faça login como instrutor
2. Vá para /conta/configuracoes
3. Execute exclusão (conforme Teste 1)
4. Verifique no Supabase:
   - Instructor deletado
   - LeadProposals deletadas
   - Subscription deletada
   - Boosts deletados
   - MonthlyChatUsage deletado
5. ✓ Verificar: Todos os dados removidos
```

### ✓ Teste 3: Confirmação "EXCLUIR" é obrigatória
```
1. Abra o modal
2. Digite "EXCLUIR CONTA" (errado)
3. ✓ Verificar: Botão desabilitado
4. Limpe e digite "EXCLUIR" (correto)
5. ✓ Verificar: Botão habilitado
```

### ✓ Teste 4: Tentar chamar API deslogado retorna 401
```
1. Faça logout
2. No console do navegador, execute:
   fetch('/api/account/delete', {
     method: 'POST',
     body: JSON.stringify({ confirmation: 'EXCLUIR' })
   })
3. ✓ Verificar: Resposta 401 "Não autorizado"
```

### ✓ Teste 5: Confirmação inválida retorna erro
```
1. Faça login
2. No console, execute:
   fetch('/api/account/delete', {
     method: 'POST',
     body: JSON.stringify({ confirmation: 'INCORRETO' })
   })
3. ✓ Verificar: Resposta 400 "Confirmação inválida"
```

### ✓ Teste 6: Erro no deletion mostra mensagem clara
```
1. Edite a API para simular erro (adicione throw)
2. Execute exclusão
3. ✓ Verificar: Toast/modal mostra mensagem de erro
4. Usuário ainda logado (não deslogou)
```

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| "Não autorizado" (401) | User deslogado | Fazer login antes |
| "Confirmação inválida" (400) | Digitou errado | Deve ser "EXCLUIR" |
| "Erro ao excluir conta do sistema de autenticação" | Service role key inválida | Verificar `SUPABASE_SERVICE_ROLE_KEY` no Vercel |
| Usuário deletado mas ainda logado | Session em cache | Limpar cookies/storage do navegador |
| Profile não deleta | Tabela não existe | Criar `public.profiles` no Supabase |

## Próximos Passos (Opcional)

- [ ] Implementar soft-delete (marcar como deletado vs remover)
- [ ] Adicionar email de confirmação antes de deletar
- [ ] Implementar retenção de dados por X dias antes de deletar
- [ ] Adicionar log de auditoria "Account Deleted"
- [ ] Reutilizar email deletado após 30 dias
