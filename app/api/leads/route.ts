import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const leadSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  phone: z.string().min(8, "Telefone deve ter no mínimo 8 caracteres"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  type: z.enum(["aluno", "instrutor"], {
    errorMap: () => ({ message: 'Tipo deve ser "aluno" ou "instrutor"' }),
  }),
  message: z.string().max(1000, "Mensagem deve ter no máximo 1000 caracteres").optional(),
  // Campos opcionais adicionais do schema Prisma
  categoria: z.string().optional(),
  objetivo: z.string().optional(),
  horario: z.string().optional(),
  categorias: z.string().optional(),
  experiencia: z.string().optional(),
  disponibilidade: z.string().optional(),
  veiculo: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Valida os dados com Zod
    const validationResult = leadSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_payload",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    const data = validationResult.data

    // Mapeia os campos para o schema Prisma
    const lead = await prisma.lead.create({
      data: {
        tipo: data.type,
        nome: data.name,
        whatsapp: data.phone,
        cidade: data.city,
        categoria: data.categoria,
        objetivo: data.objetivo || data.message,
        horario: data.horario,
        categorias: data.categorias,
        experiencia: data.experiencia,
        disponibilidade: data.disponibilidade,
        veiculo: data.veiculo,
      },
    })

    return NextResponse.json(
      {
        ok: true,
        id: lead.id,
        createdAt: lead.createdAt,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar lead:", error)

    // Erro de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_json",
        },
        { status: 400 },
      )
    }

    // Erro do Prisma/Banco
    return NextResponse.json(
      {
        ok: false,
        error: "db_error",
      },
      { status: 500 },
    )
  }
}
