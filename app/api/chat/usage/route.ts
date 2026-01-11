import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getChatUsageInfo } from "@/lib/chat-usage"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  try {
    const usageInfo = await getChatUsageInfo(user.id)

    return NextResponse.json({
      ok: true,
      ...usageInfo,
      renewsAtFormatted: usageInfo.renewsAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    })
  } catch (error) {
    console.error("Erro ao buscar uso de chat:", error)
    return NextResponse.json({ error: "Erro ao buscar informações de uso" }, { status: 500 })
  }
}
