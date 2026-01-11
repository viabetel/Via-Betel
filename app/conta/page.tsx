import type { Metadata } from "next"
import { ContaClient } from "./conta-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Minha Conta | Via Betel",
  description: "Gerencie suas informações, preferências e configurações da sua conta Via Betel",
}

export default function ContaPage() {
  redirect("/conta/perfil")
  return <ContaClient />
}
