"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PremiumCard } from "@/components/ui/premium-card"
import { Button } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge-chip"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, Heart, Search, Star, MapPin, GraduationCap, MessageCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FavoritoInstrutor {
  id: string
  name: string
  city: string
  rating: number
  specialties: string[]
  reviewCount: number
  price: string
  avatar?: string
}

export function ContaFavoritosClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [favoritos, setFavoritos] = useState<FavoritoInstrutor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/favoritos")
    }

    if (user) {
      loadFavoritos()
    }
  }, [user, authLoading, router])

  const loadFavoritos = async () => {
    // Mock data para demonstração
    setTimeout(() => {
      setFavoritos([
        {
          id: "1",
          name: "João Silva",
          city: "São Paulo - SP",
          rating: 4.9,
          specialties: ["B", "A"],
          reviewCount: 124,
          price: "R$ 150/aula",
          avatar: "/instructor1.png",
        },
        {
          id: "2",
          name: "Maria Santos",
          city: "Rio de Janeiro - RJ",
          rating: 4.8,
          specialties: ["A", "AB"],
          reviewCount: 89,
          price: "R$ 180/aula",
        },
      ])
      setLoading(false)
    }, 1000)
  }

  const removeFavorito = (id: string) => {
    setFavoritos((prev) => prev.filter((f) => f.id !== id))
  }

  if (authLoading || loading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-600">Carregando seus favoritos...</p>
      </motion.div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div className="mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            Instrutores Favoritos
          </h1>
          <p className="text-gray-600">Seus instrutores salvos para acesso rápido</p>
        </motion.div>

        {/* Stats */}
        {favoritos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PremiumCard className="p-6 mb-6" gradient>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{favoritos.length}</p>
                    <p className="text-sm text-gray-600">
                      {favoritos.length === 1 ? "Instrutor favorito" : "Instrutores favoritos"}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href="/instrutores">
                    <Search className="w-4 h-4 mr-2" />
                    Adicionar mais
                  </Link>
                </Button>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* Favoritos List */}
        <AnimatePresence mode="wait">
          {favoritos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PremiumCard className="p-16">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <Heart className="w-24 h-24 text-gray-200 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Nenhum favorito ainda</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Salve instrutores para encontrá-los facilmente depois e acompanhar suas ofertas
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/instrutores">
                      <Search className="w-5 h-5 mr-2" />
                      Explorar Instrutores
                    </Link>
                  </Button>
                </div>
              </PremiumCard>
            </motion.div>
          ) : (
            <motion.div key="list" className="grid md:grid-cols-2 gap-6">
              {favoritos.map((instrutor, index) => (
                <motion.div
                  key={instrutor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PremiumCard className="p-6 hover:shadow-2xl group">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      {instrutor.avatar ? (
                        <Image
                          src={instrutor.avatar || "/placeholder.svg"}
                          alt={instrutor.name}
                          width={80}
                          height={80}
                          className="rounded-xl border-2 border-emerald-200 group-hover:border-emerald-400 transition-all"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-105 transition-transform">
                          {instrutor.name.charAt(0)}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{instrutor.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          {instrutor.city}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-semibold text-amber-700">{instrutor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({instrutor.reviewCount} avaliações)</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFavorito(instrutor.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {instrutor.specialties.map((specialty) => (
                        <BadgeChip
                          key={specialty}
                          label={`CNH ${specialty}`}
                          icon={<GraduationCap className="w-3.5 h-3.5" />}
                        />
                      ))}
                    </div>

                    {/* Price + Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="font-bold text-emerald-600 text-lg">{instrutor.price}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/instrutores/${instrutor.id}`}>Ver Perfil</Link>
                        </Button>
                        <Button size="sm">
                          <MessageCircle className="w-4 h-4 mr-1.5" />
                          Contatar
                        </Button>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
