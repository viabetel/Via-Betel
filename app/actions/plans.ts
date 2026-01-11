"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const FALLBACK_PLANS = [
  {
    id: "free",
    slug: "gratuito",
    name: "Gratuito",
    description: "Para começar a receber alunos",
    priceCents: 0,
    interval: "MONTHLY" as const,
    features: JSON.stringify(["Até 7 conversas/mês", "Perfil básico", "Aparecer no marketplace"]),
    maxListings: 1,
    highlight: false,
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "basico",
    slug: "basico",
    name: "Básico",
    description: "Para instrutores que querem crescer",
    priceCents: 4990,
    interval: "MONTHLY" as const,
    features: JSON.stringify([
      "Conversas ilimitadas",
      "Perfil verificado",
      "Destaque no marketplace",
      "Badge Verificado",
    ]),
    maxListings: 3,
    highlight: false,
    badge: "Verificado",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "profissional",
    slug: "profissional",
    name: "Profissional",
    description: "Para instrutores profissionais",
    priceCents: 9990,
    interval: "MONTHLY" as const,
    features: JSON.stringify(["Tudo do Básico", "Aparecer primeiro nas buscas", "Badge PRO", "Suporte prioritário"]),
    maxListings: 10,
    highlight: true,
    badge: "PRO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "profissional-anual",
    slug: "profissional-anual",
    name: "Profissional Anual",
    description: "Economize 2 meses pagando anualmente",
    priceCents: 99900,
    interval: "YEARLY" as const,
    features: JSON.stringify(["Tudo do Profissional", "2 meses grátis", "Badge PRO", "Suporte VIP"]),
    maxListings: 10,
    highlight: true,
    badge: "PRO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { priceCents: "asc" },
    })
    // Se não encontrou planos, retorna fallback
    if (!plans || plans.length === 0) {
      console.warn("[getPlans] Tabela plans vazia, usando fallback")
      return FALLBACK_PLANS
    }
    return plans
  } catch (error) {
    // Se tabela não existe (P2021) ou outro erro, retorna fallback
    console.error("[getPlans] Erro ao buscar planos, usando fallback:", error)
    return FALLBACK_PLANS
  }
}

export async function getPlanBySlug(slug: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: { slug },
    })
    if (!plan) {
      // Fallback: buscar no array hardcoded
      return FALLBACK_PLANS.find((p) => p.slug === slug) || null
    }
    return plan
  } catch (error) {
    console.error("[getPlanBySlug] Erro, usando fallback:", error)
    return FALLBACK_PLANS.find((p) => p.slug === slug) || null
  }
}

export async function getInstructorSubscription(instructorId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { instructorId },
      include: { plan: true },
    })
    return subscription
  } catch (error) {
    console.error("[getInstructorSubscription] Erro:", error)
    return null
  }
}

export async function subscribeToPlan(instructorId: string, planId: string) {
  try {
    // Buscar o plano
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return { success: false, error: "Plano não encontrado" }
    }

    // Calcular data de expiração
    const startedAt = new Date()
    const expiresAt = new Date(startedAt)
    if (plan.interval === "MONTHLY") {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    // Verificar se já tem assinatura
    const existingSubscription = await prisma.subscription.findUnique({
      where: { instructorId },
    })

    if (existingSubscription) {
      // Atualizar assinatura existente
      await prisma.subscription.update({
        where: { instructorId },
        data: {
          planId,
          status: "ACTIVE",
          startedAt,
          expiresAt,
          canceledAt: null,
        },
      })
    } else {
      // Criar nova assinatura
      await prisma.subscription.create({
        data: {
          instructorId,
          planId,
          status: "ACTIVE",
          startedAt,
          expiresAt,
        },
      })
    }

    revalidatePath("/conta/meus-planos")
    revalidatePath("/planos")
    revalidatePath("/instrutores")

    return { success: true }
  } catch (error) {
    console.error("[subscribeToPlan] Erro:", error)
    return { success: false, error: "Erro ao processar assinatura" }
  }
}

export async function cancelSubscription(instructorId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { instructorId },
    })

    if (!subscription) {
      return { success: false, error: "Assinatura não encontrada" }
    }

    await prisma.subscription.update({
      where: { instructorId },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
      },
    })

    revalidatePath("/conta/meus-planos")
    revalidatePath("/planos")

    return { success: true }
  } catch (error) {
    console.error("[cancelSubscription] Erro:", error)
    return { success: false, error: "Erro ao cancelar assinatura" }
  }
}
