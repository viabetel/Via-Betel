"use client"

import { useState, useMemo, useRef, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, Clock, ChevronDown, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

type DaySchedule = {
  manha: boolean
  tarde: boolean
  noite: boolean
}

type WeekSchedule = {
  segunda: DaySchedule
  terca: DaySchedule
  quarta: DaySchedule
  quinta: DaySchedule
  sexta: DaySchedule
  sabado: DaySchedule
  domingo: DaySchedule
}

type FormData = {
  nome: string
  email: string
  whatsapp: string
  cidade: string
  uf: string
  categorias: string[]
  experiencia: string
  weekSchedule: WeekSchedule
  veiculo: string
}

const diasSemana = [
  { key: "segunda", label: "Seg", fullLabel: "Segunda" },
  { key: "terca", label: "Ter", fullLabel: "Terça" },
  { key: "quarta", label: "Qua", fullLabel: "Quarta" },
  { key: "quinta", label: "Qui", fullLabel: "Quinta" },
  { key: "sexta", label: "Sex", fullLabel: "Sexta" },
  { key: "sabado", label: "Sáb", fullLabel: "Sábado" },
  { key: "domingo", label: "Dom", fullLabel: "Domingo" },
] as const

const periodos = [
  { key: "manha", label: "Manhã", shortLabel: "M", icon: "☀️" },
  { key: "tarde", label: "Tarde", shortLabel: "T", icon: "🌤️" },
  { key: "noite", label: "Noite", shortLabel: "N", icon: "🌙" },
] as const

export default function InstrutorClientPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    whatsapp: "",
    cidade: "",
    uf: "",
    categorias: [],
    experiencia: "",
    weekSchedule: {
      segunda: { manha: false, tarde: false, noite: false },
      terca: { manha: false, tarde: false, noite: false },
      quarta: { manha: false, tarde: false, noite: false },
      quinta: { manha: false, tarde: false, noite: false },
      sexta: { manha: false, tarde: false, noite: false },
      sabado: { manha: false, tarde: false, noite: false },
      domingo: { manha: false, tarde: false, noite: false },
    },
    veiculo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
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

  const handleCategoriaToggle = (categoria: string) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria],
    }))
  }

  const handleScheduleToggle = (dia: keyof WeekSchedule, periodo: keyof DaySchedule) => {
    setFormData((prev) => ({
      ...prev,
      weekSchedule: {
        ...prev.weekSchedule,
        [dia]: {
          ...prev.weekSchedule[dia],
          [periodo]: !prev.weekSchedule[dia][periodo],
        },
      },
    }))
  }

  const formatDisponibilidade = () => {
    const dias = Object.entries(formData.weekSchedule)
      .filter(([_, schedule]) => Object.values(schedule).some((v) => v))
      .map(([dia, schedule]) => {
        const periodos = Object.entries(schedule)
          .filter(([_, disponivel]) => disponivel)
          .map(([periodo]) => periodo)
          .join(", ")
        return `${dia}: ${periodos}`
      })
    return dias.join("\n")
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

    const temDisponibilidade = Object.values(formData.weekSchedule).some((day) =>
      Object.values(day).some((period) => period),
    )
    if (!temDisponibilidade) {
      setError("Selecione pelo menos um período de disponibilidade")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "instrutor",
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
      `Olá! Sou instrutor e vim do Instagram da Via Betel. Quero me cadastrar na plataforma.

Meus dados:
Nome: ${formData.nome}
Email: ${formData.email}
Cidade: ${formData.cidade}/${formData.uf}
Categorias que ensino: ${formData.categorias.join(", ")}
Experiência: ${formData.experiencia}

Disponibilidade semanal:
${formatDisponibilidade()}

Veículo próprio: ${formData.veiculo}
WhatsApp: ${formData.whatsapp}`,
    )

    setTimeout(() => {
      window.open(`https://wa.me/5532988093506?text=${whatsappMessage}`, "_blank")
    }, 800)

    setIsSubmitting(false)
  }

  const marcarDiasUteis = () => {
    setFormData((prev) => ({
      ...prev,
      weekSchedule: {
        ...prev.weekSchedule,
        segunda: { manha: true, tarde: true, noite: true },
        terca: { manha: true, tarde: true, noite: true },
        quarta: { manha: true, tarde: true, noite: true },
        quinta: { manha: true, tarde: true, noite: true },
        sexta: { manha: true, tarde: true, noite: true },
      },
    }))
  }

  const marcarFimDeSemana = () => {
    setFormData((prev) => ({
      ...prev,
      weekSchedule: {
        ...prev.weekSchedule,
        sabado: { manha: true, tarde: true, noite: true },
        domingo: { manha: true, tarde: true, noite: true },
      },
    }))
  }

  const aplicarPadraoSegunda = () => {
    const padraoSegunda = formData.weekSchedule.segunda
    setFormData((prev) => ({
      ...prev,
      weekSchedule: {
        segunda: padraoSegunda,
        terca: { ...padraoSegunda },
        quarta: { ...padraoSegunda },
        quinta: { ...padraoSegunda },
        sexta: { ...padraoSegunda },
        sabado: { ...padraoSegunda },
        domingo: { ...padraoSegunda },
      },
    }))
  }

  const limparTudo = () => {
    setFormData((prev) => ({
      ...prev,
      weekSchedule: {
        segunda: { manha: false, tarde: false, noite: false },
        terca: { manha: false, tarde: false, noite: false },
        quarta: { manha: false, tarde: false, noite: false },
        quinta: { manha: false, tarde: false, noite: false },
        sexta: { manha: false, tarde: false, noite: false },
        sabado: { manha: false, tarde: false, noite: false },
        domingo: { manha: false, tarde: false, noite: false },
      },
    }))
  }

  const resumoDisponibilidade = useMemo(() => {
    const periodosSelecionados: string[] = []

    Object.entries(formData.weekSchedule).forEach(([dia, schedule]) => {
      const periodos = Object.entries(schedule)
        .filter(([_, disponivel]) => disponivel)
        .map(([periodo]) => periodo.charAt(0).toUpperCase())

      if (periodos.length > 0) {
        const diaObj = diasSemana.find((d) => d.key === dia)
        periodosSelecionados.push(`${diaObj?.label}(${periodos.join("/")})`)
      }
    })

    return periodosSelecionados.length > 0 ? `Selecionado: ${periodosSelecionados.join(", ")}` : null
  }, [formData.weekSchedule])

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
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-5 py-3 text-sm shadow-lg hover:shadow-2xl transition-all border-2 border-amber-400">
              Voltar ao início
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 py-4">
      <div className="container mx-auto px-3 max-w-3xl">
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
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Seja um instrutor!</h1>
              <p className="text-emerald-50 text-sm">Conecte-se com alunos e amplie sua renda</p>
            </div>
            <p className="text-gray-600 text-xs">Preencha os dados abaixo para iniciarmos sua jornada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5" ref={dropdownRef}>
            <div className="bg-emerald-50 rounded-lg p-2.5 space-y-1.5 border border-emerald-200">
              <h3 className="text-sm font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                <span className="bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
                  1
                </span>
                Dados Pessoais
              </h3>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-900 mb-0.5">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-2 py-1 text-[11px] border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-900 mb-0.5">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2 py-1 text-[11px] border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-900 mb-0.5">
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                  className="w-full px-2 py-1 text-[11px] border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  placeholder="(32) 98888-8888"
                  maxLength={15}
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-emerald-900 mb-0.5">
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-2 py-1 text-[11px] border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-900 mb-0.5">
                    UF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                    className="w-full px-2 py-1 text-[11px] border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                    placeholder="MG"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-2.5 space-y-1.5 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                <span className="bg-amber-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
                  2
                </span>
                Experiência Profissional
              </h3>

              <div>
                <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">
                  Categorias que ensina <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["A", "B", "C", "D", "E"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoriaToggle(cat)}
                      className={`px-2 py-1.5 rounded-md border transition-all font-semibold text-[10px] ${
                        formData.categorias.includes(cat)
                          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-700 text-white shadow-md scale-105"
                          : "bg-white border-amber-300 text-amber-900 hover:border-emerald-400 hover:shadow-sm"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">
                  Anos de experiência <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "experiencia" ? null : "experiencia")}
                  className="w-full px-2 py-1 text-[11px] border border-amber-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium text-left flex items-center justify-between"
                >
                  <span className={formData.experiencia ? "text-gray-900" : "text-gray-400"}>
                    {formData.experiencia
                      ? {
                          "menos-1-ano": "Menos de 1 ano",
                          "1-3-anos": "1 a 3 anos",
                          "3-5-anos": "3 a 5 anos",
                          "5-10-anos": "5 a 10 anos",
                          "mais-10-anos": "Mais de 10 anos",
                        }[formData.experiencia]
                      : "Selecione"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      openDropdown === "experiencia" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "experiencia" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-1.5 z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      {[
                        { value: "menos-1-ano", label: "Menos de 1 ano" },
                        { value: "1-3-anos", label: "1 a 3 anos" },
                        { value: "3-5-anos", label: "3 a 5 anos" },
                        { value: "5-10-anos", label: "5 a 10 anos" },
                        { value: "mais-10-anos", label: "Mais de 10 anos" },
                      ].map((exp) => (
                        <button
                          key={exp.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, experiencia: exp.value })
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-[10px] transition-all font-medium"
                        >
                          {exp.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-semibold text-amber-900 mb-0.5">
                  Possui veículo próprio? <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "veiculo" ? null : "veiculo")}
                  className="w-full px-2 py-1 text-[11px] border border-amber-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium text-left flex items-center justify-between"
                >
                  <span className={formData.veiculo ? "text-gray-900" : "text-gray-400"}>
                    {formData.veiculo
                      ? {
                          "sim-adaptado": "Sim, com adaptações para aula",
                          "sim-nao-adaptado": "Sim, mas sem adaptações",
                          nao: "Não possuo",
                        }[formData.veiculo]
                      : "Selecione"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      openDropdown === "veiculo" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === "veiculo" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-1.5 z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      {[
                        { value: "sim-adaptado", label: "Sim, com adaptações para aula" },
                        { value: "sim-nao-adaptado", label: "Sim, mas sem adaptações" },
                        { value: "nao", label: "Não possuo" },
                      ].map((veic) => (
                        <button
                          key={veic.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, veiculo: veic.value })
                            setOpenDropdown(null)
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-[10px] transition-all font-medium"
                        >
                          {veic.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-2.5 space-y-1.5 border border-teal-200">
              <h3 className="text-sm font-bold text-teal-900 mb-1.5 flex items-center gap-1.5">
                <span className="bg-teal-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
                  3
                </span>
                <Calendar className="w-3.5 h-3.5" />
                Disponibilidade Semanal
              </h3>

              <p className="text-[10px] text-teal-700 mb-2">Marque os períodos em que está disponível para dar aulas</p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-600 to-teal-700">
                      <th className="px-2 py-1.5 text-[9px] font-bold text-white border border-teal-500">Dia</th>
                      <th className="px-2 py-1.5 text-[9px] font-bold text-white border border-teal-500">☀️ Manhã</th>
                      <th className="px-2 py-1.5 text-[9px] font-bold text-white border border-teal-500">🌤️ Tarde</th>
                      <th className="px-2 py-1.5 text-[9px] font-bold text-white border border-teal-500">🌙 Noite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diasSemana.map((dia, idx) => (
                      <tr key={dia.key} className={idx % 2 === 0 ? "bg-teal-50/50" : "bg-white"}>
                        <td className="px-2 py-1 text-[10px] font-semibold text-teal-900 border border-teal-200">
                          {dia.label}
                        </td>
                        {periodos.map((periodo) => (
                          <td key={periodo.key} className="px-1 py-1 border border-teal-200 text-center">
                            <button
                              type="button"
                              onClick={() => handleScheduleToggle(dia.key, periodo.key)}
                              className={cn(
                                "w-full h-6 rounded-md transition-all font-medium text-[9px]",
                                formData.weekSchedule[dia.key][periodo.key]
                                  ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-400 hover:bg-teal-100 hover:text-teal-700",
                              )}
                            >
                              {formData.weekSchedule[dia.key][periodo.key] ? "✓" : "—"}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {resumoDisponibilidade && (
                <div className="bg-teal-100 border border-teal-300 rounded-md p-2 text-[10px] mt-2">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-teal-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-teal-900 mb-0.5">Resumo:</p>
                      <p className="text-teal-800">{resumoDisponibilidade}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded-md text-[10px] font-medium flex items-center gap-1.5">
                <span className="text-sm">⚠️</span>
                {error}
              </div>
            )}

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
                <>
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Enviar e falar no WhatsApp
                </>
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
