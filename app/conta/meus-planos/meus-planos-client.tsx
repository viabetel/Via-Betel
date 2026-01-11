"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Crown, Calendar, ExternalLink, Loader2, Package, AlertTriangle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLink } from "@/components/app-link"
import { useToast } from "@/hooks/use-toast"
import { formatPrice, PLAN_BADGES } from "@/lib/plans"
import { useAuth } from "@/lib/auth-context"

interface Subscription {
  id: string
  status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "EXPIRED"
  startedAt: string
  expiresAt: string | null
  canceledAt: string | null
  plan: {
    id: string
    slug: string
    name: string
    description: string
    priceCents: number
    interval: "MONTHLY" | "YEARLY"
    features: string[]
    maxListings: number
    badge: string | null
  }
}

interface ChatUsageInfo {
  hasActivePlan: boolean
  usedConversations: number
  limit: number
  remaining: number
  renewsAtFormatted: string
  isNearLimit: boolean
}

const STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  ACTIVE: { label: "Ativo", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  PAST_DUE: { label: "Pagamento Pendente", color: "text-amber-700", bgColor: "bg-amber-100" },
  CANCELED: { label: "Cancelado", color: "text-red-700", bgColor: "bg-red-100" },
  EXPIRED: { label: "Expirado", color: "text-gray-700", bgColor: "bg-gray-100" },
}

export function MeusPlansClient() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatUsage, setChatUsage] = useState<ChatUsageInfo | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const subRes = await fetch("/api/meus-planos")
        const subData = await subRes.json()
        if (subData.ok && subData.subscription) {
          const features = Array.isArray(subData.subscription.plan.features)
            ? subData.subscription.plan.features
            : JSON.parse(subData.subscription.plan.features || "[]")
          setSubscription({
            ...subData.subscription,
            plan: {
              ...subData.subscription.plan,
              features,
            },
          })
        }

        if (profile?.user_type === "instructor") {
          const usageRes = await fetch("/api/chat/usage")
          const usageData = await usageRes.json()
          if (usageData.ok) {
            setChatUsage({
              hasActivePlan: usageData.hasActivePlan,
              usedConversations: usageData.usedConversations,
              limit: usageData.limit,
              remaining: usageData.remaining,
              renewsAtFormatted: usageData.renewsAtFormatted,
              isNearLimit: usageData.isNearLimit,
            })
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, profile?.user_type])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (profile?.user_type !== "instructor") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Planos</h1>
          <p className="text-gray-600 mt-1">Planos disponíveis para instrutores</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Planos para Instrutores</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Os planos Via Betel são destinados para instrutores que desejam aumentar sua visibilidade e conquistar mais
            alunos.
          </p>
          <AppLink href="/instrutores">
            <Button className="bg-emerald-500 hover:bg-emerald-600">Explorar Instrutores</Button>
          </AppLink>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Planos</h1>
          <p className="text-gray-600 mt-1">Gerencie sua assinatura e benefícios</p>
        </div>

        {chatUsage && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Uso do Plano Gratuito</h3>
                  <p className="text-blue-100 text-sm">Conversas com alunos este mês</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Conversas utilizadas</span>
                  <span className={`font-medium ${chatUsage.isNearLimit ? "text-amber-600" : "text-gray-900"}`}>
                    {chatUsage.usedConversations} / {chatUsage.limit}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      chatUsage.remaining === 0
                        ? "bg-red-500"
                        : chatUsage.isNearLimit
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${(chatUsage.usedConversations / chatUsage.limit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Renova em {chatUsage.renewsAtFormatted}</span>
              </div>

              {chatUsage.isNearLimit && chatUsage.remaining > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">Você está quase atingindo o limite</p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Restam apenas {chatUsage.remaining} conversa{chatUsage.remaining !== 1 ? "s" : ""} este mês.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {chatUsage.remaining === 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Limite de conversas atingido</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Você não pode iniciar novas conversas com alunos até {chatUsage.renewsAtFormatted}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Quer conversar sem limites?</p>
                    <p className="text-sm text-gray-600">Upgrade para PRO e tenha conversas ilimitadas com alunos.</p>
                  </div>
                  <AppLink href="/planos">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                      Ver Planos
                    </Button>
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Seu perfil não está visível no marketplace</h4>
            <p className="text-sm text-red-600 mt-1">
              Sem um plano ativo, alunos não conseguem encontrar você no marketplace.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Você ainda não possui um plano Via Betel</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comece com o Plano Pro para ganhar mais visibilidade, conquistar a confiança dos alunos e receber mais
            solicitações de orçamento.
          </p>
          <AppLink href="/planos">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8">
              Ver Planos
            </Button>
          </AppLink>
        </div>
      </div>
    )
  }

  const badge = subscription.plan.badge ? PLAN_BADGES[subscription.plan.badge] : null
  const status = STATUS_LABELS[subscription.status]
  const expiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : null
  const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Planos</h1>
        <p className="text-gray-600 mt-1">Gerencie sua assinatura e benefícios</p>
      </div>

      {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800">
                Seu plano expira em {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}!
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Renove agora para continuar aparecendo no marketplace e manter suas conversas ilimitadas!
              </p>
              <div className="flex gap-2 mt-3">
                <AppLink href="/planos">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    Renovar Agora
                  </Button>
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{subscription.plan.name}</h2>
                <p className="text-emerald-100">{subscription.plan.description}</p>
              </div>
            </div>
            {badge && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bgColor} ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subscription.plan.priceCents)}/{subscription.plan.interval === "MONTHLY" ? "mês" : "ano"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${subscription.status === "ACTIVE" ? "bg-emerald-500" : "bg-current"}`}
                  />
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Início</span>
                <span className="font-medium text-gray-900">
                  {new Date(subscription.startedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Próxima cobrança</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {expiresAt.toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Conversas com alunos</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  Ilimitadas
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Seus benefícios</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Conversas ilimitadas com alunos
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  Até {subscription.plan.maxListings} anúncio(s) ativo(s)
                </li>
                {subscription.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            <AppLink href="/planos">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                Ver Outros Planos
              </Button>
            </AppLink>
          </div>
        </div>
      </div>
    </div>
  )
}
