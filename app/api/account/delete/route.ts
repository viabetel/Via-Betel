import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // 1) Validar autenticação
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = user.id

    // 2) Validar confirmação
    const body = await request.json()
    const { confirmation } = body

    if (confirmation !== "EXCLUIR") {
      return NextResponse.json({ error: "Confirmação inválida. Digite EXCLUIR para confirmar." }, { status: 400 })
    }

    // 3) Buscar instrutor vinculado (se existir)
    let instructorId: string | null = null
    try {
      const instructor = await prisma.instructor.findFirst({
        where: { email: user.email || "" },
        select: { id: true },
      })
      instructorId = instructor?.id || null
    } catch (e) {
      // Tabela pode não existir ainda, continua
      console.log("[v0] Instructor table not found, skipping")
    }

    // 4) Excluir dados relacionados no Prisma (transação)
    try {
      await prisma.$transaction(async (tx) => {
        // Se for instrutor, excluir dados vinculados
        if (instructorId) {
          // Boosts
          await tx.boost.deleteMany({ where: { instructorId } }).catch(() => {})

          // LeadProposals
          await tx.leadProposal.deleteMany({ where: { instructorId } }).catch(() => {})

          // Subscription
          await tx.subscription.deleteMany({ where: { instructorId } }).catch(() => {})

          // Instructor
          await tx.instructor.delete({ where: { id: instructorId } }).catch(() => {})
        }

        // MonthlyChatUsage
        await tx.monthlyChatUsage.deleteMany({ where: { userId } }).catch(() => {})

        // ConversationUsageLog
        await tx.conversationUsageLog.deleteMany({ where: { userId } }).catch(() => {})
      })
    } catch (e) {
      console.log("[v0] Prisma deletion error (tables may not exist):", e)
      // Continua mesmo se falhar - tabelas podem não existir
    }

    // 5) Excluir profile do Supabase
    try {
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

      if (profileError) {
        console.log("[v0] Profile deletion error:", profileError.message)
      }
    } catch (e) {
      console.log("[v0] Profile deletion failed:", e)
    }

    // 6) Excluir usuário do Supabase Auth (usando admin client)
    try {
      const adminClient = createAdminClient()
      const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId)

      if (deleteAuthError) {
        console.error("[v0] Auth deletion error:", deleteAuthError.message)
        return NextResponse.json(
          { error: "Erro ao excluir conta do sistema de autenticação: " + deleteAuthError.message },
          { status: 500 },
        )
      }
    } catch (e: any) {
      console.error("[v0] Admin client error:", e)
      return NextResponse.json({ error: "Erro ao excluir conta: " + e.message }, { status: 500 })
    }

    // 7) Sucesso
    return NextResponse.json({
      success: true,
      message: "Conta excluída com sucesso",
    })
  } catch (error: any) {
    console.error("[v0] Delete account error:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
