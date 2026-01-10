"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Shield, Key, LinkIcon } from "lucide-react"
import Link from "next/link"

export function ContaSegurancaClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/seguranca")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!user) return null

  const isGoogleAuth = user.app_metadata?.provider === "google"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/conta" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Segurança</h1>
          </div>

          <div className="space-y-4">
            <div className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Senha</h3>
                    <p className="text-sm text-gray-600">
                      {isGoogleAuth ? "Você faz login com o Google" : "Altere sua senha regularmente"}
                    </p>
                  </div>
                </div>
                {!isGoogleAuth && (
                  <Button asChild variant="outline">
                    <Link href="/auth/forgot-password">Trocar senha</Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Login com Google</h3>
                    <p className="text-sm text-gray-600">
                      {isGoogleAuth ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Conectado
                        </span>
                      ) : (
                        "Não conectado"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
