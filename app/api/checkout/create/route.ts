import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getPlan } from "@/lib/plans"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { instructorSlug, planId, customerEmail, customerName } = await request.json()

    if (!instructorSlug || !planId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const plan = getPlan(planId)
    if (!plan) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 })
    }

    // Criar order pendente
    const order = await prisma.order.create({
      data: {
        instructorSlug,
        planId,
        amount: plan.price,
        currency: "brl",
        status: "PENDING",
        customerEmail,
        customerName,
      },
    })

    // Criar sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `${plan.name} - Via Betel`,
              description: `${plan.lessons} aula${plan.lessons > 1 ? "s" : ""} de direção`,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cancelado?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        instructorSlug,
        planId,
      },
      customer_email: customerEmail,
    })

    // Atualizar order com session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Erro ao criar checkout:", error)
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 })
  }
}
