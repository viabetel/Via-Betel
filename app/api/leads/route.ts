import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { tipo, nome, whatsapp, cidade, uf, categoria, objetivo, horario } = body

    if (!nome || !whatsapp || !cidade || !categoria || !objetivo || !horario) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        tipo: tipo || "aluno",
        nome,
        whatsapp,
        cidade: `${cidade}/${uf || ""}`,
        categoria,
        objetivo,
        horario,
      },
    })

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao salvar lead:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
