import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { lead_id, instructor_id } = await req.json()

    if (!lead_id || !instructor_id) {
      return NextResponse.json({ error: "lead_id e instructor_id obrigatórios" }, { status: 400 })
    }

    // Check if thread already exists
    const { data: existingThread } = await supabase.from("threads").select("*").eq("lead_id", lead_id).single()

    if (existingThread) {
      return NextResponse.json({ threadId: existingThread.id }, { status: 200 })
    }

    // Get lead to extract student_id
    const { data: lead } = await supabase.from("leads").select("student_id").eq("id", lead_id).single()

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 })
    }

    // Create thread
    const { data: thread, error } = await supabase
      .from("threads")
      .insert({
        lead_id,
        student_id: lead.student_id,
        instructor_id,
      })
      .select()
      .single()

    if (error) throw error

    // Update lead status to DELIVERED
    await supabase
      .from("leads")
      .update({
        status: "DELIVERED",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", lead_id)

    // Create system message
    await supabase.from("messages").insert({
      thread_id: thread.id,
      from_id: user.id,
      content: "Conversa iniciada. O instrutor foi notificado sobre sua solicitação.",
      is_system: true,
    })

    return NextResponse.json({ threadId: thread.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar thread:", error)
    return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
  }
}
