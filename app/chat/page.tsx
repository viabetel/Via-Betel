import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatClient from "./chat-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ChatPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return <ChatClient user={data.user} profile={profile} />
}
