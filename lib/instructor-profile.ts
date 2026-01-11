import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

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

    const profileWithInstructor = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        instructorProfile: true,
      },
    })

    return profileWithInstructor
  } catch (error) {
    console.error("[instructor-profile] Erro ao buscar usuário com profile:", error)
    return null
  }
}

/**
 * Cria ou atualiza Step 1 (dados básicos) do InstructorProfile
 */
export async function upsertInstructorProfileBasics(
  profileId: string,
  data: {
    categories?: string // "A,B,C"
    bio?: string
    priceHour?: number
    serviceAreas?: Record<string, unknown>
    availabilityJson?: Record<string, unknown>
    experience_years?: number
    specialties?: string[]
    isPublic?: boolean
  },
) {
  try {
    const profile = await prisma.instructorProfile.upsert({
      where: { profileId },
      update: {
        categories: data.categories ? data.categories.split(",") : undefined,
        bio: data.bio,
        priceHour: data.priceHour,
        serviceAreas: data.serviceAreas,
        availabilityJson: data.availabilityJson,
        experience_years: data.experience_years,
        specialties: data.specialties,
        isPublic: data.isPublic,
      },
      create: {
        profileId,
        categories: data.categories ? data.categories.split(",") : [],
        bio: data.bio,
        priceHour: data.priceHour,
        serviceAreas: data.serviceAreas,
        availabilityJson: data.availabilityJson,
        experience_years: data.experience_years ?? 0,
        specialties: data.specialties ?? [],
        isPublic: data.isPublic ?? false,
      },
    })

    return profile
  } catch (error) {
    console.error("[instructor-profile] Erro ao upsert dados básicos:", error)
    throw error
  }
}

/**
 * Atualiza dados de documentos (Step 2)
 */
export async function submitInstructorDocuments(
  profileId: string,
  data: {
    documentType: string
    storagePath: string
  },
) {
  try {
    const document = await prisma.document.create({
      data: {
        profileId,
        documentType: data.documentType,
        storagePath: data.storagePath,
        status: "PENDING",
      },
    })

    return document
  } catch (error) {
    console.error("[instructor-profile] Erro ao enviar documentos:", error)
    throw error
  }
}

/**
 * Helper para mudar instructor_status (usado depois manualmente via admin)
 */
export async function setInstructorStatus(profileId: string, status: string) {
  try {
    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: { instructor_status: status },
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
export async function isInstructorApproved(profileId: string): Promise<boolean> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { instructor_status: true },
    })

    return profile?.instructor_status === "VERIFIED"
  } catch {
    return false
  }
}

/**
 * Busca perfil de instrutor por profileId
 */
export async function getInstructorProfile(profileId: string) {
  try {
    return await prisma.instructorProfile.findUnique({
      where: { profileId },
    })
  } catch (error) {
    console.error("[instructor-profile] Erro ao buscar profile:", error)
    return null
  }
}
