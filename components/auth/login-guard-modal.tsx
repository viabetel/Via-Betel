"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock, UserPlus, LogIn } from "lucide-react"
import { COLORS } from "@/lib/ui/tokens"

interface LoginGuardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: "favoritar" | "comparar" | "salvar busca"
  onSuccess?: () => void
}

/**
 * Modal que exige login antes de usar features premium
 * Guarda o returnTo para voltar após autenticação
 */
export function LoginGuardModal({ open, onOpenChange, feature, onSuccess }: LoginGuardModalProps) {
  const router = useRouter()
  const [returnTo] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname + window.location.search
    }
    return "/instrutores"
  })

  const handleLogin = () => {
    // Salva returnTo em localStorage para restaurar depois
    if (typeof window !== "undefined") {
      localStorage.setItem("via-betel-return-to", returnTo)
    }
    router.push(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
    onOpenChange(false)
  }

  const handleSignUp = () => {
    // Salva returnTo em localStorage para restaurar depois
    if (typeof window !== "undefined") {
      localStorage.setItem("via-betel-return-to", returnTo)
    }
    router.push(`/auth/sign-up?returnTo=${encodeURIComponent(returnTo)}`)
    onOpenChange(false)
  }

  const featureLabels = {
    favoritar: {
      title: "Favoritar Instrutores",
      description: "Salve seus instrutores favoritos para acessar rapidamente depois",
      icon: "❤️",
    },
    comparar: {
      title: "Comparar Instrutores",
      description: "Compare preços, avaliações e características de múltiplos instrutores",
      icon: "⚖️",
    },
    "salvar busca": {
      title: "Salvar Busca",
      description: "Salve seus filtros para encontrar instrutores rapidamente no futuro",
      icon: "🔖",
    },
  }

  const currentFeature = featureLabels[feature]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">{currentFeature.title}</DialogTitle>
          <DialogDescription className="text-center text-base">{currentFeature.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            onClick={handleSignUp}
            style={{ background: COLORS.gradients.primary }}
            className="w-full text-white shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Criar Conta Grátis
          </Button>

          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Já tenho conta
          </Button>
        </div>

        <p className="text-center text-xs text-neutral-500">
          Após criar sua conta, você poderá {feature} e aproveitar outras funcionalidades exclusivas
        </p>
      </DialogContent>
    </Dialog>
  )
}
