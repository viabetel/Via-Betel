"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { PLANS, formatPrice } from "@/lib/plans"
import { Button } from "@/components/ui/button"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  instructorSlug: string
  instructorName: string
}

export default function PlanModal({ isOpen, onClose, instructorSlug, instructorName }: PlanModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId)
    setLoading(true)

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          instructorSlug,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        console.error("[v0] Erro ao criar checkout:", data.error)
        alert("Erro ao processar pagamento. Tente novamente.")
        setLoading(false)
        setSelectedPlan(null)
      }
    } catch (error) {
      console.error("[v0] Erro ao chamar API:", error)
      alert("Erro ao processar pagamento. Tente novamente.")
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Escolha seu Plano</h2>
                    <p className="text-emerald-100 text-sm sm:text-base">
                      Aulas com <span className="font-bold">{instructorName}</span>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    aria-label="Fechar modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(PLANS).map((plan) => {
                    const isSelected = selectedPlan === plan.id
                    const isLoading = loading && isSelected

                    return (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`
                          relative border-2 rounded-xl p-6 transition-all
                          ${
                            plan.popular
                              ? "border-amber-400 shadow-lg shadow-amber-100 bg-gradient-to-br from-amber-50 to-white"
                              : "border-gray-200 hover:border-emerald-400 bg-white hover:shadow-lg"
                          }
                        `}
                      >
                        {/* Popular Badge */}
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                            {plan.description}
                          </div>
                        )}

                        {/* Discount Badge */}
                        {plan.badge && !plan.popular && (
                          <div className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            {plan.badge}
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              {formatPrice(plan.price)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{formatPrice(plan.pricePerLesson)} por aula</p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>{plan.lessons}</strong> {plan.lessons === 1 ? "aula" : "aulas"} práticas
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Instrutor certificado</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Flexibilidade de horários</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>Pagamento seguro via Stripe</span>
                          </li>
                        </ul>

                        {/* CTA Button */}
                        <Button
                          onClick={() => handleSelectPlan(plan.id)}
                          disabled={loading}
                          className={`
                            w-full h-12 font-bold text-base transition-all
                            ${
                              plan.popular
                                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processando...
                            </span>
                          ) : (
                            "Escolher Plano"
                          )}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-gray-700 text-center">
                    💳 <strong>Pagamento 100% seguro</strong> via Stripe. Aceitamos Pix e Cartão de Crédito.
                    <br />
                    Após o pagamento, você receberá instruções para agendar suas aulas.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
