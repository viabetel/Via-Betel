import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatShell } from "@/components/chat/chat-shell"
import { Suspense } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ChatPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login?returnTo=/chat")
  }

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Carregando chat...</div>}>
      <ChatShell />
    </Suspense>
  )
}
