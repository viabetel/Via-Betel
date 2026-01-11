"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPlans() {
  const plans = await prisma.plan.findMany({
    orderBy: { priceCents: "asc" },
  })
  return plans
}

export async function getPlanBySlug(slug: string) {
  const plan = await prisma.plan.findUnique({
    where: { slug },
  })
  return plan
}

export async function getInstructorSubscription(instructorId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { instructorId },
    include: { plan: true },
  })
  return subscription
}

export async function subscribeToPlan(instructorId: string, planId: string) {
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
}

export async function cancelSubscription(instructorId: string) {
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
}
