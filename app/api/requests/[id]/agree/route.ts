import { supabase } from "@/lib/supabase/server"
import { canChangeStatus } from "@/lib/marketplace/permissions"
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

    if (!canChangeStatus(request.status, "AGREED", profile?.role, request.studentId, request.instructorId, user.id)) {
      return Response.json({ error: "Cannot change status" }, { status: 403 })
    }

    const { error } = await supabase.from("requests").update({ status: "AGREED" }).eq("id", params.id)

    if (error) throw error

    await logRequestEvent(params.id, "AGREED")
    await logAudit("REQUEST_AGREED", "request", params.id)

    return Response.json({ status: "AGREED" })
  } catch (error) {
    console.error("[v0] Agree error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
