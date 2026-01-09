import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const token = request.headers.get("x-bootstrap-token")

    if (!token || token !== process.env.BOOTSTRAP_TOKEN) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.leads (
        id TEXT PRIMARY KEY,
        tipo TEXT NOT NULL,
        nome TEXT NOT NULL,
        email TEXT,
        whatsapp TEXT NOT NULL,
        cidade TEXT NOT NULL,
        categoria TEXT,
        objetivo TEXT,
        horario TEXT,
        categorias TEXT,
        experiencia TEXT,
        disponibilidade TEXT,
        veiculo TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    return NextResponse.json({
      ok: true,
      created: true,
      message: "Tabela leads criada com sucesso",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Erro ao criar tabela",
      },
      { status: 500 },
    )
  }
}
