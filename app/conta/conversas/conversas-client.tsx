"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ArrowLeft, Clock, MapPin } from "lucide-react"
import { AppLink } from "@/components/app-link"
import { EmptyState } from "@/components/empty-state"
import { LoadingState } from "@/components/loading-state"

interface Conversa {
  id: string
  requestId: string
  instructorName: string
  instructorCity: string
  category: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  status: string
}

export function ConversasClient({ userId }: { userId: string }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/conversas")
    }

    if (user) {
      loadConversas()
    }
  }, [user, authLoading, router])

  const loadConversas = async () => {
    try {
      setLoading(true)
      // Carrega conversas do aluno (via supabase realtime)
      // Placeholder com dados mock
      setTimeout(() => {
        setConversas([
          {
            id: "conv-1",
            requestId: "req-1",
            instructorName: "João Silva",
            instructorCity: "São Paulo - SP",
            category: "B",
            lastMessage: "Ok, podemos agendar para segunda-feira?",
            lastMessageAt: new Date(Date.now() - 300000).toISOString(),
            unreadCount: 1,
            status: "AGREED",
          },
        ])
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("[v0] Failed to load conversas:", error)
      setLoading(false)
    }
  }

  if (loading) return <LoadingState />

  if (conversas.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nenhuma conversa"
        description="Quando você criar uma solicitação e um instrutor responder, a conversa aparecerá aqui."
        action={<AppLink href="/solicitacoes/nova">Criar Solicitação</AppLink>}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <AppLink href="/conta/perfil">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </AppLink>
          <h1 className="text-2xl md:text-3xl font-bold">Minhas Conversas</h1>
        </div>

        <AnimatePresence>
          <div className="space-y-4">
            {conversas.map((conversa, idx) => (
              <motion.div
                key={conversa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => router.push(`/solicitacoes/${conversa.requestId}`)}
                  className="w-full p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{conversa.instructorName}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {conversa.instructorCity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Categoria {conversa.category}
                        </span>
                      </div>
                      <p className="text-sm mt-3 text-foreground/80 line-clamp-2">{conversa.lastMessage}</p>
                    </div>
                    {conversa.unreadCount > 0 && (
                      <span className="ml-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {conversa.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
}
