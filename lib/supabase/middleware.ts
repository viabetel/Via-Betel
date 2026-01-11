import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/instrutor") && user) {
    const { data: profile } = await supabase.from("profiles").select("instructor_status").eq("id", user.id).single()

    if (!profile?.instructor_status || profile.instructor_status === "NONE") {
      const url = request.nextUrl.clone()
      url.pathname = "/inscricao"
      url.searchParams.set("userType", "instructor")
      url.searchParams.set("returnTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname.startsWith("/chat") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/inscricao"
    url.searchParams.set("returnTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/instrutor/onboarding") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/inscricao"
    url.searchParams.set("userType", "instructor")
    url.searchParams.set("returnTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/conta") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/inscricao"
    url.searchParams.set("returnTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/aluno") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/inscricao"
    url.searchParams.set("userType", "student")
    url.searchParams.set("returnTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // /marketplace é uma rota pública que qualquer um pode acessar

  return supabaseResponse
}
