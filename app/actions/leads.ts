"use server"

import { prisma } from "@/lib/prisma"

export type LeadAlunoData = {
  nome: string
  whatsapp: string
  cidade: string
  uf: string
  categoria: string
  objetivo: string
  horario: string
}

export type LeadInstrutorData = {
  nome: string
  whatsapp: string
  cidade: string
  uf: string
  categorias: string
  experiencia: string
  disponibilidade: string
  veiculo: string
}

export async function createLeadAluno(data: LeadAlunoData) {
  try {
    if (!data.nome || !data.whatsapp || !data.cidade || !data.categoria || !data.objetivo || !data.horario) {
      return { success: false, error: "Campos obrigatórios ausentes" }
    }

    const lead = await prisma.lead.create({
      data: {
        tipo: "aluno",
        nome: data.nome,
        whatsapp: data.whatsapp,
        cidade: `${data.cidade}/${data.uf || ""}`,
        categoria: data.categoria,
        objetivo: data.objetivo,
        horario: data.horario,
      },
    })

    return { success: true, id: lead.id }
  } catch (error) {
    console.error("[v0] Erro ao criar lead aluno:", error)
    return { success: false, error: "Erro ao salvar dados. Tente novamente." }
  }
}

export async function createLeadInstrutor(data: LeadInstrutorData) {
  try {
    if (
      !data.nome ||
      !data.whatsapp ||
      !data.cidade ||
      !data.categorias ||
      !data.experiencia ||
      !data.disponibilidade ||
      !data.veiculo
    ) {
      return { success: false, error: "Campos obrigatórios ausentes" }
    }

    const lead = await prisma.lead.create({
      data: {
        tipo: "instrutor",
        nome: data.nome,
        whatsapp: data.whatsapp,
        cidade: `${data.cidade}/${data.uf || ""}`,
        categorias: data.categorias,
        experiencia: data.experiencia,
        disponibilidade: data.disponibilidade,
        veiculo: data.veiculo,
      },
    })

    return { success: true, id: lead.id }
  } catch (error) {
    console.error("[v0] Erro ao criar lead instrutor:", error)
    return { success: false, error: "Erro ao salvar dados. Tente novamente." }
  }
}
