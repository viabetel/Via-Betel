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
  Calendar,
  MapPin,
  User,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Eye,
  DollarSign,
} from "lucide-react"
import { AppLink } from "@/components/app-link"

interface Solicitacao {
  id: string
  instructor_name: string
  instructor_city: string
  category: string
  status: "PENDING" | "VIEWED" | "RESPONDED" | "NEGOTIATING" | "COMPLETED" | "CANCELLED"
  created_at: string
  message?: string
  estimated_price?: number
}

export function ContaSolicitacoesClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | Solicitacao["status"]>("all")
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/solicitacoes")
    }

    if (user) {
      loadSolicitacoes()
    }
  }, [user, authLoading, router])

  const loadSolicitacoes = async () => {
    setTimeout(() => {
      setSolicitacoes([
        {
          id: "SOL-2025-001",
          instructor_name: "João Silva",
          instructor_city: "São Paulo - SP",
          category: "B",
          status: "PENDING",
          created_at: new Date().toISOString(),
          message: "Gostaria de agendar uma aula prática para CNH B.",
          estimated_price: 150,
        },
        {
          id: "SOL-2025-002",
          instructor_name: "Maria Santos",
          instructor_city: "Rio de Janeiro - RJ",
          category: "A",
          status: "VIEWED",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          message: "Preciso de aulas para CNH A, moto 160cc.",
        },
        {
          id: "SOL-2025-003",
          instructor_name: "Carlos Oliveira",
          instructor_city: "Belo Horizonte - MG",
          category: "B",
          status: "RESPONDED",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          message: "Aulas de reforço para prova prática.",
          estimated_price: 120,
        },
        {
          id: "SOL-2025-004",
          instructor_name: "Ana Costa",
          instructor_city: "Curitiba - PR",
          category: "C",
          status: "COMPLETED",
          created_at: new Date(Date.now() - 604800000).toISOString(),
          message: "Habilitação categoria C completa.",
          estimated_price: 2500,
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

  const filteredSolicitacoes = solicitacoes.filter((s) => {
    const matchesFilter = filter === "all" || s.status === filter
    const matchesSearch =
      !searchText ||
      s.instructor_name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.id.toLowerCase().includes(searchText.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: solicitacoes.length,
    pending: solicitacoes.filter((s) => s.status === "PENDING").length,
    responded: solicitacoes.filter((s) => s.status === "RESPONDED").length,
    completed: solicitacoes.filter((s) => s.status === "COMPLETED").length,
  }

  const getStatusConfig = (status: Solicitacao["status"]) => {
    const configs = {
      PENDING: {
        icon: Clock,
        label: "Enviada",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        description: "Aguardando visualização do instrutor",
      },
      VIEWED: {
        icon: Eye,
        label: "Visualizada",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        description: "Instrutor visualizou sua solicitação",
      },
      RESPONDED: {
        icon: MessageCircle,
        label: "Respondida",
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        description: "Instrutor respondeu com proposta",
      },
      NEGOTIATING: {
        icon: TrendingUp,
        label: "Em Negociação",
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        description: "Vocês estão negociando valores/horários",
      },
      COMPLETED: {
        icon: CheckCircle2,
        label: "Concluída",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        description: "Solicitação finalizada com sucesso",
      },
      CANCELLED: {
        icon: XCircle,
        label: "Cancelada",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        description: "Solicitação cancelada",
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
          <AppLink
            href="/conta"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </AppLink>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
          </div>
          <p className="text-gray-600">Acompanhe todas as suas solicitações de orçamento em tempo real</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PremiumCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
          </PremiumCard>

          <PremiumCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </PremiumCard>

          <PremiumCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Respondidas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.responded}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-400" />
            </div>
          </PremiumCard>

          <PremiumCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Concluídas</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          </PremiumCard>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID ou instrutor..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="all">Todos os Status</option>
            <option value="PENDING">Enviada</option>
            <option value="VIEWED">Visualizada</option>
            <option value="RESPONDED">Respondida</option>
            <option value="NEGOTIATING">Em Negociação</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </motion.div>

        {/* Solicitações List */}
        <AnimatePresence mode="wait">
          {filteredSolicitacoes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-gray-500 mb-6">
                {searchText || filter !== "all"
                  ? "Tente ajustar os filtros"
                  : "Comece explorando instrutores no marketplace"}
              </p>
              <Button asChild>
                <AppLink href="/instrutores">Explorar Instrutores</AppLink>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredSolicitacoes.map((sol, index) => {
                const statusConfig = getStatusConfig(sol.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.div
                    key={sol.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PremiumCard className="p-6 hover:shadow-xl transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: ID + Timeline */}
                        <div className="flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-1">ID</p>
                          <p className="font-mono text-sm font-semibold text-gray-900 mb-3">{sol.id}</p>

                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                            <div>
                              <p className={`font-semibold text-sm ${statusConfig.color}`}>{statusConfig.label}</p>
                              <p className="text-xs text-gray-600">{statusConfig.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{sol.instructor_name}</span>
                            <BadgeChip variant="teal" size="sm">
                              CNH {sol.category}
                            </BadgeChip>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{sol.instructor_city}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(sol.created_at).toLocaleString("pt-BR")}</span>
                          </div>

                          {sol.message && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic">{sol.message}</p>
                          )}

                          {sol.estimated_price && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                              <DollarSign className="w-4 h-4" />
                              <span>R$ {sol.estimated_price.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col gap-2 lg:flex-shrink-0">
                          <Button asChild size="sm" className="w-full lg:w-auto">
                            <AppLink href={`/chat?thread=${sol.id}`}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Abrir Chat
                            </AppLink>
                          </Button>

                          <Button asChild variant="outline" size="sm" className="w-full lg:w-auto bg-transparent">
                            <AppLink href={`/conta/solicitacoes/${sol.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </AppLink>
                          </Button>
                        </div>
                      </div>
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
