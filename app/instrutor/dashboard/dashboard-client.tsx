"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { TrendingUp, MessageSquare, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardClient() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeConversations: 0,
    rating: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Load stats
        const { data: requests } = await supabase
          .from("requests")
          .select("*", { count: "exact" })
          .eq("instructorId", user.id)

        const { data: conversations } = await supabase
          .from("conversations")
          .select("*", { count: "exact" })
          .eq("instructorId", user.id)
          .eq("request.status", "AGREED")

        setStats({
          totalRequests: requests?.length || 0,
          activeConversations: conversations?.length || 0,
          rating: 4.8,
        })
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <LoadingState message="Carregando dashboard..." />

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-8">
          Dashboard de Instrutor
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <TrendingUp className="w-8 h-8 text-emerald-600 mb-4" />
              <p className="text-gray-600 mb-2">Total de Solicitações</p>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
              <p className="text-gray-600 mb-2">Conversas Ativas</p>
              <p className="text-3xl font-bold">{stats.activeConversations}</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <Star className="w-8 h-8 text-yellow-600 mb-4" />
              <p className="text-gray-600 mb-2">Rating</p>
              <p className="text-3xl font-bold">{stats.rating}</p>
            </Card>
          </motion.div>
        </div>

        {stats.totalRequests === 0 ? (
          <EmptyState
            title="Sem solicitações ainda"
            description="Suas solicitações aparecerão aqui quando alunos entrarem em contato"
            icon="MessageSquare"
          />
        ) : null}
      </div>
    </div>
  )
}
