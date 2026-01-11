import { supabase } from "@/lib/supabase/server"
import { canRespondToRequest, canChangeStatus } from "@/lib/marketplace/permissions"
import { logAudit, logRequestEvent } from "@/lib/marketplace/audit"
import { z } from "zod"

const RespondSchema = z.object({
  message: z.string().min(10),
  price: z.number().int().positive().optional(),
  availability: z.string().optional(),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { data: request } = await supabase
      .from("requests")
      .select("id, studentId, instructorId, status")
      .eq("id", params.id)
      .single()

    if (!request) return Response.json({ error: "Not found" }, { status: 404 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, verificationStatus")
      .eq("id", user.id)
      .single()

    if (!canRespondToRequest(request.instructorId, user.id, profile?.role, profile?.verificationStatus)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (
      !canChangeStatus(request.status, "RESPONDED", profile?.role, request.studentId, request.instructorId, user.id)
    ) {
      return Response.json({ error: "Cannot change status" }, { status: 400 })
    }

    const body = RespondSchema.parse(await req.json())

    // Update request
    const { error } = await supabase
      .from("requests")
      .update({ status: "RESPONDED", instructorId: user.id })
      .eq("id", params.id)

    if (error) throw error

    // Create conversation
    const conversationId = crypto.randomUUID()
    await supabase.from("conversations").insert({
      id: conversationId,
      requestId: params.id,
      studentId: request.studentId,
      instructorId: user.id,
      createdAt: new Date().toISOString(),
    })

    // Send initial message
    await supabase.from("messages").insert({
      id: crypto.randomUUID(),
      conversationId,
      senderId: user.id,
      type: "TEXT",
      content: body.message,
      createdAt: new Date().toISOString(),
    })

    await logRequestEvent(params.id, "RESPONDED", { price: body.price })
    await logAudit("REQUEST_RESPONDED", "request", params.id, { instructorId: user.id })

    return Response.json({ conversationId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Respond error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
