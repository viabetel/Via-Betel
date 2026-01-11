"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { z } from "zod"

const CreateRequestSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  category: z.enum(["A", "B", "C", "D", "E"]),
  city: z.string().min(3),
  budget: z.number().int().positive().optional(),
})

export default function NovasolicitacaoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "B" as const,
    city: "",
    budget: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = CreateRequestSchema.parse({
        ...formData,
        budget: formData.budget ? Number.parseInt(formData.budget) : undefined,
      })

      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create request")

      const { requestId } = await res.json()
      router.push(`/solicitacoes/${requestId}`)
    } catch (error) {
      console.error("[v0] Create request error:", error)
      alert("Erro ao criar solicitação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Criar Nova Solicitação</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            placeholder="Ex: Aulas de direção para CNH"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            placeholder="Descreva o que você procura..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Categoria CNH</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>A - Moto</option>
              <option>B - Carro</option>
              <option>C - Caminhão</option>
              <option>D - Ônibus</option>
              <option>E - Carreta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cidade</label>
            <input
              type="text"
              placeholder="Ex: Juiz de Fora"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Orçamento (Opcional)</label>
          <input
            type="number"
            placeholder="Ex: 100.00"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Criando..." : "Criar Solicitação"}
        </Button>
      </form>
    </div>
  )
}
