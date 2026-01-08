import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { tipo, nome, whatsapp, cidade, uf } = body

    if (!nome || !whatsapp || !cidade || !tipo) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    if (tipo === "aluno") {
      const { categoria, objetivo, horario } = body
      if (!categoria || !objetivo || !horario) {
        return NextResponse.json({ error: "Campos obrigatórios do aluno ausentes" }, { status: 400 })
      }

      const lead = await prisma.lead.create({
        data: {
          tipo: "aluno",
          nome,
          whatsapp,
          cidade: `${cidade}/${uf || ""}`,
          categoria,
          objetivo,
          horario,
        },
      })

      return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
    }

    if (tipo === "instrutor") {
      const { categorias, experiencia, disponibilidade, veiculo } = body
      if (!categorias || !experiencia || !disponibilidade || !veiculo) {
        return NextResponse.json({ error: "Campos obrigatórios do instrutor ausentes" }, { status: 400 })
      }

      const lead = await prisma.lead.create({
        data: {
          tipo: "instrutor",
          nome,
          whatsapp,
          cidade: `${cidade}/${uf || ""}`,
          categorias,
          experiencia,
          disponibilidade,
          veiculo,
        },
      })

      return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
