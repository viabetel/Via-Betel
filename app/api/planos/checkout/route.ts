import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

// POST /api/planos/checkout - Cria uma nova assinatura
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { planSlug } = body

    if (!planSlug) {
      return NextResponse.json({ ok: false, error: "planSlug é obrigatório" }, { status: 400 })
    }

    // Buscar o plano pelo slug
    const plan = await prisma.plan.findUnique({
      where: { slug: planSlug },
    })

    if (!plan) {
      return NextResponse.json({ ok: false, error: "Plano não encontrado" }, { status: 404 })
    }

    // Buscar instrutor pelo email do usuário
    const instructor = await prisma.instructor.findUnique({
      where: { email: user.email! },
    })

    if (!instructor) {
      return NextResponse.json({ ok: false, error: "Perfil de instrutor não encontrado" }, { status: 404 })
    }

    // Verificar se já tem assinatura ativa e cancelar
    const existingSubscription = await prisma.subscription.findUnique({
      where: { instructorId: instructor.id },
    })

    if (existingSubscription && existingSubscription.status === "ACTIVE") {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "CANCELED",
          canceledAt: new Date(),
        },
      })
    }

    // Calcular expiração (30 dias para mensal, 365 para anual)
    const now = new Date()
    const expiresAt = new Date(now)
    if (plan.interval === "YEARLY") {
      expiresAt.setDate(expiresAt.getDate() + 365)
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30)
    }

    // Criar nova assinatura
    const subscription = await prisma.subscription.create({
      data: {
        instructorId: instructor.id,
        planId: plan.id,
        status: "ACTIVE",
        startedAt: now,
        expiresAt: expiresAt,
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json({
      ok: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        startedAt: subscription.startedAt,
        expiresAt: subscription.expiresAt,
        plan: {
          slug: plan.slug,
          name: plan.name,
          priceCents: plan.priceCents,
          interval: plan.interval,
        },
      },
    })
  } catch (error) {
    console.error("[API] Erro ao criar assinatura:", error)
    return NextResponse.json({ ok: false, error: "Erro ao criar assinatura" }, { status: 500 })
  }
}
