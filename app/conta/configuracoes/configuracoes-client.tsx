"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { Loader2, Settings, Bell, Globe, Palette, AlertTriangle, Trash2 } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"

export function ContaConfiguracoesClient() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?returnTo=/conta/configuracoes")
    }
  }, [user, loading, router])

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "EXCLUIR") {
      setDeleteError("Digite EXCLUIR para confirmar")
      return
    }

    setDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir conta")
      }

      // Deslogar e redirecionar
      const supabase = createBrowserClient()
      await supabase.auth.signOut()

      // Redirecionar com mensagem
      router.push("/?deleted=true")
    } catch (error: any) {
      console.error("[v0] Delete account error:", error)
      setDeleteError(error.message || "Erro ao excluir conta. Tente novamente.")
    } finally {
      setDeleting(false)
    }
  }

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

          <div className="mt-12 pt-8 border-t border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Zona de Perigo
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Excluir minha conta</h3>
                  <p className="text-red-700 text-sm mb-4">
                    Esta ação é <strong>irreversível</strong>. Todos os seus dados serão permanentemente removidos,
                    incluindo perfil, conversas, assinaturas e qualquer outro dado associado à sua conta.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir minha conta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Excluir conta permanentemente
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Esta ação é <strong className="text-red-600">irreversível</strong>. Todos os seus dados serão
              permanentemente excluídos e não poderão ser recuperados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>O que será excluído:</strong>
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                <li>Seu perfil e dados pessoais</li>
                <li>Todas as conversas e mensagens</li>
                <li>Assinaturas e histórico de pagamentos</li>
                <li>Acesso à plataforma</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, digite <strong className="text-red-600">EXCLUIR</strong> abaixo:
              </label>
              <Input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                placeholder="EXCLUIR"
                className="font-mono"
              />
            </div>

            {deleteError && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg text-sm">
                {deleteError}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "EXCLUIR" || deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir permanentemente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
