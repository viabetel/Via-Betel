import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Verifica se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "DATABASE_URL não configurada",
        },
        { status: 500 },
      )
    }

    // Tenta fazer uma query simples
    const count = await prisma.lead.count()

    // Se chegou aqui, a conexão está OK
    return NextResponse.json({
      ok: true,
      count,
      message: "Conexão com banco de dados OK",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    // Verifica se é erro de tabela não existir
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Tabelas não criadas no banco de dados",
          hint: "Execute: npx prisma db push",
          details: "As tabelas do Prisma ainda não foram criadas no Supabase",
        },
        { status: 503 },
      )
    }

    // Erro genérico de conexão
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Erro ao conectar com banco",
      },
      { status: 500 },
    )
  }
}
