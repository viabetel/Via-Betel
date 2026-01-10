import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, city, neighborhood, option1, option2, option3, notes } = await request.json()

    if (!sessionId || !city || !option1) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar order pelo sessionId
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    if (order.status !== "PAID") {
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 400 })
    }

    // Criar booking request
    const booking = await prisma.bookingRequest.create({
      data: {
        orderId: order.id,
        city,
        neighborhood: neighborhood || "",
        option1,
        option2: option2 || "",
        option3: option3 || "",
        notes: notes || "",
        status: "PENDING_CONFIRMATION",
      },
    })

    return NextResponse.json({ ok: true, bookingId: booking.id })
  } catch (error) {
    console.error("[v0] Erro ao criar booking:", error)
    return NextResponse.json({ error: "Erro ao processar agendamento" }, { status: 500 })
  }
}
