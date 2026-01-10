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
  Clock,
  Users,
  GraduationCap,
  FileText,
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
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-10 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-56 h-56 lg:w-80 lg:h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-40 h-14 sm:w-56 sm:h-20">
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
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center text-balance"
            >
              Catálogo de Instrutores
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-emerald-100 text-center max-w-2xl mx-auto text-pretty"
            >
              Filtre por cidade, bairro e categoria CNH. Solicite orçamento e a Via Betel intermedia todo o processo com
              segurança e privacidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto"
            >
              {[
                { icon: Shield, label: "Instrutores Avaliados" },
                { icon: CheckCircle2, label: "Suporte Via Betel" },
                { icon: Lock, label: "Privacidade Garantida" },
                { icon: GraduationCap, label: "DETRAN Certificado" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 bg-emerald-800/40 backdrop-blur-sm rounded-lg p-3 border border-emerald-600/30"
                >
                  <item.icon className="w-6 h-6 text-amber-400" />
                  <span className="text-xs sm:text-sm text-center text-emerald-50">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 border-2 border-emerald-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Buscar por cidade ou bairro"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              {/* Category select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
                >
                  <option value="Todas">Todas Categorias</option>
                  <option value="A">Categoria A (Moto)</option>
                  <option value="B">Categoria B (Carro)</option>
                  <option value="C">Categoria C (Caminhão)</option>
                  <option value="D">Categoria D (Ônibus)</option>
                  <option value="E">Categoria E (Carreta)</option>
                  <option value="AB">AB (Moto + Carro)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
                >
                  <option value="rating">Melhor Avaliação</option>
                  <option value="price">Menor Preço</option>
                  <option value="students">Mais Aprovados</option>
                  <option value="experience">Mais Experiência</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros Avançados
                </Button>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="ghost" size="sm" className="text-gray-600">
                    Limpar filtros
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                <span className="text-emerald-600 font-bold">{filteredInstructors.length}</span> instrutores encontrados
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {searchText && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3" />
                    {searchText}
                    <button onClick={() => setSearchText("")} className="ml-1 hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== "Todas" && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                    Cat. {selectedCategory}
                    <button onClick={() => setSelectedCategory("Todas")} className="ml-1 hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSpecialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {spec}
                    <button onClick={() => toggleSpecialty(spec)} className="ml-1 hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl mt-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <AnimatePresence>
              {(showFilters || isDesktop) && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="md:col-span-1 space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">Filtros</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="md:hidden">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preço máximo: R$ {maxPrice}
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
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Avaliação mínima</label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                      >
                        <option value="0">Todas</option>
                        <option value="4.0">4.0+ ⭐</option>
                        <option value="4.5">4.5+ ⭐⭐</option>
                        <option value="4.8">4.8+ ⭐⭐⭐</option>
                        <option value="4.9">4.9+ ⭐⭐⭐⭐</option>
                      </select>
                    </div>

                    {/* JF toggle */}
                    <div className="mb-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyJF}
                          onChange={(e) => setOnlyJF(e.target.checked)}
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Somente Juiz de Fora/MG</span>
                      </label>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Especialidades</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allSpecialties.map((spec) => (
                          <label key={spec} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSpecialties.includes(spec)}
                              onChange={() => toggleSpecialty(spec)}
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-xs text-gray-600">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            <div className="md:col-span-3">
              {filteredInstructors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInstructors.map((instructor, idx) => {
                    const slug = generateSlug(instructor.name, instructor.city)
                    const categories = extractCategories(instructor.role)
                    const isSponsored = instructor.isSponsored || false

                    return (
                      <motion.div
                        key={instructor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-emerald-100 relative"
                      >
                        {isSponsored && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1 shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            Patrocinado
                          </div>
                        )}

                        {/* Photo */}
                        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100">
                          <img
                            src={instructor.photo || "/placeholder.svg"}
                            alt={instructor.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-gray-900">{instructor.rating}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{instructor.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span className="truncate">
                              {instructor.neighborhood}, {instructor.city}/{instructor.state}
                            </span>
                          </div>

                          {/* Categories */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded"
                              >
                                Cat. {cat}
                              </span>
                            ))}
                          </div>

                          <div className="space-y-2 mb-4 pb-4 border-b">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Award className="w-4 h-4 text-amber-600" />
                                <span>{instructor.studentsApproved} aprovados</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>{instructor.experience}</span>
                              </div>
                            </div>
                            <div className="font-bold text-emerald-600 text-xl text-center">
                              A partir de {instructor.price}
                            </div>
                          </div>

                          {instructor.specialties.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {instructor.specialties.slice(0, 2).map((spec) => (
                                  <span
                                    key={spec}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200"
                                  >
                                    {spec}
                                  </span>
                                ))}
                                {instructor.specialties.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                    +{instructor.specialties.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* CTAs */}
                          <div className="space-y-2">
                            <Link href={`/instrutores/${slug}`} className="block">
                              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md">
                                Ver Perfil Completo
                              </Button>
                            </Link>
                            <Button
                              onClick={() => openQuoteModal(slug, instructor.name)}
                              variant="outline"
                              className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent font-semibold"
                            >
                              Pedir Orçamento
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">Nenhum instrutor encontrado</p>
                  <p className="text-gray-500 text-sm mb-4">Tente ajustar os filtros ou fazer uma nova busca</p>
                  <Button onClick={clearFilters} className="bg-emerald-600 hover:bg-emerald-700">
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 space-y-16">
            {/* Como Funciona */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Como Funciona</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Search,
                    title: "1. Busque e Compare",
                    description:
                      "Navegue pelo catálogo, use filtros por categoria, cidade e especialidades. Compare preços, avaliações e experiência.",
                  },
                  {
                    icon: MessageCircle,
                    title: "2. Solicite Orçamento",
                    description:
                      "Clique em 'Pedir Orçamento' no instrutor escolhido. A Via Betel intermedia o contato preservando sua privacidade.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "3. Comece as Aulas",
                    description:
                      "Receba a resposta em até 24h. Escolha horários, confirme e inicie seu treinamento com segurança e suporte total.",
                  },
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Privacidade e Segurança */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl shadow-lg p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-bold">Privacidade e Segurança</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-800/50 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    Contato Intermediado
                  </h3>
                  <p className="text-sm text-emerald-100">
                    Seu WhatsApp e dados pessoais não são compartilhados diretamente com instrutores. A Via Betel faz a
                    ponte.
                  </p>
                </div>
                <div className="bg-emerald-800/50 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    Instrutores Verificados
                  </h3>
                  <p className="text-sm text-emerald-100">
                    Todos passam por análise documental, verificação de certificação DETRAN e avaliação de histórico
                    profissional.
                  </p>
                </div>
                <div className="bg-emerald-800/50 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Suporte Contínuo
                  </h3>
                  <p className="text-sm text-emerald-100">
                    Equipe Via Betel disponível para mediar qualquer questão, remarcação ou problema durante seu
                    treinamento.
                  </p>
                </div>
                <div className="bg-emerald-800/50 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Conformidade LGPD
                  </h3>
                  <p className="text-sm text-emerald-100">
                    Seus dados são protegidos conforme a Lei Geral de Proteção de Dados. Não vendemos ou compartilhamos
                    informações.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Categorias CNH */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Categorias CNH</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { cat: "A", name: "Moto", desc: "Ciclomotor e motocicleta" },
                  { cat: "B", name: "Carro", desc: "Veículo até 3.500kg e 8 lugares" },
                  { cat: "C", name: "Caminhão", desc: "Veículo de carga acima de 3.500kg" },
                  { cat: "D", name: "Ônibus", desc: "Veículo de passageiros acima de 8" },
                  { cat: "E", name: "Carreta", desc: "Veículo com reboque ou semi-reboque" },
                ].map((item) => (
                  <button
                    key={item.cat}
                    onClick={() => {
                      setSelectedCategory(item.cat)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all border-2 border-emerald-100 hover:border-emerald-500 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{item.cat}</div>
                    <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.desc}</div>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Conteúdos Oficiais */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
                Conteúdos Oficiais Recomendados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Código de Trânsito Brasileiro",
                    desc: "Lei completa com todas as regras e penalidades",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/l9503.htm",
                  },
                  {
                    title: "Portal CONTRAN",
                    desc: "Conselho Nacional de Trânsito - Resoluções e normas",
                    link: "https://www.gov.br/transportes/pt-br/assuntos/transito/contran",
                  },
                  {
                    title: "SENATRAN",
                    desc: "Secretaria Nacional de Trânsito - Informações oficiais",
                    link: "https://www.gov.br/transportes/pt-br/assuntos/transito/senatran",
                  },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 hover:shadow-lg transition-all border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                    <div className="text-emerald-600 font-semibold text-sm flex items-center gap-1">
                      Acessar <span>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Perguntas Frequentes</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                {FAQ_ITEMS.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md border border-emerald-100 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-emerald-600 transition-transform ${openFaqIndex === idx ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-4 text-gray-600 text-sm border-t border-emerald-100"
                        >
                          <p className="pt-4">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmittingQuote && !quoteSuccess && setShowQuoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {quoteSuccess ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Solicitação Enviada!</h3>
                  <p className="text-gray-600 mb-6">
                    Recebemos seu pedido de orçamento. A Via Betel fará a intermediação e retornará em até 24 horas
                    úteis no WhatsApp ou email cadastrado.
                  </p>
                  <Button
                    onClick={() => setShowQuoteModal(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Fechar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Pedir Orçamento{selectedInstructorForQuote && ` - ${selectedInstructorForQuote.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowQuoteModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.city}
                          onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder="Ex: Juiz de Fora"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                        <input
                          type="text"
                          value={quoteForm.neighborhood}
                          onChange={(e) => setQuoteForm({ ...quoteForm, neighborhood: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder="Ex: Centro"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria CNH *</label>
                      <select
                        required
                        value={quoteForm.category}
                        onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                      <select
                        value={quoteForm.objective}
                        onChange={(e) => setQuoteForm({ ...quoteForm, objective: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="primeira-habilitacao">Primeira Habilitação</option>
                        <option value="baliza">Reforço Baliza</option>
                        <option value="prova-pratica">Treino Prova Prática</option>
                        <option value="medo-de-dirigir">Superar Medo de Dirigir</option>
                        <option value="adicao-categoria">Adição de Categoria</option>
                        <option value="reciclagem">Reciclagem/Voltar a Dirigir</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade 1 *</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.availability1}
                          onChange={(e) => setQuoteForm({ ...quoteForm, availability1: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder="Ex: Seg-Sex 9h-12h"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade 2</label>
                        <input
                          type="text"
                          value={quoteForm.availability2}
                          onChange={(e) => setQuoteForm({ ...quoteForm, availability2: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder="Ex: Sáb 14h-17h"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade 3</label>
                        <input
                          type="text"
                          value={quoteForm.availability3}
                          onChange={(e) => setQuoteForm({ ...quoteForm, availability3: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder="Ex: Noturno 19h"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                      <textarea
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                        placeholder="Informações adicionais sobre suas necessidades..."
                      />
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Opcional:</strong> Forneça seus dados para agilizar o contato da Via Betel (não será
                        repassado ao instrutor):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                          <input
                            type="text"
                            value={quoteForm.studentName}
                            onChange={(e) => setQuoteForm({ ...quoteForm, studentName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label>
                          <input
                            type="tel"
                            value={quoteForm.studentWhatsApp}
                            onChange={(e) => setQuoteForm({ ...quoteForm, studentWhatsApp: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="(31) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setShowQuoteModal(false)}
                      variant="outline"
                      className="flex-1"
                      disabled={isSubmittingQuote}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      disabled={isSubmittingQuote}
                    >
                      {isSubmittingQuote ? "Enviando..." : "Enviar Solicitação"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
