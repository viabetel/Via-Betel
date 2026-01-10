"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { PremiumCard } from "@/components/ui/premium-card"
import { Button } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge-chip"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  ArrowLeft,
  ClipboardList,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Solicitacao {
  id: string
  instructor_name: string
  instructor_city: string
  category: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
  created_at: string
  message?: string
}

export function ContaSolicitacoesClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED">("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/solicitacoes")
    }

    if (user) {
      loadSolicitacoes()
    }
  }, [user, authLoading, router])

  const loadSolicitacoes = async () => {
    // Mock data para demonstração
    // TODO: Substituir por chamada real ao Supabase
    setTimeout(() => {
      setSolicitacoes([
        {
          id: "1",
          instructor_name: "João Silva",
          instructor_city: "São Paulo - SP",
          category: "B",
          status: "PENDING",
          created_at: new Date().toISOString(),
          message: "Gostaria de agendar uma aula prática.",
        },
        {
          id: "2",
          instructor_name: "Maria Santos",
          instructor_city: "Rio de Janeiro - RJ",
          category: "A",
          status: "ACCEPTED",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          message: "Preciso de aulas para CNH A.",
        },
      ])
      setLoading(false)
    }, 1000)
  }

  if (authLoading || loading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-600">Carregando suas solicitações...</p>
      </motion.div>
    )
  }

  if (!user) return null

  const filteredSolicitacoes = filter === "all" ? solicitacoes : solicitacoes.filter((s) => s.status === filter)

  const stats = {
    total: solicitacoes.length,
    pending: solicitacoes.filter((s) => s.status === "PENDING").length,
    accepted: solicitacoes.filter((s) => s.status === "ACCEPTED").length,
    completed: solicitacoes.filter((s) => s.status === "COMPLETED").length,
  }

  const getStatusConfig = (status: Solicitacao["status"]) => {
    const configs = {
      PENDING: {
        icon: Clock,
        label: "Pendente",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      },
      ACCEPTED: {
        icon: CheckCircle2,
        label: "Aceita",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      },
      REJECTED: {
        icon: XCircle,
        label: "Recusada",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      },
      COMPLETED: {
        icon: CheckCircle2,
        label: "Concluída",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      },
    }
    return configs[status]
  }

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

        {/* Header + Stats */}
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <ClipboardList className="w-10 h-10 text-emerald-600" />
              Minhas Solicitações
            </h1>
            <p className="text-gray-600">Acompanhe todas as suas solicitações de orçamento e aulas</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <PremiumCard className="p-4" gradient>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                  <p className="text-xs text-gray-600">Pendentes</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
                  <p className="text-xs text-gray-600">Aceitas</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                  <p className="text-xs text-gray-600">Concluídas</p>
                </div>
              </div>
            </PremiumCard>
          </div>
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PremiumCard className="p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Todas" },
                  { value: "PENDING", label: "Pendentes" },
                  { value: "ACCEPTED", label: "Aceitas" },
                  { value: "REJECTED", label: "Recusadas" },
                  { value: "COMPLETED", label: "Concluídas" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === option.value
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Solicitações List */}
        <AnimatePresence mode="wait">
          {filteredSolicitacoes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PremiumCard className="p-12">
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <ClipboardList className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {filter === "all" ? "Nenhuma solicitação ainda" : `Nenhuma solicitação ${filter.toLowerCase()}`}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {filter === "all"
                      ? "Quando você solicitar orçamentos ou aulas, eles aparecerão aqui para acompanhamento"
                      : "Não há solicitações neste status no momento"}
                  </p>
                  <Button asChild>
                    <Link href="/instrutores">
                      <Search className="w-4 h-4 mr-2" />
                      Explorar Instrutores
                    </Link>
                  </Button>
                </div>
              </PremiumCard>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-4">
              {filteredSolicitacoes.map((solicitacao, index) => {
                const statusConfig = getStatusConfig(solicitacao.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.div
                    key={solicitacao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PremiumCard className="p-6 hover:shadow-2xl cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Avatar + Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {solicitacao.instructor_name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              <User className="w-4 h-4 text-emerald-600" />
                              {solicitacao.instructor_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {solicitacao.instructor_city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(solicitacao.created_at).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <BadgeChip
                              label={`CNH ${solicitacao.category}`}
                              icon={<ClipboardList className="w-3.5 h-3.5" />}
                            />
                            {solicitacao.message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700 flex items-start gap-2">
                                  <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  {solicitacao.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${statusConfig.bg} border-2 ${statusConfig.border}`}
                        >
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                          <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {solicitacao.status === "ACCEPTED" && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Iniciar Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        </div>
                      )}
                    </PremiumCard>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
