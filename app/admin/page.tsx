"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Document {
  id: string
  profileId: string
  documentType: string
  storagePath: string
  status: string
  createdAt: string
  profile: { email: string; fullName?: string }
}

export default function AdminPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [rejectingDoc, setRejectingDoc] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const [approvingDoc, setApprovingDoc] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profile } = await supabase.from("profiles").select("role").eq("userId", user.id).single()

        if (profile?.role !== "ADMIN") {
          setIsAdmin(false)
          return
        }

        setIsAdmin(true)

        // Fetch pending documents
        const res = await fetch("/api/admin/documents")
        const docsData = await res.json()
        setDocuments(docsData || [])
      } catch (error) {
        console.error("Init error:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleApprove = async (docId: string) => {
    setApprovingDoc(docId)
    try {
      const res = await fetch(`/api/admin/documents/${docId}/approve`, {
        method: "POST",
      })

      if (res.ok) {
        setDocuments(documents.filter((d) => d.id !== docId))
      }
    } catch (error) {
      console.error("Approve error:", error)
    } finally {
      setApprovingDoc(null)
    }
  }

  const handleReject = async (docId: string) => {
    if (!rejectReason[docId]) {
      alert("Digite um motivo para a rejeição")
      return
    }

    setRejectingDoc(docId)
    try {
      const res = await fetch(`/api/admin/documents/${docId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason[docId] }),
      })

      if (res.ok) {
        setDocuments(documents.filter((d) => d.id !== docId))
        setRejectReason({ ...rejectReason, [docId]: "" })
      }
    } catch (error) {
      console.error("Reject error:", error)
    } finally {
      setRejectingDoc(null)
    }
  }

  if (loading) return <LoadingState message="Carregando..." />
  if (!isAdmin)
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-red-600 font-semibold">Acesso negado</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">
          Admin - Verificação de Documentos
        </motion.h1>
        <p className="text-gray-600 mb-8">
          Total pendente: <span className="font-bold">{documents.length}</span>
        </p>

        {documents.length === 0 ? (
          <EmptyState
            title="Nenhum documento pendente"
            description="Todos os documentos foram revisados"
            icon="CheckCircle2"
          />
        ) : (
          <div className="space-y-6">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg">{doc.documentType}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Usuário: <span className="font-semibold">{doc.profile.fullName || doc.profile.email}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Enviado em: {new Date(doc.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Caminho do arquivo: <code className="text-xs bg-white px-2 py-1 rounded">{doc.storagePath}</code>
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Motivo da rejeição (se aplicável)</label>
                    <Textarea
                      value={rejectReason[doc.id] || ""}
                      onChange={(e) => setRejectReason({ ...rejectReason, [doc.id]: e.target.value })}
                      placeholder="Digite o motivo da rejeição..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(doc.id)}
                      disabled={approvingDoc === doc.id}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      {approvingDoc === doc.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Aprovando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aprovar
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(doc.id)}
                      disabled={rejectingDoc === doc.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejectingDoc === doc.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Rejeitando...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
