"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Instructor {
  id: string
  name: string
  city: string
  categories: string
  rating: number
  price: number
}

export default function MarketplacePage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: "", category: "" })

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        let query = supabase.from("profiles").select("*").eq("role", "INSTRUCTOR")

        if (filters.city) query = query.ilike("city", `%${filters.city}%`)

        const { data, error } = await query

        if (error) throw error
        setInstructors(data || [])
      } catch (error) {
        console.error("[v0] Load instructors error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInstructors()
  }, [filters])

  if (loading) return <LoadingState message="Carregando instrutores..." />

  return (
    <div className="container-custom py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Marketplace de Instrutores</h1>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por cidade..."
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-2 border rounded-lg flex-1"
          />
          <Link href="/solicitacoes/nova">
            <Button>Criar Solicitação</Button>
          </Link>
        </div>
      </div>

      {instructors.length === 0 ? (
        <EmptyState
          title="Nenhum instrutor encontrado"
          description="Tente ajustar seus filtros de busca"
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-bold">{instructor.name}</h2>
              <p className="text-gray-600">{instructor.city}</p>
              <p className="text-sm text-gray-500">Categorias: {instructor.categories}</p>
              <p className="text-lg font-bold text-green-600 mt-2">R$ {(instructor.price / 100).toFixed(2)}/hora</p>
              <Button className="w-full mt-4">Solicitar Aula</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
