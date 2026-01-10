"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatComposer } from "./chat-composer"
import { ChatProfileDrawer } from "./chat-profile-drawer"
import { Button } from "@/components/ui/button"
import { MoreVertical, User, Archive, Pin, BellOff, Flag, Ban, AlertCircle } from "lucide-react"
import { chatStore, type Thread, type Message } from "@/lib/chat/chat-store"
import { format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"
import { BadgeChip } from "@/components/ui/badge-chip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatThreadProps {
  threadId: string
  userId: string
  userName: string
}

export function ChatThread({ threadId, userId, userName }: ChatThreadProps) {
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showProfileDrawer, setShowProfileDrawer] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadedThread = chatStore.getThread(threadId)
    const loadedMessages = chatStore.getMessages(threadId, userId)

    setThread(loadedThread)
    setMessages(loadedMessages)

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [threadId, userId])

  const handleSendMessage = (content: string) => {
    const newMessage = chatStore.sendMessage(threadId, userId, userName, content)
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage])
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleToggleArchive = () => {
    if (thread) {
      chatStore.updateThread(threadId, { archived: !thread.archived })
      setThread({ ...thread, archived: !thread.archived })
    }
  }

  const handleTogglePin = () => {
    if (thread) {
      chatStore.updateThread(threadId, { pinned: !thread.pinned })
      setThread({ ...thread, pinned: !thread.pinned })
    }
  }

  const handleToggleMute = () => {
    if (thread) {
      chatStore.updateThread(threadId, { muted: !thread.muted })
      setThread({ ...thread, muted: !thread.muted })
    }
  }

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Carregando conversa...</p>
      </div>
    )
  }

  // Agrupar mensagens por dia
  const groupedMessages: { date: Date; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup && isSameDay(lastGroup.date, msg.createdAt)) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date: msg.createdAt, messages: [msg] })
    }
  })

  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        {/* Header da conversa */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b bg-white"
          style={{ boxShadow: SHADOWS.sm }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <button
              onClick={() => setShowProfileDrawer(true)}
              className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 hover:ring-2 hover:ring-emerald-500 transition"
            >
              {thread.otherUserAvatar ? (
                <img
                  src={thread.otherUserAvatar || "/placeholder.svg"}
                  alt={thread.otherUserName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {thread.otherUserName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {/* Nome e badge */}
            <div>
              <h3 className="font-semibold text-gray-900">{thread.otherUserName}</h3>
              <BadgeChip variant={thread.otherUserRole === "INSTRUCTOR" ? "primary" : "success"} size="sm">
                {thread.otherUserRole === "INSTRUCTOR"
                  ? "Instrutor"
                  : thread.otherUserRole === "SUPPORT"
                    ? "Suporte"
                    : "Aluno"}
              </BadgeChip>
            </div>
          </div>

          {/* Ações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowProfileDrawer(true)}>
                <User className="w-4 h-4 mr-2" />
                Ver perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePin}>
                <Pin className="w-4 h-4 mr-2" />
                {thread.pinned ? "Desafixar" : "Fixar"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleMute}>
                <BellOff className="w-4 h-4 mr-2" />
                {thread.muted ? "Ativar notificações" : "Silenciar"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                {thread.archived ? "Desarquivar" : "Arquivar"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Flag className="w-4 h-4 mr-2" />
                Reportar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Ban className="w-4 h-4 mr-2" />
                Bloquear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <AnimatePresence>
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                {/* Separador de data */}
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                    {format(group.date, "d 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>

                {/* Mensagens do dia */}
                {group.messages.map((msg, msgIndex) => {
                  const isOwn = msg.senderId === userId
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: msgIndex * 0.05 }}
                      className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md lg:max-w-lg ${isOwn ? "order-2" : "order-1"}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            isOwn
                              ? "text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                          }`}
                          style={
                            isOwn
                              ? { background: COLORS.gradients.primary, boxShadow: SHADOWS.sm }
                              : { boxShadow: SHADOWS.sm }
                          }
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${isOwn ? "text-white/80" : "text-gray-500"}`}>
                              {format(msg.createdAt, "HH:mm")}
                            </span>
                            {isOwn && <span className="text-xs text-white/80">✓</span>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Aviso de segurança */}
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Não compartilhe dados sensíveis. Conteúdo monitorado para sua segurança.
          </p>
        </div>

        {/* Composer */}
        <ChatComposer onSendMessage={handleSendMessage} />
      </div>

      {/* Profile Drawer */}
      <ChatProfileDrawer open={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} thread={thread} />
    </>
  )
}
