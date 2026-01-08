"use client"

import { useState, useMemo, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSuccess(true)

    const whatsappMessage = encodeURIComponent(
      `Olá! Sou instrutor e vim do Instagram da Via Betel. Quero me cadastrar na plataforma.

Meus dados:
Nome: ${formData.nome}
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-emerald-50 rounded-lg p-3 space-y-2 border border-emerald-200">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
                Dados Pessoais
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
                  <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
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
                <span className="bg-amber-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  2
                </span>
                Experiência Profissional
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Categorias que ensina <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["A", "B", "C", "D", "E"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoriaToggle(cat)}
                      className={`px-2 py-1.5 rounded-md border transition-all font-semibold text-xs ${
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

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Anos de experiência <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.experiencia}
                  onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium"
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
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Possui veículo próprio? <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.veiculo}
                  onChange={(e) => setFormData({ ...formData, veiculo: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white font-medium"
                >
                  <option value="">Selecione</option>
                  <option value="sim-adaptado">Sim, com adaptações para aula</option>
                  <option value="sim-nao-adaptado">Sim, mas sem adaptações</option>
                  <option value="nao">Não possuo</option>
                </select>
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-3 space-y-2 border border-teal-200">
              <h3 className="text-base font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                <span className="bg-teal-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  3
                </span>
                <Clock className="w-3.5 h-3.5" />
                Disponibilidade Semanal
              </h3>

              <p className="text-[10px] text-teal-700 mb-2">
                Selecione os dias e horários que você está disponível para dar aulas
              </p>

              <div className="space-y-1.5">
                {diasSemana.map((dia) => (
                  <div key={dia.key} className="bg-white rounded-md p-2 border border-teal-200">
                    <div className="font-semibold text-xs text-teal-900 mb-1.5">{dia.fullLabel}</div>
                    <div className="flex gap-1.5">
                      {periodos.map((periodo) => (
                        <button
                          key={periodo.key}
                          type="button"
                          onClick={() => handleScheduleToggle(dia.key, periodo.key)}
                          className={`flex-1 py-1.5 px-2 rounded-md border transition-all font-medium text-[10px] ${
                            formData.weekSchedule[dia.key][periodo.key]
                              ? "bg-gradient-to-br from-teal-600 to-teal-700 border-teal-700 text-white shadow-sm"
                              : "bg-gray-50 border-teal-200 text-teal-700 hover:border-teal-400 hover:bg-teal-50"
                          }`}
                        >
                          {periodo.icon} {periodo.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {resumoDisponibilidade && (
                <div className="bg-teal-100 border border-teal-300 rounded-md p-2 text-[10px]">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-teal-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-teal-900 mb-0.5">Resumo da disponibilidade:</p>
                      <p className="text-teal-700">{resumoDisponibilidade}</p>
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
