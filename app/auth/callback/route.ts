import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { resolveReturnTo, clearReturnTo } from "@/lib/return-to"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const returnTo = requestUrl.searchParams.get("returnTo")
  const origin = requestUrl.origin

  console.log("[v0] Callback recebido")
  console.log("[v0] Code:", code ? "presente" : "ausente")
  console.log("[v0] ReturnTo:", returnTo)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] OAuth callback error:", error)
      return NextResponse.redirect(
        `${origin}/auth/login?error=auth_failed${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`,
      )
    }

    console.log("[v0] Session criada com sucesso")

    const userType = requestUrl.searchParams.get("userType")
    try {
      const syncUrl = new URL("/api/account/sync", origin)
      if (userType) {
        syncUrl.searchParams.set("userType", userType)
      }
      const syncResponse = await fetch(syncUrl.toString(), { method: "POST" })
      const syncData = await syncResponse.json()

      // Redirecionar baseado em instructor_status após sync
      if (userType === "instructor" && syncData.instructor_status === "STARTED") {
        console.log("[v0] Redirecionando para onboarding do instrutor")
        return NextResponse.redirect(`${origin}/instrutor/onboarding`)
      } else if (userType === "student") {
        console.log("[v0] Redirecionando para aluno")
        return NextResponse.redirect(`${origin}/aluno`)
      }
    } catch (syncError) {
      console.error("[v0] Erro ao chamar sync:", syncError)
      // Continuar mesmo se sync falhar
    }

    const finalPath = resolveReturnTo(returnTo, origin, "/")
    clearReturnTo()

    console.log("[v0] Redirecionando para:", finalPath)
    return NextResponse.redirect(`${origin}${finalPath}`)
  }

  console.log("[v0] Code não encontrado, redirecionando para login")
  return NextResponse.redirect(`${origin}/auth/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`)
}
