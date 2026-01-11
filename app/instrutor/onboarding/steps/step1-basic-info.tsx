"use client"

import type React from "react"

import { useState } from "react"
import type { InstructorProfile } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronRight } from "lucide-react"

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

const CATEGORIAS = ["A", "B", "C", "D", "E"]
const ANOS_EXP = [
  { value: 0, label: "Menos de 1 ano" },
  { value: 1, label: "1 a 3 anos" },
  { value: 3, label: "3 a 5 anos" },
  { value: 5, label: "5 a 10 anos" },
  { value: 10, label: "Mais de 10 anos" },
]

interface Step1Props {
  profile: InstructorProfile | null
  onContinue: (profile: InstructorProfile) => void
}

export default function Step1BasicInfo({ profile, onContinue }: Step1Props) {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    state: profile?.state || "",
    categories: profile?.categories?.split(",") || [],
    yearsExp: profile?.yearsExp || 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!formData.fullName.trim()) throw new Error("Nome completo é obrigatório")
      if (!formData.phone.trim()) throw new Error("Telefone é obrigatório")
      if (!formData.city.trim()) throw new Error("Cidade é obrigatória")
      if (!formData.state) throw new Error("Estado é obrigatório")
      if (formData.categories.length === 0) throw new Error("Selecione pelo menos uma categoria")

      const response = await fetch("/api/instructor-profile/update-basics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          categories: formData.categories.join(","),
          yearsExp: formData.yearsExp,
        }),
      })

      if (!response.ok) throw new Error("Erro ao salvar dados")

      const updatedProfile = await response.json()
      onContinue(updatedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
        <CardTitle>Dados Básicos</CardTitle>
        <CardDescription>Preencha suas informações principais para começar o cadastro como instrutor</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-emerald-900 font-semibold">
              Nome Completo *
            </Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="João da Silva"
              className="mt-1 border-emerald-200"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-emerald-900 font-semibold">
              Telefone / WhatsApp *
            </Label>
            <Input
              id="phone"
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="(32) 99999-9999"
              className="mt-1 border-emerald-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-emerald-900 font-semibold">
                Cidade *
              </Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Juiz de Fora"
                className="mt-1 border-emerald-200"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-emerald-900 font-semibold">
                Estado *
              </Label>
              <select
                id="state"
                required
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-emerald-900 font-semibold block mb-2">Categorias que Ensina *</Label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`py-2 rounded-md font-bold transition-all border-2 ${
                    formData.categories.includes(cat)
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                      : "bg-white text-emerald-900 border-emerald-300 hover:border-emerald-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="yearsExp" className="text-emerald-900 font-semibold">
              Anos de Experiência *
            </Label>
            <select
              id="yearsExp"
              value={formData.yearsExp}
              onChange={(e) => setFormData((prev) => ({ ...prev, yearsExp: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              {ANOS_EXP.map((exp) => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Continuar para Verificação
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
