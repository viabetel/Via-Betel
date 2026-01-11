import { syncAccount } from "@/lib/account/sync-account"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const userTypeParam = url.searchParams.get("userType") as "student" | "instructor" | null

    const result = await syncAccount(userTypeParam || undefined)

    return NextResponse.json({ ok: true, role: result.role, profile: result.profile })
  } catch (error: any) {
    console.error("[v0] Sync error:", error)
    return NextResponse.json({ error: error.message || "Erro ao sincronizar conta" }, { status: 401 })
  }
}
