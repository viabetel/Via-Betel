import { supabase } from "@/lib/supabase/server"
import { canSendMessage } from "@/lib/marketplace/permissions"
import { logAudit } from "@/lib/marketplace/audit"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword"]

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

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) return Response.json({ error: "No file provided" }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return Response.json({ error: "File too large" }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return Response.json({ error: "Invalid file type" }, { status: 400 })

    const fileName = `${params.id}/${Date.now()}-${file.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("chat_attachments")
      .upload(fileName, file, { cacheControl: "3600", upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from("chat_attachments").getPublicUrl(uploadData.path)

    const messageId = crypto.randomUUID()

    const { error } = await supabase.from("messages").insert({
      id: messageId,
      conversationId: params.id,
      senderId: user.id,
      type: "FILE",
      content: file.name,
      fileUrl: urlData.publicUrl,
      fileType: file.type,
      createdAt: new Date().toISOString(),
    })

    if (error) throw error

    await logAudit("ATTACHMENT_UPLOADED", "message", messageId, { fileType: file.type })

    return Response.json({ messageId, fileUrl: urlData.publicUrl }, { status: 201 })
  } catch (error) {
    console.error("[v0] Upload attachment error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
