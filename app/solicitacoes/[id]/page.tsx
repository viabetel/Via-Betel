"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { supabase } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { Button } from "@/components/ui/button"

interface Request {
  id: string
  title: string
  description: string
  status: string
  category: string
  city: string
  budget?: number
  studentId: string
  instructorId?: string
  createdAt: string
}

interface RequestEvent {
  id: string
  type: string
  createdAt: string
  data?: any
}

interface Message {
  id: string
  senderId: string
  content: string
  type: string
  fileUrl?: string
  createdAt: string
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<Request | null>(null)
  const [events, setEvents] = useState<RequestEvent[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return
        setUserId(user.id)

        // Load request
        const { data: requestData, error: requestError } = await supabase
          .from("requests")
          .select("*")
          .eq("id", params.id)
          .single()

        if (requestError) throw requestError
        setRequest(requestData)

        // Load events
        const { data: eventsData, error: eventsError } = await supabase
          .from("request_events")
          .select("*")
          .eq("requestId", params.id)
          .order("createdAt", { ascending: true })

        if (eventsError) throw eventsError
        setEvents(eventsData || [])

        // Load conversation if exists
        const { data: convData } = await supabase.from("conversations").select("id").eq("requestId", params.id).single()

        if (convData) {
          setConversationId(convData.id)

          // Load messages
          const { data: messagesData, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("conversationId", convData.id)
            .order("createdAt", { ascending: true })

          if (messagesError) throw messagesError
          setMessages(messagesData || [])

          // Subscribe to realtime messages
          const subscription = supabase
            .channel(`messages:${convData.id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
              setMessages((prev) => [...prev, payload.new])
            })
            .subscribe()

          return () => {
            subscription.unsubscribe()
          }
        }
      } catch (error) {
        console.error("[v0] Init error:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [params.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !conversationId) return

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageInput }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      setMessageInput("")
    } catch (error) {
      console.error("[v0] Send message error:", error)
      alert("Erro ao enviar mensagem")
    }
  }

  if (loading) return <LoadingState message="Carregando solicitação..." />
  if (!request) return <div className="text-center py-16">Solicitação não encontrada</div>

  const canRespond = !request.instructorId && request.status === "NEW"
  const canAgree = request.status === "RESPONDED" && request.studentId === userId
  const canComplete = ["AGREED"].includes(request.status)

  return (
    <div className="container-custom py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border mb-6">
            <h1 className="text-4xl font-bold mb-4">{request.title}</h1>
            <p className="text-gray-600 mb-4">{request.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Categoria</p>
                <p className="font-bold">{request.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade</p>
                <p className="font-bold">{request.city}</p>
              </div>
              {request.budget && (
                <div>
                  <p className="text-sm text-gray-500">Orçamento</p>
                  <p className="font-bold text-green-600">R$ {(request.budget / 100).toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-bold text-blue-600">{request.status}</p>
              </div>
            </div>

            {canRespond && <Button className="w-full">Oferecer Proposta</Button>}
            {canAgree && (
              <Button className="w-full bg-transparent" variant="outline">
                Concordar
              </Button>
            )}
            {canComplete && (
              <Button className="w-full bg-transparent" variant="outline">
                Marcar como Completo
              </Button>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-6 border mb-6">
            <h2 className="text-2xl font-bold mb-6">Timeline</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="font-bold">{event.type}</p>
                    <p className="text-sm text-gray-500">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        {conversationId && (
          <div className="border rounded-lg flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${msg.senderId === userId ? "bg-green-100 ml-auto" : "bg-gray-100"} max-w-xs`}
                >
                  {msg.type === "TEXT" ? (
                    <p>{msg.content}</p>
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {msg.content}
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString("pt-BR")}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Enviar mensagem..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button type="submit" size="sm">
                Enviar
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
