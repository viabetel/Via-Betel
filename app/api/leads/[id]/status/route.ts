import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { status } = await req.json()

    if (!["SUBMITTED", "DELIVERED", "VIEWED", "RESPONDED", "CLOSED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    // Get current lead
    const { data: lead } = await supabase.from("leads").select("*").eq("id", params.id).single()

    if (!lead) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    // Update lead status and timestamp
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "DELIVERED" && !lead.delivered_at) {
      updateData.delivered_at = new Date().toISOString()
    } else if (status === "VIEWED" && !lead.viewed_at) {
      updateData.viewed_at = new Date().toISOString()
    } else if (status === "RESPONDED" && !lead.responded_at) {
      updateData.responded_at = new Date().toISOString()
    } else if (status === "CLOSED" && !lead.closed_at) {
      updateData.closed_at = new Date().toISOString()
    }

    const { error } = await supabase.from("leads").update(updateData).eq("id", params.id)

    if (error) throw error

    // Create event
    await supabase.from("lead_events").insert({
      lead_id: params.id,
      event_type: "STATUS_CHANGE",
      event_data: { from: lead.status, to: status },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar status:", error)
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
  }
}
