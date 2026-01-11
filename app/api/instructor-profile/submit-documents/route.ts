import { createClient } from "@/lib/supabase/server"
import { submitInstructorDocuments, upsertInstructorProfileBasics } from "@/lib/instructor-profile"

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

    // Primeiro atualiza dados da autoescola se necessário
    if (body.isLinkedToAutoescola !== undefined) {
      await upsertInstructorProfileBasics(user.id, {
        fullName: body.fullName || "",
        isLinkedToAutoescola: body.isLinkedToAutoescola,
        autoescolaName: body.autoescolaName,
        autoescolaCnpj: body.autoescolaCnpj,
      })
    }

    // Depois submete documentos e muda status para EM_ANALISE
    const profile = await submitInstructorDocuments(user.id, {
      cnhUrl: body.cnhUrl,
      certificadoUrl: body.certificadoUrl,
      vinculoUrl: body.vinculoUrl,
    })

    return new Response(JSON.stringify(profile), { status: 200 })
  } catch (error) {
    console.error("[API] Erro ao enviar documentos:", error)
    return new Response(JSON.stringify({ error: "Erro ao enviar documentos" }), { status: 500 })
  }
}
