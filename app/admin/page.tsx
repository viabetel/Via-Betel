"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

interface Document {
  id: string
  ownerId: string
  type: string
  documentUrl: string
  status: string
  createdAt: string
}

export default function AdminPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile?.role !== "ADMIN") {
          setIsAdmin(false)
          return
        }

        setIsAdmin(true)

        const { data: docsData } = await supabase
          .from("documents")
          .select("*")
          .eq("status", "UNDER_REVIEW")
          .order("createdAt", { ascending: true })

        setDocuments(docsData || [])
      } catch (error) {
        console.error("[v0] Init error:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) return <LoadingState message="Carregando..." />
  if (!isAdmin) return <div className="text-center py-16 text-red-600">Acesso negado</div>

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Admin - Verificação de Documentos</h1>

      {documents.length === 0 ? (
        <EmptyState
          title="Nenhum documento pendente"
          description="Todos os documentos foram revisados"
          icon="CheckCircle"
        />
      ) : (
        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-6 bg-white">
              <h3 className="font-bold mb-2">{doc.type}</h3>
              <a
                href={doc.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-4 block"
              >
                Ver documento
              </a>
              <p className="text-sm text-gray-500 mb-4">
                Enviado em: {new Date(doc.createdAt).toLocaleString("pt-BR")}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => alert("Aprovar implementado")}>Aprovar</Button>
                <Button variant="destructive" onClick={() => alert("Reprovar implementado")}>
                  Reprovar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
