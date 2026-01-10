export const INSTRUCTOR_PLANS = {
  BASICO: {
    id: "price_basico_monthly",
    name: "Básico",
    price: 9900, // R$ 99/mês
    interval: "month",
    features: ["Perfil no catálogo", "Receber até 10 leads/mês", "Badge 'Verificado'", "Suporte por email"],
  },
  DESTAQUE: {
    id: "price_destaque_monthly",
    name: "Destaque",
    price: 19900, // R$ 199/mês
    interval: "month",
    popular: true,
    features: [
      "Tudo do Básico",
      "Leads ilimitados",
      "Destaque no topo da busca",
      "Badge 'Destaque'",
      "Suporte prioritário",
    ],
  },
  PRO: {
    id: "price_pro_monthly",
    name: "Pro",
    price: 29900, // R$ 299/mês
    interval: "month",
    features: ["Tudo do Destaque", "Vitrine na Home", "Badge 'Pro'", "Analytics avançado", "Suporte telefônico"],
  },
} as const

export const BOOST_ADD_ONS = {
  IMPULSIONAR_7_DIAS: {
    id: "price_impulsionar_7d",
    name: "Impulsionar 7 Dias",
    price: 4900, // R$ 49
    duration: 7,
    description: "Seu perfil aparece no topo da busca por 7 dias",
  },
  VITRINE_30_DIAS: {
    id: "price_vitrine_30d",
    name: "Vitrine Home 30 Dias",
    price: 14900, // R$ 149
    duration: 30,
    description: "Apareça na vitrine da home por 30 dias (máx. 3 por cidade)",
  },
} as const

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100)
}
