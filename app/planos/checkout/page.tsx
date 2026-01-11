import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutClient } from "./checkout-client"
import { getPlanBySlug } from "@/app/actions/plans"

export const metadata = {
  title: "Checkout | Via Betel",
  description: "Finalize sua assinatura",
}

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { plan: planSlug } = await searchParams

  if (!planSlug) {
    redirect("/planos")
  }

  const plan = await getPlanBySlug(planSlug)

  if (!plan) {
    redirect("/planos")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Carregando...</div>}>
          <CheckoutClient plan={plan} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
