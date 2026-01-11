export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlansClient } from "./plans-client"
import { getPlans } from "@/app/actions/plans"

export const metadata = {
  title: "Planos para Instrutores | Via Betel",
  description: "Escolha o plano ideal para aumentar sua visibilidade e conquistar mais alunos",
}

export default async function PlansPage() {
  const plans = await getPlans()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Carregando...</div>}>
          <PlansClient plans={plans} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
