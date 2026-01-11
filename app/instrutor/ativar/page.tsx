import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { AtivarInstructorClient } from "./ativar-client"

export const dynamic = "force-dynamic"

export default async function AtivarInstructorPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login?returnTo=/instrutor/ativar")
  }

  return <AtivarInstructorClient />
}
