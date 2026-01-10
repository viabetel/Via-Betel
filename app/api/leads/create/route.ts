import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()

    const {
      instructor_slug,
      city,
      neighborhood,
      category,
      availability1,
      availability2,
      availability3,
      objective,
      notes,
    } = body

    // Validation
    if (!city || !category || !availability1) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Create lead with status tracking
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        student_id: user.id,
        instructor_slug: instructor_slug || null,
        city,
        neighborhood: neighborhood || null,
        category,
        availability1,
        availability2: availability2 || null,
        availability3: availability3 || null,
        objective: objective || null,
        notes: notes || null,
        status: "SUBMITTED",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (leadError) throw leadError

    // Create initial event
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      event_type: "STATUS_CHANGE",
      event_data: { from: null, to: "SUBMITTED", message: "Solicitação criada" },
    })

    // Get student profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Send email notification to Via Betel
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
        subject: `🎯 Nova Solicitação - ${category} em ${city}`,
        html: `
          <h2>Nova Solicitação de Orçamento</h2>
          <p><strong>ID:</strong> ${lead.id}</p>
          <p><strong>Aluno:</strong> ${profile?.full_name || "Não informado"} (${profile?.email})</p>
          <p><strong>Cidade:</strong> ${city}</p>
          <p><strong>Bairro:</strong> ${neighborhood || "N/A"}</p>
          <p><strong>Categoria:</strong> ${category}</p>
          <p><strong>Instrutor escolhido:</strong> ${instructor_slug || "Nenhum específico"}</p>
          <p><strong>Disponibilidade 1:</strong> ${availability1}</p>
          <p><strong>Disponibilidade 2:</strong> ${availability2 || "N/A"}</p>
          <p><strong>Disponibilidade 3:</strong> ${availability3 || "N/A"}</p>
          <p><strong>Objetivo:</strong> ${objective || "N/A"}</p>
          <p><strong>Observações:</strong> ${notes || "N/A"}</p>
          <hr />
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${lead.id}">Ver detalhes da solicitação</a></p>
        `,
      })
    } catch (emailError) {
      console.error("[v0] Erro ao enviar email:", emailError)
      // Não quebra o fluxo
    }

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar lead:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
