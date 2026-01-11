import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { canInstructorSendMessage, markConversationAsUsed } from "@/lib/chat-usage"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { conversationId, content } = body

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: "Conversa e conteúdo são obrigatórios" }, { status: 400 })
    }

    // Busca perfil do usuário
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    // Se for instrutor, verifica limite de conversas
    if (profile?.user_type === "instructor") {
      const usageCheck = await canInstructorSendMessage(user.id, conversationId)

      if (!usageCheck.canSend) {
        return NextResponse.json(
          {
            error: "Limite de conversas atingido",
            code: "FREE_LIMIT_REACHED",
            usedConversations: usageCheck.usedConversations,
            limit: usageCheck.limit,
          },
          { status: 403 },
        )
      }

      // Se é nova conversa e vai ser enviada, marca como usada ANTES de salvar
      // para garantir consistência
      if (usageCheck.isNewConversation && !usageCheck.hasActivePlan) {
        await markConversationAsUsed(user.id, conversationId)
      }
    }

    // Salva a mensagem
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) throw error

    // Atualiza timestamp da conversa
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    return NextResponse.json({ ok: true, message })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
