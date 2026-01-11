# Marketplace Real - Guia de Testes Completo

## Configuração Inicial

1. Execute a migration SQL:
   - `scripts/009_marketplace_real.sql` (tabelas principais)
   - `scripts/010_marketplace_storage.sql` (buckets)

2. Verifique env vars em Supabase:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

## 15 Testes Manuais

### Aluno - Criação de Solicitação
1. Acesse `/solicitacoes/nova`
2. Preencha: título (min 10), descrição (min 20), categoria A-E, cidade
3. Clique "Criar Solicitação"
4. ✅ Esperado: Redirecionado para `/solicitacoes/[id]`, status = NEW
5. Verifique `request_events` tem CREATED event

### Instructor - Listar Solicitações
6. Acesse `/instrutor/solicitacoes`
7. Veja solicitações com status NEW/VIEWED
8. ✅ Esperado: Lista com filtros por categoria/cidade
9. Clique numa solicitação → vai para detail

### Chat Realtime
10. Em `/solicitacoes/[id]`, envie mensagem como aluno
11. ✅ Esperado: Mensagem aparece em tempo real (Supabase subscription)
12. Como instructor, envie resposta
13. ✅ Esperado: Aluno vê resposta realtime

### Upload de Anexo
14. Em chat, clique "Upload"
15. Selecione arquivo (PNG, JPG, PDF, até 10MB)
16. ✅ Esperado: Arquivo enviado para bucket `chat_attachments`, aparece no chat

### Rate Limit
17. Crie 6 solicitações rapidamente
18. ✅ Esperado: Sexta é bloqueada (limit 5/hora)
19. Verifique header `X-RateLimit-Remaining`

### Status Transitions
20. Instructor: clique "Responder" em solicitação
21. ✅ Esperado: Status NEW → RESPONDED
22. Aluno: clique "Concordar com Proposta"
23. ✅ Esperado: Status RESPONDED → AGREED
24. Após aula: clique "Marcar como Concluída"
25. ✅ Esperado: Status AGREED → COMPLETED

### Verificação de Instrutor
26. Acesse `/instrutor/verificacao`
27. Faça upload: CNH, Certificado, Vínculo
28. ✅ Esperado: Documentos salvos com status PENDING_DOCS
29. Em `/admin`, veja documentos pendentes
30. Clique "Aprovar" ou "Rejeitar"
31. ✅ Esperado: Status muda para VERIFIED ou REJECTED

### Bloqueio de Usuário
32. Admin: vá para `/admin` e clique "Banir usuário"
33. ✅ Esperado: Usuário não consegue criar solicitações
34. Verifique erro "User is banned"

### Audit Logs
35. Após testes, verifique `audit_logs` table
36. ✅ Esperado: Tem entradas para CREATE_REQUEST, MESSAGE_SENT, etc
37. Clique em audit log para ver detalhes

### Timeout de Solicitação
38. Crie solicitação com data no passado
39. ✅ Esperado: `expiresAt` é 30 dias no futuro
40. (Teste de expiração manual após 30 dias)

## Testes de Segurança

- Tente acessar `/instrutor/solicitacoes` como aluno
  - ✅ Esperado: Redirecionado para `/marketplace`
- Tente modificar solicitação de outro usuário
  - ✅ Esperado: 403 Forbidden (RLS previne via DB)
- Tente enviar mensagem em conversa não-participante
  - ✅ Esperado: 403 Forbidden

## Checklist Final

- [ ] Migration 009 e 010 executadas
- [ ] Todas as 15 páginas/rotas criadas
- [ ] Chat realtime testado
- [ ] Upload de arquivos testado
- [ ] Rate limit testado
- [ ] Status transitions testados
- [ ] Verificação de instrutor testada
- [ ] Admin console testado
- [ ] Bloqueio de usuário testado
- [ ] Audit logs testados
- [ ] RLS funcionando em todas as tabelas
- [ ] Sem erros no build (`npm run build`)
