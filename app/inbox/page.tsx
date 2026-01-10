import { InboxClient } from "./inbox-client"

export const metadata = {
  title: "Mensagens - Via Betel",
  description: "Suas conversas",
}

export default function InboxPage() {
  return <InboxClient />
}
