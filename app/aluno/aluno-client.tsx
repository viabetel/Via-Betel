"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, GraduationCap, MapPin, Phone, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

type FormData = {
  nome: string
  email: string
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
    email: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    categoria: "",
    objetivo: "",
    horario: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

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

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "aluno",
          dados: formData,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Erro ao enviar email:", await response.text())
      }
    } catch (error) {
      console.error("[v0] Erro na requisição de email:", error)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSuccess(true)

    const whatsappMessage = encodeURIComponent(
      `Olá! Vim do Instagram da Via Betel. Quero aulas de direção. Pode me orientar sobre valores e disponibilidade?

Meus dados:
Nome: ${formData.nome}
E-mail: ${formData.email}
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

          <form onSubmit={handleSubmit} className="space-y-3" ref={dropdownRef}>
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
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="seu@email.com"
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

              <div className="relative">
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Categoria desejada <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "categoria" ? null : "categoria")}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium text-left flex items-center justify-between"
                >
                  <span className={formData.categoria ? "text-gray-900" : "text-gray-400"}>
                    {formData.categoria ? `Categoria ${formData.categoria}` : "Selecione"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === "categoria" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "categoria" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-2 z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm max-h-60 overflow-y-auto"
                    >
                      {[
                        { value: "A", label: "Categoria A (Moto)" },
                        { value: "B", label: "Categoria B (Carro)" },
                        { value: "AB", label: "Categoria AB (Carro e Moto)" },
                        { value: "C", label: "Categoria C (Caminhão)" },
                        { value: "D", label: "Categoria D (Ônibus)" },
                        { value: "E", label: "Categoria E (Carreta)" },
                      ].map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, categoria: cat.value })
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                        >
                          {cat.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Seu objetivo <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "objetivo" ? null : "objetivo")}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium text-left flex items-center justify-between"
                >
                  <span className={formData.objetivo ? "text-gray-900" : "text-gray-400"}>
                    {formData.objetivo
                      ? {
                          "primeira-habilitacao": "Primeira habilitação",
                          reabilitacao: "Reabilitação",
                          "medo-dirigir": "Medo de dirigir",
                          aperfeicoamento: "Aperfeiçoamento",
                          outros: "Outros",
                        }[formData.objetivo]
                      : "Selecione"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === "objetivo" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "objetivo" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-2 z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      {[
                        { value: "primeira-habilitacao", label: "Primeira habilitação" },
                        { value: "reabilitacao", label: "Reabilitação" },
                        { value: "medo-dirigir", label: "Medo de dirigir" },
                        { value: "aperfeicoamento", label: "Aperfeiçoamento" },
                        { value: "outros", label: "Outros" },
                      ].map((obj) => (
                        <button
                          key={obj.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, objetivo: obj.value })
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                        >
                          {obj.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Melhor horário <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "horario" ? null : "horario")}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium text-left flex items-center justify-between"
                >
                  <span className={formData.horario ? "text-gray-900" : "text-gray-400"}>
                    {formData.horario
                      ? {
                          manha: "Manhã (8h - 12h)",
                          tarde: "Tarde (13h - 18h)",
                          noite: "Noite (18h - 21h)",
                          flexivel: "Horário flexível",
                        }[formData.horario]
                      : "Selecione"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === "horario" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "horario" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-2 z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      {[
                        { value: "manha", label: "Manhã (8h - 12h)" },
                        { value: "tarde", label: "Tarde (13h - 18h)" },
                        { value: "noite", label: "Noite (18h - 21h)" },
                        { value: "flexivel", label: "Horário flexível" },
                      ].map((hor) => (
                        <button
                          key={hor.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, horario: hor.value })
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                        >
                          {hor.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
