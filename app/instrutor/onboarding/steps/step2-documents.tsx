"use client"

import type React from "react"

import { useState } from "react"
import type { InstructorProfile } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"

interface Step2Props {
  profile: InstructorProfile
  onBack: () => void
  onSubmit: (profile: InstructorProfile) => void
}

export default function Step2Documents({ profile, onBack, onSubmit }: Step2Props) {
  const [formData, setFormData] = useState({
    isLinkedToAutoescola: profile.isLinkedToAutoescola,
    autoescolaName: profile.autoescolaName || "",
    autoescolaCnpj: profile.autoescolaCnpj || "",
    cnhUrl: profile.cnhUrl || "",
    certificadoUrl: profile.certificadoUrl || "",
    vinculoUrl: profile.vinculoUrl || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!formData.cnhUrl.trim()) throw new Error("URL da CNH é obrigatória")
      if (!formData.certificadoUrl.trim()) throw new Error("URL do Certificado é obrigatória")
      if (formData.isLinkedToAutoescola && !formData.autoescolaName.trim())
        throw new Error("Nome da autoescola é obrigatório")

      const response = await fetch("/api/instructor-profile/submit-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnhUrl: formData.cnhUrl,
          certificadoUrl: formData.certificadoUrl,
          vinculoUrl: formData.vinculoUrl,
          isLinkedToAutoescola: formData.isLinkedToAutoescola,
          autoescolaName: formData.autoescolaName || null,
          autoescolaCnpj: formData.autoescolaCnpj || null,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar documentos")

      const updatedProfile = await response.json()
      onSubmit(updatedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <CardTitle>Verificação Profissional</CardTitle>
        <CardDescription>Envie seus documentos para que nossa equipe valide seu cadastro</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-amber-900 font-semibold block mb-3">Tipo de Instrutor</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: false, label: "Autônomo" },
                { value: true, label: "Vinculado a Autoescola" },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isLinkedToAutoescola: option.value }))}
                  className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                    formData.isLinkedToAutoescola === option.value
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600"
                      : "bg-white text-emerald-900 border-amber-300 hover:border-emerald-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {formData.isLinkedToAutoescola && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <Label htmlFor="autoescolaName" className="text-amber-900 font-semibold">
                  Nome da Autoescola *
                </Label>
                <Input
                  id="autoescolaName"
                  value={formData.autoescolaName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, autoescolaName: e.target.value }))}
                  placeholder="Autoescola Exemplo"
                  className="mt-1 border-amber-200"
                />
              </div>
              <div>
                <Label htmlFor="autoescolaCnpj" className="text-amber-900 font-semibold">
                  CNPJ da Autoescola
                </Label>
                <Input
                  id="autoescolaCnpj"
                  value={formData.autoescolaCnpj}
                  onChange={(e) => setFormData((prev) => ({ ...prev, autoescolaCnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                  className="mt-1 border-amber-200"
                />
              </div>
            </div>
          )}

          <div className="space-y-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              Documentos Necessários
            </h3>

            <div>
              <Label htmlFor="cnhUrl" className="text-teal-900 font-semibold">
                CNH (URL) *
              </Label>
              <Input
                id="cnhUrl"
                required
                type="url"
                value={formData.cnhUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, cnhUrl: e.target.value }))}
                placeholder="https://..."
                className="mt-1 border-teal-200"
              />
              <p className="text-xs text-teal-700 mt-1">Cole a URL da imagem ou PDF da sua CNH</p>
            </div>

            <div>
              <Label htmlFor="certificadoUrl" className="text-teal-900 font-semibold">
                Certificado de Instrutor / SENATRAN (URL) *
              </Label>
              <Input
                id="certificadoUrl"
                required
                type="url"
                value={formData.certificadoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, certificadoUrl: e.target.value }))}
                placeholder="https://..."
                className="mt-1 border-teal-200"
              />
              <p className="text-xs text-teal-700 mt-1">Cole a URL do seu certificado</p>
            </div>

            {formData.isLinkedToAutoescola && (
              <div>
                <Label htmlFor="vinculoUrl" className="text-teal-900 font-semibold">
                  Vínculo com Autoescola (URL)
                </Label>
                <Input
                  id="vinculoUrl"
                  type="url"
                  value={formData.vinculoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, vinculoUrl: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1 border-teal-200"
                />
                <p className="text-xs text-teal-700 mt-1">Cole a URL do contrato ou declaração de vínculo</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar para Análise"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
