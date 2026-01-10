import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

const leadSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  phone: z.string().min(8, "Telefone deve ter no mínimo 8 caracteres"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  type: z.enum(["aluno", "instrutor"], {
    errorMap: () => ({ message: 'Tipo deve ser "aluno" ou "instrutor"' }),
  }),
  message: z.string().min(2, "Mensagem deve ter no mínimo 2 caracteres"),
  // Campos opcionais do formulário
  categoria: z.string().optional(),
  objetivo: z.string().optional(),
  horario: z.string().optional(),
  categorias: z.string().optional(),
  experiencia: z.string().optional(),
  disponibilidade: z.string().optional(),
  veiculo: z.string().optional(),
  email: z.string().email().optional(),
})

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = leadSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Dados inválidos: " + validationResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 },
      )
    }

    const data = validationResult.data

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "Banco de dados não configurado",
        },
        { status: 500 },
      )
    }

    const lead = await prisma.lead.create({
      data: {
        tipo: data.type,
        nome: data.name,
        whatsapp: data.phone,
        cidade: data.city,
        categoria: data.categoria,
        objetivo: data.objetivo || data.message,
        horario: data.horario,
        categorias: data.categorias,
        experiencia: data.experiencia,
        disponibilidade: data.disponibilidade,
        veiculo: data.veiculo,
      },
    })

    let emailResult = { ok: true, error: null }

    try {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
      const smtpPort = Number.parseInt(process.env.SMTP_PORT || "465", 10)
      const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465
      const smtpUser = process.env.SMTP_USER
      const smtpPass = process.env.SMTP_PASS
      const emailTo = process.env.EMAIL_TO || "contato@viabetel.com"
      const emailFrom = process.env.EMAIL_FROM || "Via Betel <contato@viabetel.com>"

      if (smtpUser && smtpPass) {
        console.log("[v0] Configurando transporter SMTP...")
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        const emailSubject = `Novo lead (${data.type}) — ${data.name}`
        const emailText = `
Novo Lead Recebido

Tipo: ${data.type}
Nome: ${data.name}
Telefone: ${data.phone}
Cidade: ${data.city}
Mensagem: ${data.message}
${data.email ? `Email: ${data.email}` : ""}
${data.categoria ? `Categoria: ${data.categoria}` : ""}
${data.objetivo ? `Objetivo: ${data.objetivo}` : ""}
${data.horario ? `Horário: ${data.horario}` : ""}
${data.categorias ? `Categorias (Instrutor): ${data.categorias}` : ""}
${data.experiencia ? `Experiência: ${data.experiencia}` : ""}
${data.disponibilidade ? `Disponibilidade: ${data.disponibilidade}` : ""}
${data.veiculo ? `Veículo: ${data.veiculo}` : ""}
Data: ${new Date(lead.createdAt).toLocaleString("pt-BR")}
        `.trim()

        const emailHtml = `
          <h2>Novo Lead Recebido</h2>
          <p><strong>Tipo:</strong> ${data.type}</p>
          <p><strong>Nome:</strong> ${data.name}</p>
          <p><strong>Telefone:</strong> ${data.phone}</p>
          <p><strong>Cidade:</strong> ${data.city}</p>
          <p><strong>Mensagem:</strong> ${data.message}</p>
          ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ""}
          ${data.categoria ? `<p><strong>Categoria:</strong> ${data.categoria}</p>` : ""}
          ${data.objetivo ? `<p><strong>Objetivo:</strong> ${data.objetivo}</p>` : ""}
          ${data.horario ? `<p><strong>Horário:</strong> ${data.horario}</p>` : ""}
          ${data.categorias ? `<p><strong>Categorias (Instrutor):</strong> ${data.categorias}</p>` : ""}
          ${data.experiencia ? `<p><strong>Experiência:</strong> ${data.experiencia}</p>` : ""}
          ${data.disponibilidade ? `<p><strong>Disponibilidade:</strong> ${data.disponibilidade}</p>` : ""}
          ${data.veiculo ? `<p><strong>Veículo:</strong> ${data.veiculo}</p>` : ""}
          <p><strong>Data:</strong> ${new Date(lead.createdAt).toLocaleString("pt-BR")}</p>
        `

        console.log("[v0] Enviando email...")
        await transporter.sendMail({
          from: emailFrom,
          to: emailTo,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        })
        console.log("[v0] Email enviado com sucesso!")
      } else {
        console.warn("[Email] SMTP_USER ou SMTP_PASS não configurado, pulando envio de email")
      }
    } catch (emailError) {
      console.error("[Email] Falha ao enviar:", emailError)
      emailResult = {
        ok: false,
        error: emailError instanceof Error ? emailError.message : "Erro desconhecido",
      }
    }

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      createdAt: lead.createdAt.toISOString(),
      email: emailResult,
    })
  } catch (error) {
    console.error("[API] Erro ao criar lead:", error)

    // Erro de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          ok: false,
          error: "JSON inválido",
        },
        { status: 400 },
      )
    }

    // Erro do Prisma/Banco
    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao salvar no banco de dados",
      },
      { status: 500 },
    )
  }
}
