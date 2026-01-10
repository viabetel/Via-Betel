"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageSquare, LogOut, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  user_type: "student" | "instructor" | "admin"
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
  const router = useRouter()
  const supabase = createClient()

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [])

  // Subscribe to realtime messages
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
          console.log("[v0] New message received:", payload)
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation])

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

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
      console.error("[v0] Error loading conversations:", error)
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

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim(),
      })

      if (error) throw error
      setNewMessage("")

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedConversation)
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Erro ao enviar mensagem")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600">
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
          <p className="text-xs text-white/90">
            {profile?.full_name || user.email} ({profile?.user_type === "student" ? "Aluno" : "Instrutor"})
          </p>
        </div>

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
                  selectedConversation === conv.id ? "bg-emerald-100" : ""
                }`}
              >
                <p className="font-semibold text-gray-900">Conversa</p>
                <p className="text-xs text-gray-500">{new Date(conv.created_at).toLocaleDateString("pt-BR")}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages */}
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
                        msg.sender_id === user.id
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
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

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
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
