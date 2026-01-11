import { createClient as createServerClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const url = new URL(request.url)
    const userTypeParam = url.searchParams.get("userType") as "student" | "instructor" | null
    const userType = userTypeParam || (user.user_metadata?.user_type as "student" | "instructor") || "student"

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        role: userType === "instructor" ? "INSTRUCTOR" : "STUDENT",
      },
      { onConflict: "id" },
    )

    if (profileError) {
      console.error("[v0] Erro ao upsert profile:", profileError)
    }

    try {
      await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          role: userType === "instructor" ? "INSTRUCTOR" : "STUDENT",
        },
        update: {
          email: user.email || "",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          ...(userTypeParam && { role: userType === "instructor" ? "INSTRUCTOR" : "STUDENT" }),
        },
      })
    } catch (prismaError) {
      console.error("[v0] Erro ao upsert prisma.user:", prismaError)
      // Não fazer fail - o projeto funciona sem Prisma por enquanto
    }

    return NextResponse.json({ ok: true, userType })
  } catch (error) {
    console.error("[v0] Erro em /api/account/sync:", error)
    return NextResponse.json({ error: "Erro ao sincronizar conta" }, { status: 500 })
  }
}
