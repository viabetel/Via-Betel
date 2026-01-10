"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, MessageSquare } from "lucide-react"
import { ChatThreadItem } from "./chat-thread-item"
import type { Thread } from "@/lib/chat/chat-store"
import { AppLink } from "@/components/app-link"

interface ChatSidebarProps {
  threads: Thread[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filter: "all" | "unread" | "archived" | "support"
  onFilterChange: (filter: "all" | "unread" | "archived" | "support") => void
  loading: boolean
  onThreadUpdate: () => void
}

export function ChatSidebar({
  threads,
  selectedThreadId,
  onSelectThread,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  loading,
  onThreadUpdate,
}: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Mensagens</h2>
          <AppLink href="/instrutores">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova</span>
            </Button>
          </AppLink>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar conversas..."
            className="pl-10 bg-white/95 border-white/20 text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 p-3 border-b bg-gray-50 overflow-x-auto">
        {[
          { key: "all", label: "Todas" },
          { key: "unread", label: "Não lidas" },
          { key: "archived", label: "Arquivadas" },
          { key: "support", label: "Suporte" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key as any)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === f.key
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de threads */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Carregando conversas...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-600 mb-4">
              {filter === "all" ? "Nenhuma conversa ainda" : "Nenhuma conversa nesta categoria"}
            </p>
            {filter === "all" && (
              <div className="space-y-2">
                <AppLink href="/instrutores">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Encontrar instrutores
                  </Button>
                </AppLink>
                <AppLink href="/suporte">
                  <Button variant="ghost" size="sm" className="w-full">
                    Falar com suporte
                  </Button>
                </AppLink>
              </div>
            )}
          </div>
        ) : (
          <div>
            {threads.map((thread) => (
              <ChatThreadItem
                key={thread.id}
                thread={thread}
                selected={selectedThreadId === thread.id}
                onClick={() => onSelectThread(thread.id)}
                onUpdate={onThreadUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
