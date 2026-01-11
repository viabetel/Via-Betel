import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.delete(name)
          },
        },
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 })
    }

    // Por enquanto, retornar APROVADO como padrão (será ajustado quando conectar ao DB)
    const instructorStatus = "APROVADO" // TODO: buscar do banco quando migration 008 for executada

    return NextResponse.json({
      ok: true,
      status: instructorStatus,
      userId: user.id,
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar status do instrutor:", error)
    return NextResponse.json({ ok: false, error: "Erro ao verificar status" }, { status: 500 })
  }
}
