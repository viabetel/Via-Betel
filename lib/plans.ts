export interface PlanFeature {
  text: string
  included: boolean
}

export interface Plan {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  interval: "MONTHLY" | "YEARLY"
  features: string[]
  maxListings: number
  highlight: boolean
  badge: string | null
}

export const PLAN_BADGES: Record<string, { label: string; color: string; bgColor: string }> = {
  verificado: {
    label: "Verificado",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  pro: {
    label: "PRO",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
}

export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return "Grátis"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100)
}

export function formatPricePerMonth(priceCents: number, interval: "MONTHLY" | "YEARLY"): string {
  if (priceCents === 0) return "R$ 0"
  const monthly = interval === "YEARLY" ? priceCents / 12 : priceCents
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(monthly / 100)
}

export type PlanId = "single" | "pack5" | "pack10"

export interface LessonPlan {
  name: string
  lessons: number
  price: number
  pricePerLesson: number
  badge?: string
  popular?: boolean
}

export const PLANS: Record<PlanId, LessonPlan> = {
  single: {
    name: "Aula Avulsa",
    lessons: 1,
    price: 12000, // R$ 120,00 em centavos
    pricePerLesson: 12000,
  },
  pack5: {
    name: "Pacote 5 Aulas",
    lessons: 5,
    price: 55000, // R$ 550,00 em centavos
    pricePerLesson: 11000,
    badge: "ECONOMIA 8%",
    popular: true,
  },
  pack10: {
    name: "Pacote 10 Aulas",
    lessons: 10,
    price: 100000, // R$ 1.000,00 em centavos
    pricePerLesson: 10000,
    badge: "ECONOMIA 17%",
  },
}
