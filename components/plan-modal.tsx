"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PLANS, formatPrice, type PlanId } from "@/lib/plans"
import { useRouter } from "next/navigation"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  instructorSlug: string
  instructorName: string
}

export function PlanModal({ isOpen, onClose, instructorSlug, instructorName }: PlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!selectedPlan) return

    setIsLoading(true)

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructorSlug,
          planId: selectedPlan,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar checkout")
      }

      // Redirecionar para Stripe Checkout
      window.location.href = data.url
    } catch (err: any) {
      alert(err.message || "Erro ao processar pagamento")
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
                <p className="text-emerald-100 text-sm mt-1">Aulas com {instructorName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Plans Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PLANS).map(([key, plan]) => {
                const isSelected = selectedPlan === key
                const isPlanPopular = (plan as any).popular

                return (
                  <motion.div
                    key={key}
                    onClick={() => setSelectedPlan(key as PlanId)}
                    whileHover={{ scale: 1.02 }}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 shadow-lg"
                        : "border-gray-200 hover:border-emerald-300 bg-white"
                    } ${isPlanPopular ? "ring-2 ring-amber-400" : ""}`}
                  >
                    {isPlanPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        MAIS POPULAR
                      </div>
                    )}

                    {plan.badge && !isPlanPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {plan.badge}
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</div>
                      <div className="text-lg font-semibold text-gray-700">{plan.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(plan.pricePerLesson)} <span className="text-xs">por aula</span>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>
                            {plan.lessons} aula{plan.lessons > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Instrutor certificado</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Suporte Via Betel</span>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 py-6 bg-transparent"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={!selectedPlan || isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 disabled:opacity-50"
              >
                {isLoading ? "Processando..." : "Ir para Pagamento"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
