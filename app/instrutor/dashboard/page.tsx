import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function InstructorDashboardPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login?returnTo=/instrutor/dashboard")
  }

  return <DashboardClient />
}
