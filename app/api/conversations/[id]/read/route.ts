import { supabase } from "@/lib/supabase/server"
import { canSendMessage } from "@/lib/marketplace/permissions"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    // Upsert message_reads
    const { error } = await supabase.from("message_reads").upsert(
      {
        conversationId: params.id,
        userId: user.id,
        lastReadAt: new Date().toISOString(),
      },
      { onConflict: "conversationId,userId" },
    )

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark read error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
