"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"

export function ContaFavoritosClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/favoritos")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/conta" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Instrutores Favoritos</h1>

          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum favorito ainda</h3>
            <p className="text-gray-600 mb-6">Salve instrutores para encontrá-los facilmente depois</p>
            <Button asChild>
              <Link href="/instrutores">Explorar Instrutores</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
