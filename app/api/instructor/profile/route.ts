import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { bio, priceHour, categories, experience_years, specialties } = body

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: { instructorProfile: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        instructor_status: "PROFILE_DONE",
        instructorProfile: {
          update: {
            bio,
            priceHour,
            categories,
            experience_years,
            specialties,
          },
        },
      },
      include: { instructorProfile: true },
    })

    return NextResponse.json({ ok: true, profile: updated })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
