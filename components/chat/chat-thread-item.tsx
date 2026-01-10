"use client"

import { Avatar } from "@/components/ui/avatar"
import { BadgeChip } from "@/components/ui/badge-chip"
import { Pin, Archive, BellOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Thread } from "@/lib/chat/chat-store"

interface ChatThreadItemProps {
  thread: Thread
  selected: boolean
  onClick: () => void
  onUpdate: () => void
}

export function ChatThreadItem({ thread, selected, onClick }: ChatThreadItemProps) {
  const timeAgo = formatDistanceToNow(thread.lastMessageAt, { addSuffix: true, locale: ptBR })

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b hover:bg-gray-50 transition text-left relative ${
        selected ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {thread.otherUserAvatar ? (
            <img
              src={thread.otherUserAvatar || "/placeholder.svg"}
              alt={thread.otherUserName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              {thread.otherUserName.charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate">{thread.otherUserName}</span>
              <BadgeChip variant={thread.otherUserRole === "INSTRUCTOR" ? "primary" : "success"} size="sm">
                {thread.otherUserRole === "INSTRUCTOR"
                  ? "Instrutor"
                  : thread.otherUserRole === "SUPPORT"
                    ? "Suporte"
                    : "Aluno"}
              </BadgeChip>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo}</span>
          </div>

          <p className="text-sm text-gray-600 truncate mb-1">{thread.lastMessage}</p>

          {/* Badges */}
          <div className="flex items-center gap-2">
            {thread.unreadCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {thread.unreadCount}
              </span>
            )}
            {thread.pinned && <Pin className="w-3.5 h-3.5 text-amber-600" />}
            {thread.archived && <Archive className="w-3.5 h-3.5 text-gray-400" />}
            {thread.muted && <BellOff className="w-3.5 h-3.5 text-gray-400" />}
          </div>
        </div>
      </div>
    </button>
  )
}
