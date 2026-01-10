import { Suspense } from "react"
import SuporteClient from "./suporte-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Central de Ajuda | Via Betel",
  description: "Tire suas dúvidas, veja perguntas frequentes e entre em contato com nossa equipe de suporte.",
}

export default function SuportePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuporteClient />
    </Suspense>
  )
}
