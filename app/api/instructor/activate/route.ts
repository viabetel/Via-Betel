import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.instructor_status !== "NONE") {
      return NextResponse.json({ error: "Already activated" }, { status: 400 })
    }

    // Criar InstructorProfile e marcar como STARTED
    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        instructor_status: "STARTED",
        instructorProfile: {
          create: {},
        },
      },
    })

    return NextResponse.json({ ok: true, profile: updated })
  } catch (error) {
    console.error("Error activating instructor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
