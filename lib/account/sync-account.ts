import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export type UserRole = "STUDENT" | "INSTRUCTOR"

export interface SyncAccountResult {
  role: UserRole
  profile: any
  prismaUser: any
}

export async function syncAccount(userType?: "student" | "instructor"): Promise<SyncAccountResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Unauthorized: No active session")
  }

  let role: UserRole = "STUDENT"

  // 1. Check existing profile
  const existingProfile = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const existingRole = existingProfile.data?.role as UserRole | undefined

  // 2. If userType param is present, use it (allows STUDENT -> INSTRUCTOR upgrade)
  if (userType) {
    role = userType === "instructor" ? "INSTRUCTOR" : "STUDENT"
  } else if (existingRole) {
    // 3. Otherwise keep existing role
    role = existingRole
  } else if (user.user_metadata?.user_type) {
    // 4. Fallback to metadata
    role = user.user_metadata.user_type === "instructor" ? "INSTRUCTOR" : "STUDENT"
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      role,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  )

  if (profileError) {
    console.error("[v0] Profile upsert error:", profileError)
  }

  try {
    const prismaUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      },
    })

    return { role, profile: existingProfile.data || { id: user.id, email: user.email, role }, prismaUser }
  } catch (e) {
    console.error("[v0] Prisma sync error:", e)
    return { role, profile: existingProfile.data || { id: user.id, email: user.email, role }, prismaUser: null }
  }
}
