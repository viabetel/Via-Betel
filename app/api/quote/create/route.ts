import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      city,
      neighborhood,
      category,
      availability1,
      availability2,
      availability3,
      objective,
      notes,
      studentName,
      studentWhatsApp,
    } = body

    // Validation
    if (!city || !category || !availability1) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        city,
        neighborhood: neighborhood || null,
        category,
        availability1,
        availability2: availability2 || null,
        availability3: availability3 || null,
        objective: objective || null,
        notes: notes || null,
        studentName: studentName || null,
        studentWhatsApp: studentWhatsApp || null,
        status: "PENDING",
      },
    })

    // Send email to Via Betel
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "465"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `🎯 Novo Lead - ${category} em ${city}`,
        html: `
          <h2>Novo Pedido de Orçamento</h2>
          <p><strong>ID:</strong> ${lead.id}</p>
          <p><strong>Cidade:</strong> ${city}</p>
          <p><strong>Bairro:</strong> ${neighborhood || "N/A"}</p>
          <p><strong>Categoria:</strong> ${category}</p>
          <p><strong>Disponibilidade 1:</strong> ${availability1}</p>
          <p><strong>Disponibilidade 2:</strong> ${availability2 || "N/A"}</p>
          <p><strong>Disponibilidade 3:</strong> ${availability3 || "N/A"}</p>
          <p><strong>Objetivo:</strong> ${objective || "N/A"}</p>
          <p><strong>Observações:</strong> ${notes || "N/A"}</p>
          <hr />
          <h3>Dados do Aluno (se fornecidos):</h3>
          <p><strong>Nome:</strong> ${studentName || "Não informado"}</p>
          <p><strong>WhatsApp:</strong> ${studentWhatsApp || "Não informado"}</p>
          <p><em>Atenção: Não repassar esses dados aos instrutores automaticamente.</em></p>
        `,
      })
    } catch (emailError) {
      console.error("[v0] Erro ao enviar email:", emailError)
      // Não quebra o fluxo se o email falhar
    }

    // TODO: Notificar instrutores elegíveis via email (sem expor contato do aluno)

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar lead:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
