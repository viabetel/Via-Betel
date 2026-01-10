import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Anti-bypass patterns
const BLOCKED_PATTERNS = [
  /\b(whats|zap|telegram|insta|facebook|face|fb)\b/gi,
  /\b\d{10,11}\b/g, // Phone numbers BR
  /\b\d{2}[\s-]?\d{4,5}[\s-]?\d{4}\b/g, // Formatted phone
  /(11|21|31|41|51|61|71|81|91|85)\s*9\d{4}[-\s]?\d{4}/g, // DDD + phone
  /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, // Email
  /(https?:\/\/[^\s]+)/g, // URLs
]

function checkAntiBypass(content: string): { blocked: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      return { blocked: true, reason: "Conteúdo bloqueado: contato direto não permitido" }
    }
  }
  return { blocked: false }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { thread_id, content } = await req.json()

    if (!thread_id || !content?.trim()) {
      return NextResponse.json({ error: "thread_id e content obrigatórios" }, { status: 400 })
    }

    // Anti-bypass check
    const { blocked, reason } = checkAntiBypass(content)

    if (blocked) {
      return NextResponse.json({ error: reason }, { status: 400 })
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        thread_id,
        from_id: user.id,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) throw error

    // Update thread last_message
    await supabase
      .from("threads")
      .update({
        last_message_text: content.trim().substring(0, 100),
        last_message_at: new Date().toISOString(),
        last_message_from: user.id,
      })
      .eq("id", thread_id)

    // Check if this is instructor's first message to update lead status
    const { data: thread } = await supabase.from("threads").select("*, leads(*)").eq("id", thread_id).single()

    if (thread && thread.instructor_id === user.id) {
      const { data: lead } = thread.leads as { status: string }

      if (lead && lead.status === "VIEWED") {
        await supabase
          .from("leads")
          .update({
            status: "RESPONDED",
            responded_at: new Date().toISOString(),
          })
          .eq("id", thread.lead_id)
      }
    }

    return NextResponse.json({ ok: true, messageId: message.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao enviar mensagem:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
