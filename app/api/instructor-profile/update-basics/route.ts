import { createClient } from "@/lib/supabase/server"
import { upsertInstructorProfileBasics } from "@/lib/instructor-profile"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401 })
    }

    const body = await req.json()
    const profile = await upsertInstructorProfileBasics(user.id, body)

    return new Response(JSON.stringify(profile), { status: 200 })
  } catch (error) {
    console.error("[API] Erro ao atualizar dados básicos:", error)
    return new Response(JSON.stringify({ error: "Erro ao salvar dados" }), { status: 500 })
  }
}
