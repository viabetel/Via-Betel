import { supabase } from "@/lib/supabase/server"
import { canChangeStatus } from "@/lib/marketplace/permissions"
import { logAudit, logRequestEvent } from "@/lib/marketplace/audit"
import { z } from "zod"

const CancelSchema = z.object({
  reason: z.string().optional(),
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

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!canChangeStatus(request.status, "CANCELED", profile?.role, request.studentId, request.instructorId, user.id)) {
      return Response.json({ error: "Cannot cancel" }, { status: 403 })
    }

    const body = CancelSchema.parse(await req.json())

    const { error } = await supabase.from("requests").update({ status: "CANCELED" }).eq("id", params.id)

    if (error) throw error

    await logRequestEvent(params.id, "CANCELED", { reason: body.reason })
    await logAudit("REQUEST_CANCELED", "request", params.id, { reason: body.reason })

    return Response.json({ status: "CANCELED" })
  } catch (error) {
    console.error("[v0] Cancel error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
