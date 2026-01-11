import { redirect } from "next/navigation"
import { getCurrentUserWithInstructorProfile } from "@/lib/instructor-profile"
import OnboardingClient from "./onboarding-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InstructorOnboardingPage() {
  const userWithProfile = await getCurrentUserWithInstructorProfile()

  if (!userWithProfile) {
    redirect("/auth/login?returnTo=/instrutor/onboarding")
  }

  return <OnboardingClient initialProfile={userWithProfile.instructorProfile} />
}
