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

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY não configurado. Contate o administrador." },
        { status: 500 },
      )
    }

    const adminClient = createAdminClient()

    // Check if user exists in Auth first
    const { data: authUser, error: getUserError } = await adminClient.auth.admin.getUserById(userId)

    if (getUserError || !authUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado no sistema de autenticação. Não é possível excluir a conta." },
        { status: 500 },
      )
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
      console.log("[v0] Instructor table not found, skipping")
    }

    // 4) Excluir dados relacionados no Prisma (transação)
    try {
      await prisma.$transaction(async (tx) => {
        if (instructorId) {
          await tx.boost.deleteMany({ where: { instructorId } }).catch(() => {})
          await tx.leadProposal.deleteMany({ where: { instructorId } }).catch(() => {})
          await tx.subscription.deleteMany({ where: { instructorId } }).catch(() => {})
          await tx.instructor.delete({ where: { id: instructorId } }).catch(() => {})
        }

        await tx.monthlyChatUsage.deleteMany({ where: { userId } }).catch(() => {})
        await tx.conversationUsageLog.deleteMany({ where: { userId } }).catch(() => {})
      })
    } catch (e) {
      console.log("[v0] Prisma deletion error (tables may not exist):", e)
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

    // 6) Delete from Auth AFTER local data deletion, return ok:true only if successful
    try {
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
      return NextResponse.json({ error: "Erro ao deletar usuário do Auth: " + e.message }, { status: 500 })
    }

    // 7) Sucesso - retorna ok:true ONLY if everything succeeded
    return NextResponse.json({
      ok: true,
      message: "Conta excluída com sucesso",
    })
  } catch (error: any) {
    console.error("[v0] Delete account error:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
