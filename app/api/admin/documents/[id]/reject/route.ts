import { supabase } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/marketplace/roles"
import { logAudit } from "@/lib/marketplace/audit"
import { z } from "zod"

const RejectSchema = z.object({
  reason: z.string().min(10),
})

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

    const body = RejectSchema.parse(await req.json())

    // Update document with rejection reason
    await supabase.from("documents").update({ status: "REJECTED", rejectionReason: body.reason }).eq("id", params.id)

    // Reset verification status
    await supabase.from("profiles").update({ verificationStatus: "PENDING_DOCS" }).eq("id", document.ownerId)

    await logAudit("DOCUMENT_REJECTED", "document", params.id, { reason: body.reason })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Reject document error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
