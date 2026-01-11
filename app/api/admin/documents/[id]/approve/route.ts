import { supabase } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/marketplace/roles"
import { logAudit } from "@/lib/marketplace/audit"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!isAdmin(profile?.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: document } = await supabase.from("documents").select("*").eq("id", params.id).single()

    if (!document) return Response.json({ error: "Not found" }, { status: 404 })

    // Update document status
    await supabase.from("documents").update({ status: "VERIFIED" }).eq("id", params.id)

    // Update profile verification status
    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("ownerId", document.ownerId)
      .in("status", ["UNDER_REVIEW", "VERIFIED"])

    if (docs && docs.length === 3) {
      await supabase.from("profiles").update({ verificationStatus: "VERIFIED" }).eq("id", document.ownerId)
    }

    await logAudit("DOCUMENT_APPROVED", "document", params.id, { instructorId: document.ownerId })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve document error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
