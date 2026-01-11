import { Suspense } from "react"
import { MeusPlansClient } from "./meus-planos-client"

export const metadata = {
  title: "Meus Planos | Via Betel",
  description: "Gerencie sua assinatura",
}

export default function MeusPlansPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
      <MeusPlansClient />
    </Suspense>
  )
}
