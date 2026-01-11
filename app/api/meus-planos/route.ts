import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

// GET /api/meus-planos - Retorna o plano atual do usuário
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
    }

    // Buscar instrutor pelo email do usuário
    const instructor = await prisma.instructor.findUnique({
      where: { email: user.email! },
    })

    if (!instructor) {
      return NextResponse.json({ ok: true, subscription: null })
    }

    // Buscar assinatura ativa com dados do plano
    const subscription = await prisma.subscription.findUnique({
      where: { instructorId: instructor.id },
      include: {
        plan: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            priceCents: true,
            interval: true,
            features: true,
            maxListings: true,
            badge: true,
          },
        },
      },
    })

    if (!subscription) {
      return NextResponse.json({ ok: true, subscription: null })
    }

    return NextResponse.json({
      ok: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        startedAt: subscription.startedAt,
        expiresAt: subscription.expiresAt,
        canceledAt: subscription.canceledAt,
        plan: subscription.plan,
      },
    })
  } catch (error) {
    console.error("[API] Erro ao buscar plano do usuário:", error)
    return NextResponse.json({ ok: false, error: "Erro ao buscar plano" }, { status: 500 })
  }
}
