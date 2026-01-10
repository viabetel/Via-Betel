"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip } from "lucide-react"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"

interface ChatComposerProps {
  onSendMessage: (content: string) => void
}

export function ChatComposer({ onSendMessage }: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Templates rápidos
  const templates = ["Tenho interesse!", "Qual cidade?", "Disponibilidade?", "Valores?"]

  const handleSend = () => {
    if (!message.trim()) return
    onSendMessage(message.trim())
    setMessage("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTemplateClick = (template: string) => {
    setMessage(template)
    textareaRef.current?.focus()
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="p-4 bg-white border-t" style={{ boxShadow: SHADOWS.lg }}>
      {/* Templates rápidos */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {templates.map((template) => (
          <button
            key={template}
            onClick={() => handleTemplateClick(template)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 transition whitespace-nowrap"
          >
            {template}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end">
        <Button variant="ghost" size="sm" className="flex-shrink-0" disabled>
          <Paperclip className="w-5 h-5 text-gray-400" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para quebrar linha)"
          className="flex-1 min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex-shrink-0 text-white"
          style={{ background: COLORS.gradients.primary }}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
