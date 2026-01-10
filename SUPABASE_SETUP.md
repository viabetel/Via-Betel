# Supabase Setup - Via Betel Trust System

## ⚠️ IMPORTANTE: Execute este script no Supabase SQL Editor

O sistema de confiança (chat, leads tracking, perfis) requer tabelas no banco Supabase.

### Passo a Passo

1. **Acesse o Supabase Dashboard**
   - Vá em: https://supabase.com/dashboard/project/goprgbfccixpwvshonvx/sql
   - Ou clique em: SQL Editor no menu lateral

2. **Copie o conteúdo do arquivo**
   - Abra: `scripts/002_complete_trust_system.sql`
   - Copie TODO o conteúdo (Ctrl+A, Ctrl+C)

3. **Cole no SQL Editor**
   - Cole no editor SQL do Supabase
   - Clique em "Run" (ou pressione Ctrl+Enter)

4. **Aguarde a execução**
   - Deve demorar ~5 segundos
   - Você verá: "Via Betel Trust System schema created successfully!"

5. **Verifique as tabelas criadas**
   - Vá em: Table Editor
   - Você deve ver:
     - `profiles` - Perfis de usuários (alunos/instrutores)
     - `leads` - Solicitações de orçamento
     - `threads` - Conversas de chat
     - `messages` - Mensagens
     - `lead_events` - Timeline de eventos

### O que o script faz?

- ✅ Cria 5 tabelas com relacionamentos
- ✅ Habilita RLS (Row Level Security) em todas
- ✅ Cria políticas de acesso (users só veem seus dados)
- ✅ Adiciona índices para performance
- ✅ Habilita Realtime para mensagens instantâneas
- ✅ Cria função `get_unread_count()` para badge de notificações

### Verificação

Execute este SQL para verificar se deu certo:

```sql
SELECT 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'leads', 'threads', 'messages', 'lead_events');
```

Deve retornar 5 linhas.

### RLS Policies

Todas as tabelas têm RLS habilitado:

- **profiles**: Usuários só veem/editam próprio perfil
- **leads**: Alunos só veem próprias solicitações
- **threads**: Participantes veem apenas suas conversas
- **messages**: Usuários veem apenas mensagens de suas threads
- **lead_events**: Alunos veem eventos de suas próprias leads

### Problemas?

**Erro "relation does not exist"**: Certifique-se de executar o script completo

**Erro de permissão**: Você precisa ser admin do projeto Supabase

**Tabelas já existem**: O script tem `IF NOT EXISTS`, é seguro rodar múltiplas vezes

### Próximos Passos

Após executar o script, o sistema funcionará corretamente:

1. ✅ Signup criará perfil automático
2. ✅ Chat funcionará com Realtime
3. ✅ Badge de notificações mostrará mensagens não lidas
4. ✅ Timeline de leads mostrará status em tempo real

---

**Última atualização**: Sistema de Confiança Via Betel v1.0
