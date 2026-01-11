import { supabase } from "@/lib/supabase/server"
import { canCompleteRequest, canChangeStatus } from "@/lib/marketplace/permissions"
import { logAudit, logRequestEvent } from "@/lib/marketplace/audit"

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

    if (!canCompleteRequest(request.studentId, request.instructorId, user.id, profile?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (
      !canChangeStatus(request.status, "COMPLETED", profile?.role, request.studentId, request.instructorId, user.id)
    ) {
      return Response.json({ error: "Cannot change status" }, { status: 400 })
    }

    const { error } = await supabase.from("requests").update({ status: "COMPLETED" }).eq("id", params.id)

    if (error) throw error

    await logRequestEvent(params.id, "COMPLETED")
    await logAudit("REQUEST_COMPLETED", "request", params.id)

    return Response.json({ status: "COMPLETED" })
  } catch (error) {
    console.error("[v0] Complete error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
