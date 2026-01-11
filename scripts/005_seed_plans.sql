-- Seed de planos para instrutores Via Betel
-- Execute apenas uma vez para criar os planos iniciais

-- Limpar planos existentes (opcional - remova se quiser manter dados)
-- DELETE FROM "plans";

-- Inserir planos
INSERT INTO "plans" (id, slug, name, description, "priceCents", interval, features, "maxListings", highlight, badge, "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'gratuito',
    'Gratuito',
    'Para começar na plataforma',
    0,
    'MONTHLY',
    '["Perfil básico no marketplace", "Até 3 solicitações/mês", "Chat com alunos"]'::jsonb,
    1,
    false,
    NULL,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'basico',
    'Básico',
    'Para instrutores que querem mais visibilidade',
    4990,
    'MONTHLY',
    '["Tudo do Gratuito", "Perfil destacado", "Até 10 solicitações/mês", "Badge Verificado", "Estatísticas básicas", "Suporte prioritário"]'::jsonb,
    3,
    false,
    'verificado',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'profissional',
    'Profissional',
    'Para instrutores que querem dominar o mercado',
    9990,
    'MONTHLY',
    '["Tudo do Básico", "Destaque no topo das buscas", "Solicitações ilimitadas", "Badge PRO exclusivo", "Estatísticas avançadas", "Suporte VIP 24h", "Selo de qualidade"]'::jsonb,
    10,
    true,
    'pro',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'profissional-anual',
    'Profissional Anual',
    'Melhor custo-benefício - economize 2 meses',
    99900,
    'YEARLY',
    '["Tudo do Profissional", "2 meses grátis (economize R$199)", "Destaque premium o ano todo", "Prioridade máxima nas buscas", "Consultoria de perfil personalizada"]'::jsonb,
    10,
    true,
    'pro',
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "priceCents" = EXCLUDED."priceCents",
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  "maxListings" = EXCLUDED."maxListings",
  highlight = EXCLUDED.highlight,
  badge = EXCLUDED.badge,
  "updatedAt" = NOW();
