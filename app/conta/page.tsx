import type { Metadata } from "next"
import { ContaClient } from "./conta-client"

export const metadata: Metadata = {
  title: "Minha Conta | Via Betel",
  description: "Gerencie suas informações, preferências e configurações da sua conta Via Betel",
}

export default function ContaPage() {
  return <ContaClient />
}
