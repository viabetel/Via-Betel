export const PLANS = {
  PLAN_1: {
    id: "PLAN_1",
    name: "1 Aula",
    lessons: 1,
    price: 14900, // R$ 149,00 em centavos
    pricePerLesson: 14900,
    description: "Ideal para experimentar",
    badge: null,
  },
  PLAN_5: {
    id: "PLAN_5",
    name: "5 Aulas",
    lessons: 5,
    price: 69900, // R$ 699,00
    pricePerLesson: 13980, // R$ 139,80 por aula
    description: "Mais popular",
    badge: "Economize 6%",
    popular: true,
  },
  PLAN_10: {
    id: "PLAN_10",
    name: "10 Aulas",
    lessons: 10,
    price: 129000, // R$ 1.290,00
    pricePerLesson: 12900, // R$ 129,00 por aula
    description: "Melhor custo-benefício",
    badge: "Economize 13%",
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlan(planId: string) {
  return PLANS[planId as PlanId] || null
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100)
}
