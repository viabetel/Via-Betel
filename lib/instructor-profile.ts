import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import type { InstructorVerificationStatus } from "@prisma/client"

/**
 * Pega usuário logado + InstructorProfile (ou null)
 */
export async function getCurrentUserWithInstructorProfile() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        instructorProfile: true,
      },
    })

    return userWithProfile
  } catch (error) {
    console.error("[instructor-profile] Erro ao buscar usuário com profile:", error)
    return null
  }
}

/**
 * Cria ou atualiza Step 1 (dados básicos) do InstructorProfile
 */
export async function upsertInstructorProfileBasics(
  userId: string,
  data: {
    fullName: string
    phone?: string
    city?: string
    state?: string
    categories?: string // "A,B,C"
    yearsExp?: number
    isLinkedToAutoescola?: boolean
    autoescolaName?: string | null
    autoescolaCnpj?: string | null
  },
) {
  try {
    const profile = await prisma.instructorProfile.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        state: data.state,
        categories: data.categories,
        yearsExp: data.yearsExp,
        isLinkedToAutoescola: data.isLinkedToAutoescola,
        autoescolaName: data.autoescolaName,
        autoescolaCnpj: data.autoescolaCnpj,
      },
      create: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        state: data.state,
        categories: data.categories,
        yearsExp: data.yearsExp,
        isLinkedToAutoescola: data.isLinkedToAutoescola ?? false,
        autoescolaName: data.autoescolaName,
        autoescolaCnpj: data.autoescolaCnpj,
        status: "INCOMPLETO",
      },
    })

    return profile
  } catch (error) {
    console.error("[instructor-profile] Erro ao upsert dados básicos:", error)
    throw error
  }
}

/**
 * Atualiza dados de documentos (Step 2) e muda status para EM_ANALISE
 */
export async function submitInstructorDocuments(
  userId: string,
  data: {
    cnhUrl?: string
    certificadoUrl?: string
    vinculoUrl?: string
  },
) {
  try {
    const profile = await prisma.instructorProfile.update({
      where: { userId },
      data: {
        cnhUrl: data.cnhUrl,
        certificadoUrl: data.certificadoUrl,
        vinculoUrl: data.vinculoUrl,
        status: "EM_ANALISE",
      },
    })

    return profile
  } catch (error) {
    console.error("[instructor-profile] Erro ao enviar documentos:", error)
    throw error
  }
}

/**
 * Helper para mudar status (usado depois manualmente via admin)
 */
export async function setInstructorStatus(userId: string, status: InstructorVerificationStatus) {
  try {
    const profile = await prisma.instructorProfile.update({
      where: { userId },
      data: { status },
    })

    return profile
  } catch (error) {
    console.error("[instructor-profile] Erro ao setar status:", error)
    throw error
  }
}

/**
 * Verifica se usuário tem perfil de instrutor ativo/aprovado
 */
export async function isInstructorApproved(userId: string): Promise<boolean> {
  try {
    const profile = await prisma.instructorProfile.findUnique({
      where: { userId },
      select: { status: true },
    })

    return profile?.status === "APROVADO"
  } catch {
    return false
  }
}

/**
 * Busca perfil de instrutor por userId
 */
export async function getInstructorProfile(userId: string) {
  try {
    return await prisma.instructorProfile.findUnique({
      where: { userId },
    })
  } catch (error) {
    console.error("[instructor-profile] Erro ao buscar profile:", error)
    return null
  }
}
