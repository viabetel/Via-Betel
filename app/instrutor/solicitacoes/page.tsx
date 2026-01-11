"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import Link from "next/link"

interface Request {
  id: string
  title: string
  status: string
  category: string
  city: string
  budget?: number
  createdAt: string
}

export default function InstructorRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("NEW")

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: profile } = await supabase
          .from("profiles")
          .select("verificationStatus")
          .eq("id", user.id)
          .single()

        // Only verified instructors can see requests
        if (profile?.verificationStatus !== "VERIFIED") {
          setRequests([])
          return
        }

        const query = supabase
          .from("requests")
          .select("*")
          .eq("status", filter)
          .order("createdAt", { ascending: false })

        const { data, error } = await query

        if (error) throw error
        setRequests(data || [])
      } catch (error) {
        console.error("[v0] Load requests error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [filter])

  if (loading) return <LoadingState message="Carregando solicitações..." />

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Solicitações Disponíveis</h1>

      <div className="flex gap-2 mb-6">
        {["NEW", "VIEWED", "RESPONDED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium ${filter === status ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="Nenhuma solicitação disponível"
          description="Verifique sua verificação de instrutor"
          icon="Search"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Link key={request.id} href={`/solicitacoes/${request.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{request.title}</h2>
                    <p className="text-gray-600">
                      {request.city} - Categoria {request.category}
                    </p>
                    {request.budget && (
                      <p className="text-green-600 font-bold">R$ {(request.budget / 100).toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
