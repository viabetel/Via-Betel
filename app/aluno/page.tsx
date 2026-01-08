"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type FormData = {
  nome: string
  whatsapp: string
  cidade: string
  uf: string
  categoria: string
  objetivo: string
  horario: string
}

export default function AlunoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    categoria: "",
    objetivo: "",
    horario: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "aluno",
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar dados")

      setIsSuccess(true)

      const whatsappMessage = encodeURIComponent(
        `Olá! Vim do Instagram da Via Betel. Quero aulas de direção.

Meus dados:
Nome: ${formData.nome}
Cidade: ${formData.cidade}/${formData.uf}
Categoria: ${formData.categoria}
Objetivo: ${formData.objetivo}
Melhor horário: ${formData.horario}
WhatsApp: ${formData.whatsapp}`,
      )

      setTimeout(() => {
        window.open(`https://wa.me/5532988093506?text=${whatsappMessage}`, "_blank")
      }, 800)
    } catch (err) {
      setError("Ocorreu um erro. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recebido com sucesso!</h2>
          <p className="text-gray-600 mb-6">Abrindo WhatsApp para conversarmos...</p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Voltar ao início</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/" className="inline-flex items-center text-emerald-700 hover:text-emerald-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <Image
              src="/images/viabetel-logo.png"
              alt="Via Betel"
              width={180}
              height={54}
              className="h-10 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vamos começar sua jornada!</h1>
            <p className="text-gray-600">Preencha os dados abaixo para falarmos no WhatsApp</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="(32) 98888-8888"
                maxLength={15}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Sua cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UF <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.uf}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="MG"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria desejada <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="A">Categoria A (Moto)</option>
                <option value="B">Categoria B (Carro)</option>
                <option value="AB">Categoria AB (Carro e Moto)</option>
                <option value="C">Categoria C (Caminhão)</option>
                <option value="D">Categoria D (Ônibus)</option>
                <option value="E">Categoria E (Carreta)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seu objetivo <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="primeira-habilitacao">Primeira habilitação</option>
                <option value="reabilitacao">Reabilitação</option>
                <option value="medo-dirigir">Medo de dirigir</option>
                <option value="aperfeicoamento">Aperfeiçoamento</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Melhor horário <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="manha">Manhã (8h - 12h)</option>
                <option value="tarde">Tarde (13h - 18h)</option>
                <option value="noite">Noite (18h - 21h)</option>
                <option value="flexivel">Horário flexível</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg min-h-[56px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar e falar no WhatsApp"
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Ao enviar, você concorda com nossa Política de Privacidade
          </p>
        </motion.div>
      </div>
    </div>
  )
}
