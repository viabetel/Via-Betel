import { supabase } from "@/lib/supabase/server"
import { canSendMessage } from "@/lib/marketplace/permissions"
import { logAudit } from "@/lib/marketplace/audit"
import { z } from "zod"

const SendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id, studentId, instructorId")
      .eq("id", params.id)
      .single()

    if (!conversation) return Response.json({ error: "Not found" }, { status: 404 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!canSendMessage(params.id, conversation.studentId, conversation.instructorId, user.id, profile?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = SendMessageSchema.parse(await req.json())

    const messageId = crypto.randomUUID()

    const { error } = await supabase.from("messages").insert({
      id: messageId,
      conversationId: params.id,
      senderId: user.id,
      type: "TEXT",
      content: body.content,
      createdAt: new Date().toISOString(),
    })

    if (error) throw error

    await logAudit("MESSAGE_SENT", "message", messageId, { conversationId: params.id })

    return Response.json({ messageId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Send message error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
