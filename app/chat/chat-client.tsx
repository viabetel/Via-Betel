"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageSquare, LogOut, Home, AlertTriangle, Crown, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"
import { BadgeChip } from "@/components/ui/badge-chip"
import { AppLink } from "@/components/app-link"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  user_type: "student" | "instructor" | "admin"
}

interface ChatUsageInfo {
  hasActivePlan: boolean
  usedConversations: number
  limit: number
  remaining: number
  renewsAtFormatted: string
  isNearLimit: boolean
}

interface Conversation {
  id: string
  student_id: string
  instructor_id: string
  status: string
  created_at: string
  other_user_name?: string
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export default function ChatClient({ user, profile }: { user: User; profile: Profile | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const [chatUsage, setChatUsage] = useState<ChatUsageInfo | null>(null)
  const [loadingUsage, setLoadingUsage] = useState(true)
  const [instructorStatus, setInstructorStatus] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChatUsage() {
      if (profile?.user_type !== "instructor") {
        setLoadingUsage(false)
        return
      }

      try {
        const res = await fetch("/api/chat/usage")
        const data = await res.json()

        if (data.ok) {
          setChatUsage({
            hasActivePlan: data.hasActivePlan,
            usedConversations: data.usedConversations,
            limit: data.limit,
            remaining: data.remaining,
            renewsAtFormatted: data.renewsAtFormatted,
            isNearLimit: data.isNearLimit,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar uso de chat:", error)
      } finally {
        setLoadingUsage(false)
      }
    }

    fetchChatUsage()
  }, [profile?.user_type])

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation) return

    const channel = supabase
      .channel(`messages:${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (profile?.user_type !== "instructor") return
      try {
        const res = await fetch("/instrutor/api/profile-status")
        const data = await res.json()
        if (data.status !== "APROVADO") {
          // Mostrar banner de aviso no chat
          setInstructorStatus(data.status)
        }
      } catch (err) {
        console.log("[v0] Erro ao verificar status instrutor:", err)
      }
    }
    checkOnboardingStatus()
  }, [profile])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`student_id.eq.${user.id},instructor_id.eq.${user.id}`)
        .eq("status", "active")
        .order("updated_at", { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])

      await supabase
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === "FREE_LIMIT_REACHED") {
          toast({
            title: "Limite de conversas atingido",
            description: `Você atingiu o limite de ${data.limit} conversas com alunos neste mês no plano gratuito.`,
            variant: "destructive",
          })
          // Atualiza estado local
          if (chatUsage) {
            setChatUsage({
              ...chatUsage,
              usedConversations: data.usedConversations,
              remaining: 0,
            })
          }
          return
        }
        throw new Error(data.error)
      }

      setNewMessage("")

      if (profile?.user_type === "instructor" && !chatUsage?.hasActivePlan) {
        const usageRes = await fetch("/api/chat/usage")
        const usageData = await usageRes.json()
        if (usageData.ok) {
          setChatUsage({
            hasActivePlan: usageData.hasActivePlan,
            usedConversations: usageData.usedConversations,
            limit: usageData.limit,
            remaining: usageData.remaining,
            renewsAtFormatted: usageData.renewsAtFormatted,
            isNearLimit: usageData.isNearLimit,
          })
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isInstructor = profile?.user_type === "instructor"
  const canSendMessages = !isInstructor || chatUsage?.hasActivePlan || (chatUsage?.remaining ?? 0) > 0

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col" style={{ boxShadow: SHADOWS.md }}>
        <div className="p-4 border-b" style={{ background: COLORS.gradients.primary }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Chat Via Betel</h2>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/90 flex-1 truncate">{profile?.full_name || user.email}</p>
            <BadgeChip variant={profile?.user_type === "student" ? "success" : "primary"}>
              {profile?.user_type === "student" ? "Aluno" : "Instrutor"}
            </BadgeChip>
          </div>
        </div>

        {isInstructor && instructorStatus && instructorStatus !== "APROVADO" && (
          <div className="p-3 bg-yellow-50 border-b border-yellow-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-yellow-700">Status de Instrutor</p>
                <p className="text-xs text-yellow-600 mt-0.5">
                  Seu perfil de instrutor está atualmente {instructorStatus}. Por favor, complete o onboarding para
                  continuar.
                </p>
                <AppLink href="/onboarding">
                  <Button size="sm" className="mt-2 h-7 text-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Completar Onboarding
                  </Button>
                </AppLink>
              </div>
            </div>
          </div>
        )}

        {isInstructor && !loadingUsage && chatUsage && !chatUsage.hasActivePlan && (
          <div
            className={`p-3 border-b ${chatUsage.isNearLimit ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"}`}
          >
            <div className="flex items-start gap-2">
              <Users
                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${chatUsage.isNearLimit ? "text-amber-500" : "text-blue-500"}`}
              />
              <div className="flex-1">
                <p className={`text-xs font-medium ${chatUsage.isNearLimit ? "text-amber-700" : "text-blue-700"}`}>
                  {chatUsage.usedConversations} de {chatUsage.limit} conversas este mês
                </p>
                <p className={`text-xs mt-0.5 ${chatUsage.isNearLimit ? "text-amber-600" : "text-blue-600"}`}>
                  {chatUsage.remaining > 0
                    ? `Restam ${chatUsage.remaining} conversa${chatUsage.remaining !== 1 ? "s" : ""}`
                    : "Limite atingido"}
                  {" • "}Renova em {chatUsage.renewsAtFormatted}
                </p>
                {chatUsage.isNearLimit && (
                  <AppLink href="/planos">
                    <Button size="sm" className="mt-2 h-6 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Upgrade para ilimitado
                    </Button>
                  </AppLink>
                )}
              </div>
            </div>
          </div>
        )}

        {isInstructor && !loadingUsage && chatUsage && !chatUsage.hasActivePlan && chatUsage.remaining === 0 && (
          <div className="p-3 bg-red-50 border-b border-red-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-red-700">Limite de conversas atingido</p>
                <p className="text-xs text-red-600 mt-0.5">
                  Você atingiu o limite de {chatUsage.limit} conversas com alunos neste mês.
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Para falar com mais alunos sem limite, ative um plano Via Betel PRO.
                </p>
                <AppLink href="/planos">
                  <Button size="sm" className="mt-2 h-7 text-xs bg-red-500 hover:bg-red-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Ver Planos
                  </Button>
                </AppLink>
              </div>
            </div>
          </div>
        )}

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Carregando conversas...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 text-left border-b hover:bg-emerald-50 transition ${
                  selectedConversation === conv.id ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
                }`}
              >
                <p className="font-semibold text-gray-900">Conversa</p>
                <p className="text-xs text-gray-500">{new Date(conv.created_at).toLocaleDateString("pt-BR")}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender_id === user.id ? "text-white" : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      style={
                        msg.sender_id === user.id
                          ? { background: COLORS.gradients.primary, boxShadow: SHADOWS.sm }
                          : { boxShadow: SHADOWS.sm }
                      }
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input de mensagem */}
            <div className="p-4 bg-white border-t" style={{ boxShadow: SHADOWS.lg }}>
              {canSendMessages ? (
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button
                    onClick={sendMessage}
                    className="text-white"
                    style={{ background: COLORS.gradients.primary }}
                    disabled={sending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Limite de {chatUsage?.limit || 7} conversas atingido este mês
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Renova em {chatUsage?.renewsAtFormatted}. Ou faça upgrade para conversas ilimitadas.
                    </p>
                  </div>
                  <AppLink href="/planos">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Upgrade
                    </Button>
                  </AppLink>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
