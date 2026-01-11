import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const supabase = createClient()

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    let uploadedCount = 0

    for (const [key, file] of formData.entries()) {
      if (file instanceof File) {
        const fileName = `${user.id}/${key}-${Date.now()}`
        const { data, error } = await supabase.storage.from("documents").upload(fileName, file, { upsert: true })

        if (error) throw error

        // Save document record
        await prisma.document.create({
          data: {
            profileId: profile.id,
            documentType: key,
            storagePath: fileName,
            status: "PENDING",
          },
        })

        uploadedCount++
      }
    }

    // Update profile status
    await prisma.profile.update({
      where: { id: profile.id },
      data: { instructor_status: "UNDER_REVIEW" },
    })

    return NextResponse.json({ ok: true, uploadedCount })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
