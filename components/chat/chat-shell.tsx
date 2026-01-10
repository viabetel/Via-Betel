"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatSidebar } from "./chat-sidebar"
import { ChatThread } from "./chat-thread"
import { ChatEmptyState } from "./chat-empty-state"
import { useAuth } from "@/lib/auth-context"
import { chatStore, type Thread } from "@/lib/chat/chat-store"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatShell() {
  const { user, profile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "archived" | "support">("all")
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const loadedThreads = chatStore.getThreads(user.id)
    setThreads(loadedThreads)
    setLoading(false)

    // Se há threadId na URL, selecionar
    const urlThreadId = searchParams?.get("thread")
    if (urlThreadId) {
      setSelectedThreadId(urlThreadId)
    }
  }, [user, searchParams])

  const filteredThreads = threads.filter((thread) => {
    // Filtro de tipo
    if (filter === "unread" && thread.unreadCount === 0) return false
    if (filter === "archived" && !thread.archived) return false
    if (filter === "support" && thread.otherUserRole !== "SUPPORT") return false

    // Busca por nome ou última mensagem
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return thread.otherUserName.toLowerCase().includes(query) || thread.lastMessage.toLowerCase().includes(query)
    }

    return true
  })

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  })

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
    if (user) {
      chatStore.markAsRead(threadId, user.id)
      // Atualizar threads para refletir unreadCount zerado
      setThreads(chatStore.getThreads(user.id))
    }
    // Atualizar URL
    router.push(`/chat?thread=${threadId}`, { scroll: false })
  }

  const handleBack = () => {
    setSelectedThreadId(null)
    router.push("/chat", { scroll: false })
  }

  const handleThreadUpdate = () => {
    if (user) {
      setThreads(chatStore.getThreads(user.id))
    }
  }

  // Mobile: mostrar apenas sidebar OU thread
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <AnimatePresence mode="wait">
          {selectedThreadId ? (
            <motion.div
              key="thread"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-white">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="font-semibold text-gray-900">Voltar</span>
              </div>
              <ChatThread threadId={selectedThreadId} userId={user?.id || ""} userName={profile?.full_name || "Você"} />
            </motion.div>
          ) : (
            <motion.div key="sidebar" initial={{ x: 0 }} animate={{ x: 0 }} className="flex-1 flex flex-col">
              <ChatSidebar
                threads={sortedThreads}
                selectedThreadId={selectedThreadId}
                onSelectThread={handleSelectThread}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                loading={loading}
                onThreadUpdate={handleThreadUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Desktop: 2 colunas
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar esquerda */}
      <div className="w-80 lg:w-96 border-r bg-white flex-shrink-0">
        <ChatSidebar
          threads={sortedThreads}
          selectedThreadId={selectedThreadId}
          onSelectThread={handleSelectThread}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          loading={loading}
          onThreadUpdate={handleThreadUpdate}
        />
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex flex-col">
        {selectedThreadId ? (
          <ChatThread threadId={selectedThreadId} userId={user?.id || ""} userName={profile?.full_name || "Você"} />
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  )
}
