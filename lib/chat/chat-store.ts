// Chat store com fallback localStorage quando Supabase não tem tabelas
// Implementa degradação elegante sem quebrar a UI

import { instructors } from "@/data/instructors-data"

export interface Thread {
  id: string
  title: string
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string | null
  otherUserRole: "STUDENT" | "INSTRUCTOR" | "SUPPORT"
  lastMessage: string
  lastMessageAt: Date
  unreadCount: number
  archived: boolean
  pinned: boolean
  muted: boolean
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  senderName: string
  content: string
  createdAt: Date
  read: boolean
}

const THREADS_KEY = "viabetel_chat_threads"
const MESSAGES_KEY = "viabetel_chat_messages"

const createMockThreads = (userId: string): Thread[] => {
  const mockInstructor1 = instructors[0]
  const mockInstructor2 = instructors[1]

  return [
    {
      id: "thread-1",
      title: `Conversa com ${mockInstructor1.name}`,
      otherUserId: "instructor-1",
      otherUserName: mockInstructor1.name,
      otherUserAvatar: mockInstructor1.photo,
      otherUserRole: "INSTRUCTOR",
      lastMessage: "Olá! Tenho disponibilidade para aulas essa semana.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
      unreadCount: 2,
      archived: false,
      pinned: true,
      muted: false,
    },
    {
      id: "thread-2",
      title: `Conversa com ${mockInstructor2.name}`,
      otherUserId: "instructor-2",
      otherUserName: mockInstructor2.name,
      otherUserAvatar: mockInstructor2.photo,
      otherUserRole: "INSTRUCTOR",
      lastMessage: "Qual a sua disponibilidade de horários?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
      unreadCount: 0,
      archived: false,
      pinned: false,
      muted: false,
    },
  ]
}

const createMockMessages = (threadId: string, userId: string): Message[] => {
  if (threadId === "thread-1") {
    return [
      {
        id: "msg-1",
        threadId,
        senderId: userId,
        senderName: "Você",
        content: "Olá! Vi seu perfil e gostaria de agendar aulas.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
        read: true,
      },
      {
        id: "msg-2",
        threadId,
        senderId: "instructor-1",
        senderName: instructors[0].name,
        content: "Oi! Ficaria feliz em ajudar. Qual categoria você está buscando?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
        read: true,
      },
      {
        id: "msg-3",
        threadId,
        senderId: userId,
        senderName: "Você",
        content: "Categoria B. Preciso de aulas no período da tarde.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        read: true,
      },
      {
        id: "msg-4",
        threadId,
        senderId: "instructor-1",
        senderName: instructors[0].name,
        content: "Olá! Tenho disponibilidade para aulas essa semana.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ]
  }

  if (threadId === "thread-2") {
    return [
      {
        id: "msg-5",
        threadId,
        senderId: "instructor-2",
        senderName: instructors[1].name,
        content: "Olá! Vi seu interesse em aulas de moto. Podemos conversar?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
      },
      {
        id: "msg-6",
        threadId,
        senderId: userId,
        senderName: "Você",
        content: "Sim! Qual a sua disponibilidade de horários?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
    ]
  }

  return []
}

export const chatStore = {
  // Threads
  getThreads: (userId: string): Thread[] => {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(THREADS_KEY)
    if (!stored) {
      // Primeira vez: criar mock
      const mock = createMockThreads(userId)
      localStorage.setItem(THREADS_KEY, JSON.stringify(mock))
      return mock
    }

    const threads = JSON.parse(stored) as Thread[]
    return threads.map((t) => ({
      ...t,
      lastMessageAt: new Date(t.lastMessageAt),
    }))
  },

  getThread: (threadId: string): Thread | null => {
    if (typeof window === "undefined") return null

    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || "[]") as Thread[]
    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return null

    return {
      ...thread,
      lastMessageAt: new Date(thread.lastMessageAt),
    }
  },

  updateThread: (threadId: string, updates: Partial<Thread>) => {
    if (typeof window === "undefined") return

    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || "[]") as Thread[]
    const index = threads.findIndex((t) => t.id === threadId)
    if (index === -1) return

    threads[index] = { ...threads[index], ...updates }
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
  },

  // Messages
  getMessages: (threadId: string, userId: string): Message[] => {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(MESSAGES_KEY)
    if (!stored) {
      // Primeira vez: criar mock
      const mock = createMockMessages(threadId, userId)
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(mock))
      return mock
    }

    const allMessages = JSON.parse(stored) as Message[]
    return allMessages
      .filter((m) => m.threadId === threadId)
      .map((m) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }))
  },

  sendMessage: (threadId: string, senderId: string, senderName: string, content: string) => {
    if (typeof window === "undefined") return

    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]") as Message[]
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId,
      senderName,
      content,
      createdAt: new Date(),
      read: true,
    }

    allMessages.push(newMessage)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages))

    // Atualizar thread
    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || "[]") as Thread[]
    const threadIndex = threads.findIndex((t) => t.id === threadId)
    if (threadIndex !== -1) {
      threads[threadIndex].lastMessage = content
      threads[threadIndex].lastMessageAt = new Date()
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
    }

    return newMessage
  },

  markAsRead: (threadId: string, userId: string) => {
    if (typeof window === "undefined") return

    // Marcar mensagens como lidas
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]") as Message[]
    const updated = allMessages.map((m) => {
      if (m.threadId === threadId && m.senderId !== userId) {
        return { ...m, read: true }
      }
      return m
    })
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated))

    // Zerar unreadCount
    chatStore.updateThread(threadId, { unreadCount: 0 })
  },

  getTotalUnread: (userId: string): number => {
    const threads = chatStore.getThreads(userId)
    return threads.reduce((acc, t) => acc + t.unreadCount, 0)
  },
}
