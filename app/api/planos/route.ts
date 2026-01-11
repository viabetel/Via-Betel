import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/planos - Retorna todos os planos ordenados por preço
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        priceCents: "asc",
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        priceCents: true,
        interval: true,
        features: true,
        maxListings: true,
        highlight: true,
        badge: true,
      },
    })

    return NextResponse.json({ ok: true, plans })
  } catch (error) {
    console.error("[API] Erro ao buscar planos:", error)
    return NextResponse.json({ ok: false, error: "Erro ao buscar planos" }, { status: 500 })
  }
}
