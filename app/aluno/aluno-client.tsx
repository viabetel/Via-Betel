"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, GraduationCap, MapPin, Phone } from "lucide-react"
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

export default function AlunoClientPage() {
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

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSuccess(true)

    const whatsappMessage = encodeURIComponent(
      `Olá! Vim do Instagram da Via Betel. Quero aulas de direção. Pode me orientar sobre valores e disponibilidade?

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

    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center p-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-xl shadow-2xl p-4 text-center border-2 border-amber-400"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Recebido com sucesso!</h2>
          <p className="text-gray-600 mb-3 text-sm">Abrindo WhatsApp para conversarmos...</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-5 py-3 text-sm shadow-lg">
              Voltar ao início
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 py-4">
      <div className="container mx-auto px-3 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-amber-300 mb-3 font-medium transition-colors text-xs"
        >
          <ArrowLeft className="w-3 h-3 mr-1.5" />
          Voltar
        </Link>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-2xl p-3 md:p-4 border-2 border-amber-400"
        >
          <div className="text-center mb-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-3 mb-3">
              <Image
                src="/images/viabetel-logo.png"
                alt="Via Betel"
                width={140}
                height={42}
                className="h-8 w-auto mx-auto mb-1.5"
              />
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Comece sua jornada!</h1>
              <p className="text-emerald-50 text-sm">Conecte-se com instrutores qualificados</p>
            </div>
            <p className="text-gray-600 text-xs">Preencha os dados abaixo para falarmos no WhatsApp</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-emerald-50 rounded-lg p-3 space-y-2 border border-emerald-200">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Seus Dados
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                  className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="(32) 98888-8888"
                  maxLength={15}
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-emerald-900 mb-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                    UF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                    placeholder="MG"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 space-y-2 border border-amber-200">
              <h3 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Suas Preferências
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Categoria desejada <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium"
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
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Seu objetivo <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.objetivo}
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium"
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
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Melhor horário <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium"
                >
                  <option value="">Selecione</option>
                  <option value="manha">Manhã (8h - 12h)</option>
                  <option value="tarde">Tarde (13h - 18h)</option>
                  <option value="noite">Noite (18h - 21h)</option>
                  <option value="flexivel">Horário flexível</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 text-sm min-h-[42px] rounded-lg shadow-xl hover:shadow-2xl transition-all border-2 border-amber-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar e falar no WhatsApp"
              )}
            </Button>
          </form>

          <p className="text-[9px] text-gray-500 text-center mt-3">
            Ao enviar, você concorda com nossa Política de Privacidade
          </p>
        </motion.div>
      </div>
    </div>
  )
}
