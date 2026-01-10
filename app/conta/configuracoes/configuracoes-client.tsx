"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { Loader2, Settings, Bell, Globe, Palette } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"
import { Button } from "@/components/ui/button"

export function ContaConfiguracoesClient() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?returnTo=/conta/configuracoes")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Settings className="w-8 h-8 text-emerald-600" />
          Configurações
        </h1>

        <div className="space-y-4">
          <PremiumCard className="p-6">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Notificações</h2>
                <p className="text-gray-600 mb-4">Gerencie como e quando você recebe notificações</p>
                <Button variant="outline" size="sm">
                  Configurar Notificações
                </Button>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Idioma e Região</h2>
                <p className="text-gray-600 mb-4">Personalize idioma e preferências regionais</p>
                <Button variant="outline" size="sm">
                  Alterar Idioma
                </Button>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="flex items-start gap-4">
              <Palette className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Aparência</h2>
                <p className="text-gray-600 mb-4">Escolha o tema que mais combina com você</p>
                <Button variant="outline" size="sm">
                  Personalizar Tema
                </Button>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </motion.div>
  )
}
