"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Award,
  X,
  ChevronDown,
  Shield,
  CheckCircle2,
  GraduationCap,
  Lock,
  TrendingUp,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { instructors } from "@/data/instructors-data"
import { extractCategories, parsePrice, parseRating, generateSlug } from "@/lib/instructor-utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Header from "@/components/Header"
import Breadcrumb from "@/components/breadcrumb"

type SortOption = "rating" | "price" | "students" | "experience"

const FAQ_ITEMS = [
  {
    question: "Como peço orçamento?",
    answer:
      'Navegue pelo catálogo, escolha o instrutor que mais combina com você e clique em "Pedir Orçamento". Preencha o formulário e a Via Betel fará a intermediação, entrando em contato em até 24h.',
  },
  {
    question: "Por que não aparece WhatsApp do instrutor?",
    answer:
      "Por privacidade e segurança, mantemos o contato intermediado. Isso garante proteção de dados pessoais e permite que a Via Betel ofereça suporte durante todo o processo.",
  },
  {
    question: "Em quanto tempo a Via Betel responde?",
    answer:
      "Nossa equipe responde pedidos de orçamento em até 24 horas úteis. Você receberá retorno no WhatsApp ou email cadastrado com as opções disponíveis.",
  },
  {
    question: "Como funciona remarcação?",
    answer:
      "Após confirmar sua primeira aula, você pode remarcar através da Via Betel com até 4 horas de antecedência sem custos. A plataforma facilita todo o processo de agendamento.",
  },
  {
    question: "Como escolher categoria CNH?",
    answer:
      "Categoria A é para motos, B para carros, C para caminhões, D para ônibus e E para carretas. Use os filtros para ver apenas instrutores da categoria que você precisa.",
  },
  {
    question: "Como instrutores entram na plataforma?",
    answer:
      "Todos os instrutores são verificados e certificados pelo DETRAN. Eles passam por análise de documentação, histórico profissional e avaliação de qualidade antes de serem aprovados.",
  },
]

