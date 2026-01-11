"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Zap, Crown, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatPrice, formatPricePerMonth, type Plan } from "@/lib/plans"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface PlansClientProps {
  plans: Plan[]
}

interface CurrentSubscription {
  id: string
  status: string
  expiresAt: string
  plan: {
    slug: string
    name: string
  }
}

export function PlansClient({ plans }: PlansClientProps) {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "YEARLY">("MONTHLY")
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)

  useEffect(() => {
    async function fetchCurrentSubscription() {
      if (!user) {
        setLoadingSubscription(false)
        return
      }

      try {
        const res = await fetch("/api/meus-planos")
        const data = await res.json()
        if (data.ok && data.subscription && data.subscription.status === "ACTIVE") {
          setCurrentSubscription(data.subscription)
        }
      } catch (error) {
        console.error("Erro ao buscar assinatura:", error)
      } finally {
        setLoadingSubscription(false)
      }
    }

    fetchCurrentSubscription()
  }, [user])

  const filteredPlans = plans.filter((plan) => {
    if (billingInterval === "MONTHLY") {
      return plan.interval === "MONTHLY"
    }
    return plan.interval === "YEARLY" || (plan.interval === "MONTHLY" && plan.slug !== "profissional")
  })

  const handleSelectPlan = async (plan: Plan) => {
    // Se não estiver logado, redirecionar para login com returnTo
    if (!user) {
      router.push(`/auth/login?returnTo=/planos/checkout?plan=${plan.slug}`)
      return
    }

    // Se não for instrutor, mostrar mensagem e direcionar para onboarding
    if (profile?.user_type !== "instructor") {
      toast({
        title: "Cadastro de Instrutor Necessário",
        description: "Para assinar planos, complete seu cadastro como instrutor.",
        variant: "default",
      })
      router.push("/instrutor/onboarding")
      return
    }

    // Se já tem esse plano ativo, desabilitar botão
    if (currentSubscription?.plan.slug === plan.slug) {
      return
    }

    router.push(`/planos/checkout?plan=${plan.slug}`)
  }

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case "gratuito":
        return <Shield className="w-8 h-8 text-gray-500" />
      case "basico":
        return <Star className="w-8 h-8 text-emerald-500" />
      case "profissional":
      case "profissional-anual":
        return <Crown className="w-8 h-8 text-amber-500" />
      default:
        return <Zap className="w-8 h-8 text-gray-500" />
    }
  }

  const isCurrentPlan = (planSlug: string) => {
    return currentSubscription?.plan.slug === planSlug
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos para Instrutores Via Betel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aumente sua visibilidade, conquiste a confiança dos alunos e faça sua carreira decolar
          </p>

          {user && currentSubscription && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <Crown className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">
                Seu plano atual: <strong>{currentSubscription.plan.name}</strong>
                {currentSubscription.expiresAt && (
                  <span className="text-emerald-600 ml-1">
                    (renova em {new Date(currentSubscription.expiresAt).toLocaleDateString("pt-BR")})
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingInterval("MONTHLY")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                billingInterval === "MONTHLY"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingInterval("YEARLY")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all relative",
                billingInterval === "YEARLY"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPlans.map((plan) => {
            const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features as string)
            const isPopular = plan.highlight
            const isCurrent = isCurrentPlan(plan.slug)

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-2xl border-2 p-6 flex flex-col transition-all hover:shadow-lg",
                  isCurrent
                    ? "border-emerald-500 shadow-emerald-100 shadow-lg"
                    : isPopular
                      ? "border-amber-400 shadow-amber-100 shadow-lg lg:scale-105"
                      : "border-gray-200 hover:border-emerald-300",
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Plano Atual
                  </div>
                )}
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Mais Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    {getPlanIcon(plan.slug)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPricePerMonth(plan.priceCents, plan.interval)}
                    </span>
                    {plan.priceCents > 0 && <span className="text-gray-500">/mês</span>}
                  </div>
                  {plan.interval === "YEARLY" && plan.priceCents > 0 && (
                    <p className="text-sm text-emerald-600 mt-1">{formatPrice(plan.priceCents)} cobrado anualmente</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Até {plan.maxListings} anúncio(s) ativo(s)
                  </li>
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || loadingSubscription}
                  className={cn(
                    "w-full py-6 text-base font-semibold",
                    isCurrent
                      ? "bg-emerald-100 text-emerald-700 cursor-default hover:bg-emerald-100"
                      : isPopular
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        : plan.priceCents === 0
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white",
                  )}
                >
                  {isCurrent
                    ? "Plano Atual"
                    : !user
                      ? "Entrar para contratar"
                      : plan.priceCents === 0
                        ? "Começar Grátis"
                        : "Assinar Agora"}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Garantia */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Todos os planos incluem 7 dias de garantia. Cancele quando quiser, sem multas.
          </p>
          <p className="text-xs text-gray-400 mt-2">Pagamento simulado - em breve integração com gateway real.</p>
        </div>
      </div>
    </div>
  )
}
