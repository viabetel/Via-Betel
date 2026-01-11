import { supabase } from "@/lib/supabase/server"
import { canViewRequest } from "@/lib/marketplace/permissions"
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

    if (!canViewRequest(request.id, request.studentId, request.instructorId, user.id, profile?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update status to VIEWED
    const { error } = await supabase.from("requests").update({ status: "VIEWED" }).eq("id", params.id)

    if (error) throw error

    await logRequestEvent(params.id, "VIEWED")
    await logAudit("REQUEST_VIEWED", "request", params.id)

    return Response.json({ status: "VIEWED" })
  } catch (error) {
    console.error("[v0] View request error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
