"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Shield, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { formatPrice, type Plan } from "@/lib/plans"
import { useAuth } from "@/lib/auth-context"

interface CheckoutClientProps {
  plan: Plan
}

const isValidCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s+/g, "").replace(/[^0-9]/g, "")
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

const isValidExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split("/")
  if (!month || !year || month.length !== 2 || year.length !== 2) return false

  const monthNum = Number.parseInt(month, 10)
  if (monthNum < 1 || monthNum > 12) return false

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const cardYear = Number.parseInt(year, 10)
  if (cardYear < currentYear) return false
  if (cardYear === currentYear && monthNum < currentMonth) return false

  return true
}

const isValidCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv)
}

export function CheckoutClient({ plan }: CheckoutClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  if (!user || profile?.user_type !== "instructor") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">Acesso restrito</h2>
              <p className="text-red-700 mb-4">Você precisa estar logado como instrutor para acessar o checkout.</p>
              <Button onClick={() => router.push("/auth/login?returnTo=/planos")}>Fazer Login</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features as string)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || !isValidCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Número de cartão inválido"
    }

    if (!formData.cardName || formData.cardName.trim().length < 3) {
      newErrors.cardName = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!formData.expiry || !isValidExpiry(formData.expiry)) {
      newErrors.expiry = "Data de validade inválida (formato: MM/AA)"
    }

    if (!formData.cvv || !isValidCVV(formData.cvv)) {
      newErrors.cvv = "CVV deve ter 3 ou 4 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Formulário inválido",
        description: "Por favor, verifique os dados do cartão",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simular delay de processamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const res = await fetch("/api/planos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug }),
      })

      const data = await res.json()

      if (data.ok) {
        toast({
          title: "Assinatura realizada com sucesso!",
          description: `Bem-vindo ao plano ${plan.name}!`,
        })
        router.push("/conta/meus-planos?success=true")
      } else {
        toast({
          title: "Erro ao processar assinatura",
          description: data.error || "Tente novamente",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível processar. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Finalizar Assinatura</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Resumo do Plano */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500">
                {plan.interval === "MONTHLY" ? "Cobrança mensal" : "Cobrança anual"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{formatPrice(plan.priceCents)}</p>
              <p className="text-xs text-gray-500">{plan.interval === "MONTHLY" ? "/mês" : "/ano"}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              Até {plan.maxListings} anúncio(s) ativo(s)
            </li>
            {features.slice(0, 5).map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 p-3 bg-emerald-50 rounded-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-700">7 dias de garantia - cancele quando quiser</p>
          </div>
        </div>

        {/* Formulário de Pagamento */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Dados do Cartão
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={(e) => {
                  setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                  if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" })
                }}
                maxLength={19}
                className={errors.cardNumber ? "border-red-500" : ""}
                required
              />
              {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>}
            </div>

            <div>
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input
                id="cardName"
                placeholder="Como está no cartão"
                value={formData.cardName}
                onChange={(e) => {
                  setFormData({ ...formData, cardName: e.target.value.toUpperCase() })
                  if (errors.cardName) setErrors({ ...errors, cardName: "" })
                }}
                className={errors.cardName ? "border-red-500" : ""}
                required
              />
              {errors.cardName && <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Validade</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={formData.expiry}
                  onChange={(e) => {
                    setFormData({ ...formData, expiry: formatExpiry(e.target.value) })
                    if (errors.expiry) setErrors({ ...errors, expiry: "" })
                  }}
                  maxLength={5}
                  className={errors.expiry ? "border-red-500" : ""}
                  required
                />
                {errors.expiry && <p className="text-xs text-red-600 mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => {
                    setFormData({ ...formData, cvv: e.target.value.replace(/[^0-9]/g, "") })
                    if (errors.cvv) setErrors({ ...errors, cvv: "" })
                  }}
                  maxLength={4}
                  className={errors.cvv ? "border-red-500" : ""}
                  required
                />
                {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-6 text-base font-semibold bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  `Assinar por ${formatPrice(plan.priceCents)}${plan.interval === "MONTHLY" ? "/mês" : "/ano"}`
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Pagamento simulado. Em breve integração com gateway real.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
