import { InboxClient } from "./inbox-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Mensagens - Via Betel",
  description: "Suas conversas",
}

export default function InboxPage() {
  return <InboxClient />
}