export default function InstrutoresClient() {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [maxPrice, setMaxPrice] = useState(200)
  const [minRating, setMinRating] = useState(0)
  const [onlyJF, setOnlyJF] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedInstructorForQuote, setSelectedInstructorForQuote] = useState<{
    slug: string
    name: string
  } | null>(null)

  const [quoteForm, setQuoteForm] = useState({
    city: "",
    neighborhood: "",
    category: "B",
    availability1: "",
    availability2: "",
    availability3: "",
    objective: "",
    notes: "",
    studentName: "",
    studentWhatsApp: "",
  })
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [quoteSuccess, setQuoteSuccess] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      if (typeof window !== "undefined") {
        setIsDesktop(window.innerWidth >= 768)
      }
    }
    checkDesktop()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkDesktop)
      return () => window.removeEventListener("resize", checkDesktop)
    }
  }, [])

  const allSpecialties = useMemo(() => {
    const specs = new Set<string>()
    instructors.forEach((inst) => inst.specialties.forEach((s) => specs.add(s)))
    return Array.from(specs).sort()
  }, [])

  const filteredInstructors = useMemo(() => {
    const result = instructors.filter((inst) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase()
        const matchesSearch =
          inst.city.toLowerCase().includes(search) ||
          inst.neighborhood.toLowerCase().includes(search) ||
          inst.location.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== "Todas") {
        const cats = extractCategories(inst.role)
        if (!cats.includes(selectedCategory)) return false
      }

      // Price filter
      if (parsePrice(inst.price) > maxPrice) return false

      // Rating filter
      if (parseRating(inst.rating) < minRating) return false

      // JF filter
      if (onlyJF && (inst.city !== "Juiz de Fora" || inst.state !== "MG")) return false

      // Specialties filter
      if (selectedSpecialties.length > 0) {
        const hasSpecialty = selectedSpecialties.some((spec) => inst.specialties.includes(spec))
        if (!hasSpecialty) return false
      }

      return true
    })

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return parseRating(b.rating) - parseRating(a.rating)
        case "price":
          return parsePrice(a.price) - parsePrice(b.price)
        case "students":
          return b.studentsApproved - a.studentsApproved
        case "experience":
          return Number.parseInt(b.experience) - Number.parseInt(a.experience)
        default:
          return 0
      }
    })

    return result
  }, [searchText, selectedCategory, sortBy, maxPrice, minRating, onlyJF, selectedSpecialties])

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) => (prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]))
  }

  const clearFilters = () => {
    setSearchText("")
    setSelectedCategory("Todas")
    setMaxPrice(200)
    setMinRating(0)
    setOnlyJF(false)
    setSelectedSpecialties([])
  }

  const hasActiveFilters =
    searchText ||
    selectedCategory !== "Todas" ||
    maxPrice < 200 ||
    minRating > 0 ||
    onlyJF ||
    selectedSpecialties.length > 0

  const openQuoteModal = (instructorSlug: string, instructorName: string) => {
    setSelectedInstructorForQuote({ slug: instructorSlug, name: instructorName })
    setShowQuoteModal(true)
    setQuoteSuccess(false)
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingQuote(true)

    try {
      const response = await fetch("/api/quote/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteForm,
          instructorSlug: selectedInstructorForQuote?.slug,
        }),
      })

      if (response.ok) {
        setQuoteSuccess(true)
        setQuoteForm({
          city: "",
          neighborhood: "",
          category: "B",
          availability1: "",
          availability2: "",
          availability3: "",
          objective: "",
          notes: "",
          studentName: "",
          studentWhatsApp: "",
        })
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar orçamento:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Header />
        <Breadcrumb />

        {/* Hero Section - COMPACTADO para não duplicar navegação */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white py-8 sm:py-16 relative overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-3 sm:mb-6"
            >
              <div className="relative w-28 h-10 sm:w-56 sm:h-20">
                <Image
                  src="/images/viabetel-logo.png"
                  alt="Via Betel"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-center text-balance"
            >
              Catálogo de Instrutores
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-lg text-emerald-100 text-center max-w-2xl mx-auto text-pretty px-2"
            >
              Filtre por cidade, bairro e categoria CNH. Solicite orçamento e a Via Betel intermedia todo o processo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-10 max-w-4xl mx-auto"
            >
              {[
                { icon: Shield, label: "Avaliados" },
                { icon: CheckCircle2, label: "Suporte" },
                { icon: Lock, label: "Privacidade" },
                { icon: GraduationCap, label: "DETRAN OK" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 sm:gap-2 bg-amber-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg p-2 sm:p-3 border border-amber-600/30"
                >
                  <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                  <span className="text-[9px] sm:text-sm text-center text-amber-700 leading-tight">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 max-w-7xl -mt-6 sm:-mt-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl p-3 sm:p-6 border-2 border-emerald-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4">
              {/* Search input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Buscar cidade/bairro"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              {/* Category select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
                >
                  <option value="Todas">Todas</option>
                  <option value="A">Cat. A</option>
                  <option value="B">Cat. B</option>
                  <option value="C">Cat. C</option>
                  <option value="D">Cat. D</option>
                  <option value="E">Cat. E</option>
                  <option value="AB">AB</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
                >
                  <option value="rating">⭐ Avaliação</option>
                  <option value="price">💰 Preço</option>
                  <option value="students">👥 Aprovados</option>
                  <option value="experience">🏆 Experiência</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  Filtros
                </Button>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="ghost" size="sm" className="text-xs text-gray-600 py-1 px-2">
                    Limpar
                  </Button>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                <span className="text-emerald-600 font-bold">{filteredInstructors.length}</span> instrutores
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                {searchText && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {searchText}
                    <button onClick={() => setSearchText("")} className="ml-0.5 hover:text-emerald-900">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== "Todas" && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
                    Cat. {selectedCategory}
                    <button onClick={() => setSelectedCategory("Todas")} className="ml-0.5 hover:text-emerald-900">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                )}
                {selectedSpecialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
                  >
                    {spec}
                    <button onClick={() => toggleSpecialty(spec)} className="ml-0.5 hover:text-emerald-900">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 max-w-7xl mt-4 sm:mt-8 mb-8 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Filters Panel - mantém igual mas compacto */}
            <AnimatePresence>
              {(showFilters || isDesktop) && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="md:col-span-1 space-y-4"
                >
                  <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-4 border border-emerald-100">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">Filtros</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="md:hidden">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price filter */}
                    <div className="mb-4 sm:mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Preço máx: R$ {maxPrice}
                      </label>
                      <Slider
                        value={[maxPrice]}
                        onValueChange={([val]) => setMaxPrice(val)}
                        min={50}
                        max={200}
                        step={10}
                        className="mb-2"
                      />
                    </div>

                    {/* Rating filter */}
                    <div className="mb-4 sm:mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Aval. mínima</label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                      >
                        <option value="0">Todas</option>
                        <option value="4.0">4.0+ ⭐</option>
                        <option value="4.5">4.5+ ⭐⭐</option>
                        <option value="4.8">4.8+ ⭐⭐⭐</option>
                        <option value="4.9">4.9+ ⭐⭐⭐⭐</option>
                      </select>
                    </div>

                    {/* JF toggle */}
                    <div className="mb-4 sm:mb-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyJF}
                          onChange={(e) => setOnlyJF(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Só Juiz de Fora/MG</span>
                      </label>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Especialidades</h4>
                      <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                        {allSpecialties.map((spec) => (
                          <label key={spec} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                            <input
                              type="checkbox"
                              checked={selectedSpecialties.includes(spec)}
                              onChange={() => toggleSpecialty(spec)}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-gray-700">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Instructors Grid - mantém 2x2 mobile */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredInstructors.map((instructor) => {
                  const slug = generateSlug(instructor.name, instructor.city)
                  const categories = extractCategories(instructor.role)
                  const price = parsePrice(instructor.price)
                  const rating = parseRating(instructor.rating)

                  return (
                    <motion.div
                      key={instructor.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-300 overflow-hidden flex flex-col"
                    >
                      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-emerald-100 to-teal-100">
                        <Image
                          src={instructor.image || "/placeholder.svg?height=200&width=200"}
                          alt={instructor.name}
                          fill
                          className="object-cover"
                        />
                        {instructor.isSponsored && (
                          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1">
                            <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                            Patrocinado
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">
                          {instructor.name}
                        </h3>
                        <p className="text-[10px] sm:text-sm text-gray-600 flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                          <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {instructor.neighborhood}, {instructor.city}
                          </span>
                        </p>

                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                          <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] sm:text-sm font-bold text-gray-900">{instructor.rating}</span>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs text-gray-600">
                            <Award className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">{instructor.studentsApproved} aprovados</span>
                            <span className="sm:hidden">{instructor.studentsApproved}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-0.5 sm:gap-1 mb-2 sm:mb-3 hidden sm:flex">
                          {categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="bg-emerald-100 text-emerald-700 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-medium"
                            >
                              Cat. {cat}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-1 sm:pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <span className="text-xs sm:text-sm text-gray-600">por aula</span>
                            <span className="text-base sm:text-xl font-bold text-emerald-600">{instructor.price}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 sm:gap-2">
                            <Link href={`/instrutores/${slug}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-[10px] sm:text-sm py-1 sm:py-2 h-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                              >
                                Ver
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              onClick={() => openQuoteModal(slug, instructor.name)}
                              className="w-full text-[10px] sm:text-sm py-1 sm:py-2 h-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                              Orçamento
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-8 sm:py-16">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl space-y-8 sm:space-y-16">
            {/* Como Funciona */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Como Funciona</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {[
                  { icon: Search, title: "1. Busque", desc: "Filtre por cidade e categoria CNH" },
                  { icon: MessageCircle, title: "2. Peça", desc: "Solicite orçamento sem expor contato" },
                  { icon: CheckCircle2, title: "3. Receba", desc: "Via Betel intermedia e retorna em 24h" },
                  { icon: GraduationCap, title: "4. Aprenda", desc: "Comece suas aulas com segurança" },
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="bg-emerald-700/50 backdrop-blur-sm rounded-xl p-3 sm:p-6 border border-emerald-600/30">
                      <step.icon className="w-6 h-6 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-amber-400" />
                      <h3 className="font-bold text-xs sm:text-lg mb-1 sm:mb-2">{step.title}</h3>
                      <p className="text-[9px] sm:text-sm text-emerald-100 leading-tight">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacidade */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Privacidade Garantida</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {[
                  { icon: Lock, text: "Contato protegido até aprovação" },
                  { icon: Shield, text: "Dados seguros LGPD" },
                  { icon: CheckCircle2, text: "Suporte Via Betel 24/7" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-700/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-emerald-600/30 text-center"
                  >
                    <item.icon className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-amber-400" />
                    <p className="text-[9px] sm:text-sm text-emerald-100 leading-tight">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorias CNH */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Categorias CNH</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
                {[
                  { cat: "A", desc: "Motos" },
                  { cat: "B", desc: "Carros" },
                  { cat: "C", desc: "Caminhões" },
                  { cat: "D", desc: "Ônibus" },
                  { cat: "E", desc: "Carretas" },
                ].map((item) => (
                  <div
                    key={item.cat}
                    className="bg-emerald-700/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-emerald-600/30 text-center"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-amber-400 mb-0.5 sm:mb-1">{item.cat}</div>
                    <div className="text-[9px] sm:text-sm text-emerald-100">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Oficiais */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Links Oficiais</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: "DETRAN MG", url: "https://www.detran.mg.gov.br" },
                  {
                    label: "Portal CNH",
                    url: "https://www.gov.br/pt-br/servicos/obter-carteira-nacional-de-habilitacao",
                  },
                  { label: "Consulta CNH", url: "https://portalservicos.denatran.serpro.gov.br" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-700/50 backdrop-blur-sm hover:bg-emerald-600/50 rounded-lg p-2 sm:p-4 border border-emerald-600/30 text-center transition-all text-[10px] sm:text-sm font-medium"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Perguntas Frequentes</h2>
              <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
                {FAQ_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-700/50 backdrop-blur-sm rounded-lg border border-emerald-600/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-emerald-600/30 transition-colors"
                    >
                      <span className="font-semibold text-xs sm:text-base">{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                          openFaqIndex === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-3 sm:px-4 pb-3 sm:pb-4 text-[10px] sm:text-sm text-emerald-100 leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal - mantém mas compacta fonte mobile */}
      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6 rounded-t-2xl flex items-center justify-between z-10">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold">Solicitar Orçamento</h2>
                  {selectedInstructorForQuote && (
                    <p className="text-xs sm:text-sm text-emerald-100 mt-1">Para: {selectedInstructorForQuote.name}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {quoteSuccess ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-6 sm:py-8">
                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Orçamento Enviado!</h3>
                    <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-6">
                      A Via Betel entrará em contato em até 24 horas úteis.
                    </p>
                    <Button
                      onClick={() => {
                        setShowQuoteModal(false)
                        setQuoteSuccess(false)
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600"
                    >
                      Fechar
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Seu Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteForm.studentName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, studentName: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                          placeholder="João Silva"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.studentWhatsApp}
                          onChange={(e) => setQuoteForm({ ...quoteForm, studentWhatsApp: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                          placeholder="(32) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteForm.city}
                          onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                          placeholder="Juiz de Fora"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Bairro *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteForm.neighborhood}
                          onChange={(e) => setQuoteForm({ ...quoteForm, neighborhood: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                          placeholder="Centro"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Categoria CNH *
                      </label>
                      <select
                        value={quoteForm.category}
                        onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                      >
                        <option value="A">Categoria A (Moto)</option>
                        <option value="B">Categoria B (Carro)</option>
                        <option value="C">Categoria C (Caminhão)</option>
                        <option value="D">Categoria D (Ônibus)</option>
                        <option value="E">Categoria E (Carreta)</option>
                        <option value="AB">AB (Moto + Carro)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Disponibilidade (3 opções de horário)
                      </label>
                      <div className="space-y-2">
                        {["availability1", "availability2", "availability3"].map((field, idx) => (
                          <input
                            key={field}
                            type="text"
                            value={quoteForm[field as keyof typeof quoteForm]}
                            onChange={(e) => setQuoteForm({ ...quoteForm, [field]: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            placeholder={`Opção ${idx + 1}: Ex: Seg/Qua 14h-16h`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Objetivo *
                      </label>
                      <textarea
                        required
                        value={quoteForm.objective}
                        onChange={(e) => setQuoteForm({ ...quoteForm, objective: e.target.value })}
                        rows={2}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                        placeholder="Ex: Primeira habilitação, reciclagem, mudança de categoria..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Observações
                      </label>
                      <textarea
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        rows={2}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                        placeholder="Informações adicionais..."
                      />
                    </div>

                    <div className="flex gap-3 pt-3 sm:pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowQuoteModal(false)}
                        className="flex-1"
                        disabled={isSubmittingQuote}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        disabled={isSubmittingQuote}
                      >
                        {isSubmittingQuote ? "Enviando..." : "Enviar Orçamento"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
