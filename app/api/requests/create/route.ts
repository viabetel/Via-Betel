import { supabase } from "@/lib/supabase/server"
import { canCreateRequest } from "@/lib/marketplace/permissions"
import { logAudit, logRequestEvent } from "@/lib/marketplace/audit"
import { isBanned } from "@/lib/marketplace/roles"
import { z } from "zod"

const CreateRequestSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  category: z.enum(["A", "B", "C", "D", "E"]),
  city: z.string().min(3),
  budget: z.number().int().positive().optional(),
  preferredDate: z.string().datetime().optional(),
})

export async function POST(req: Request) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role, bannedAt").eq("id", user.id).single()

    if (!profile || !canCreateRequest(profile.role) || isBanned(profile.bannedAt)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = CreateRequestSchema.parse(await req.json())

    const requestId = crypto.randomUUID()

    const { error } = await supabase.from("requests").insert({
      id: requestId,
      studentId: user.id,
      title: body.title,
      description: body.description,
      category: body.category,
      city: body.city,
      budget: body.budget,
      preferredDate: body.preferredDate,
      status: "NEW",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    })

    if (error) throw error

    // Log events
    await logRequestEvent(requestId, "CREATED", { category: body.category, city: body.city })
    await logAudit("REQUEST_CREATED", "request", requestId, { category: body.category })

    return Response.json({ requestId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create request error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
