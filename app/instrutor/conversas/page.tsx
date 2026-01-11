export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase/server"
import { InstructorConversasClient } from "./conversas-client"

export const metadata = {
  title: "Conversas com Alunos - Via Betel",
  description: "Conversas com alunos sobre solicitações",
}

export default async function InstructorConversasPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  return <InstructorConversasClient userId={user.id} />
}
