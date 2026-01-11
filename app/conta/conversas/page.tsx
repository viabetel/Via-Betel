import { supabase } from "@/lib/supabase/server"
import { ConversasClient } from "./conversas-client"

export const metadata = {
  title: "Minhas Conversas - Via Betel",
  description: "Conversas com instrutores sobre suas solicitações",
}

export default async function ConversasPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  return <ConversasClient userId={user.id} />
}
