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
  categorias: string[]
  experiencia: string
  disponibilidade: string
  veiculo: string
}

export default function InstrutorPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    categorias: [],
    experiencia: "",
    disponibilidade: "",
    veiculo: "",
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

  const handleCategoriaToggle = (categoria: string) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (formData.categorias.length === 0) {
      setError("Selecione pelo menos uma categoria")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "instrutor",
          ...formData,
          categorias: formData.categorias.join(", "),
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar dados")

      setIsSuccess(true)

      const whatsappMessage = encodeURIComponent(
        `Olá! Sou instrutor e vim do Instagram da Via Betel. Quero me cadastrar na plataforma.

Meus dados:
Nome: ${formData.nome}
Cidade: ${formData.cidade}/${formData.uf}
Categorias que ensino: ${formData.categorias.join(", ")}
Experiência: ${formData.experiencia}
Disponibilidade: ${formData.disponibilidade}
Veículo próprio: ${formData.veiculo}
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
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seja um instrutor da Via Betel!</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias que ensina <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["A", "B", "C", "D", "E"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoriaToggle(cat)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.categorias.includes(cat)
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
                    }`}
                  >
                    Categoria {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anos de experiência <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="menos-1-ano">Menos de 1 ano</option>
                <option value="1-3-anos">1 a 3 anos</option>
                <option value="3-5-anos">3 a 5 anos</option>
                <option value="5-10-anos">5 a 10 anos</option>
                <option value="mais-10-anos">Mais de 10 anos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilidade <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.disponibilidade}
                onChange={(e) => setFormData({ ...formData, disponibilidade: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="manha">Apenas manhã</option>
                <option value="tarde">Apenas tarde</option>
                <option value="noite">Apenas noite</option>
                <option value="integral">Período integral</option>
                <option value="fins-de-semana">Fins de semana</option>
                <option value="totalmente-flexivel">Totalmente flexível</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Possui veículo próprio? <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.veiculo}
                onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Selecione</option>
                <option value="sim-adaptado">Sim, com adaptações para aula</option>
                <option value="sim-nao-adaptado">Sim, mas sem adaptações</option>
                <option value="nao">Não possuo</option>
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
