"use client"

import type React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, SlidersHorizontal, MapPin, Star, Award, X, ChevronDown, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { instructors } from "@/data/instructors-data"
import { extractCategories, parsePrice, parseRating, generateSlug } from "@/lib/instructor-utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { HeaderContent } from "@/components/header-content"
import Breadcrumb from "@/components/breadcrumb"
import { SectionHeader } from "@/components/ui/section-header"
import { PremiumCard } from "@/components/ui/premium-card"
import { BadgeChip } from "@/components/ui/badge-chip"
import { ExpandableMenu } from "@/components/ui/expandable-menu"
import { useMotionDebug } from "@/hooks/use-motion-debug"
import { useMarketplaceSync } from "@/hooks/use-marketplace-sync"
import { LoginGuardModal } from "@/components/auth/login-guard-modal"
import { useAuth } from "@/lib/auth-context"

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

type Props = {
  initialInstructors: typeof instructors
}

export default function InstrutoresClient({ initialInstructors }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { user } = useAuth()
  const { favorites, compareList, toggleFavorite, toggleCompare, clearCompare } = useMarketplaceSync()

  const [showLoginGuard, setShowLoginGuard] = useState(false)
  const [loginGuardFeature, setLoginGuardFeature] = useState<"favoritar" | "comparar" | "salvar busca">("favoritar")

  const { shouldDisableMotion } = useMotionDebug()
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLElement>(null)
  const heroEndRef = useRef<HTMLDivElement>(null)

  const logoY = useTransform(scrollY, [0, 500], [0, -80])
  const logoScale = useTransform(scrollY, [0, 400], [1, 0.85])
  const titleY = useTransform(scrollY, [0, 500], [0, -60])
  const titleScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const subtitleY = useTransform(scrollY, [0, 500], [0, -40])
  const buttonsY = useTransform(scrollY, [0, 500], [0, -20])
  const badgeY = useTransform(scrollY, [0, 500], [0, -100])
  const parallaxY = useTransform(scrollY, [0, 500], [0, -28])
  const parallaxYInverse = useTransform(parallaxY, (v) => -v * 0.7)

  const containerVariants = shouldDisableMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      }

  const itemVariants = shouldDisableMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }

  const [searchText, setSearchText] = useState(searchParams?.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "Todas")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "students" | "experience">("rating")
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
    if (initialInstructors && Array.isArray(initialInstructors)) {
      initialInstructors.forEach((inst) => {
        if (inst.specialties && Array.isArray(inst.specialties)) {
          inst.specialties.forEach((s) => specs.add(s))
        }
      })
    }
    return Array.from(specs).sort()
  }, [initialInstructors])

  const filteredInstructors = useMemo(() => {
    if (!initialInstructors || !Array.isArray(initialInstructors)) {
      return []
    }

    const result = initialInstructors.filter((inst) => {
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

  const handleFavorite = async (instructorSlug: string, instructorName: string) => {
    if (!user) {
      setLoginGuardFeature("favoritar")
      setShowLoginGuard(true)
      return
    }
    await toggleFavorite(instructorSlug, instructorName)
  }

  const handleCompare = async (instructorSlug: string, instructorName: string) => {
    if (!user) {
      setLoginGuardFeature("comparar")
      setShowLoginGuard(true)
      return
    }
    await toggleCompare(instructorSlug, instructorName)
  }

  return (
    <>
      <motion.section
        ref={heroRef}
        className="relative min-h-[75vh] sm:min-h-[90vh] lg:min-h-[560px] flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary-darkest)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-secondary-dark)] text-[var(--color-brand-text-light)] overflow-hidden"
      >
        <div className="fixed top-0 left-0 right-0 z-[100] w-full">
          <div
            className="bg-gradient-to-r from-emerald-800/95 via-emerald-700/95 to-teal-700/95 backdrop-blur-md shadow-lg border-b border-white/10"
            style={{
              transition: "all 0.4s ease-in-out",
            }}
          >
            <div className="container mx-auto max-w-7xl w-full">
              <HeaderContent variant="hero" />
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <motion.div
          style={{ y: shouldDisableMotion ? 0 : parallaxY }}
          className="absolute top-10 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-[var(--color-brand-accent)]/30 rounded-full blur-2xl lg:blur-3xl"
        />
        <motion.div
          style={{ y: shouldDisableMotion ? 0 : parallaxYInverse }}
          className="absolute bottom-10 right-10 w-56 h-56 lg:w-80 lg:h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-2xl lg:blur-3xl"
        />

        <div className="container relative z-10 px-6 sm:px-6 py-8 sm:py-16 md:py-20 lg:py-24 max-w-7xl w-full">
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="mx-auto max-w-full text-center space-y-3 sm:space-y-5 lg:space-y-8"
          >
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : logoY,
                scale: shouldDisableMotion ? 1 : logoScale,
              }}
              className="flex justify-center mb-2 sm:mb-4"
            >
              <div className="relative w-32 h-12 sm:w-48 sm:h-16 md:w-56 md:h-20 lg:w-64 lg:h-24">
                <Image
                  src="/images/viabetel-logo.png"
                  alt="Via Betel - Auto Escola"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : badgeY,
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-accent)]/20 to-[var(--color-brand-primary)]/20 backdrop-blur-sm border border-[var(--color-brand-accent-light)]/30 rounded-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 shadow-lg shadow-[var(--color-brand-accent)]/20"
            >
              <span className="text-xs sm:text-sm lg:text-base font-medium text-[var(--color-brand-text-muted)]">
                Marketplace de Instrutores
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : titleY,
                scale: shouldDisableMotion ? 1 : titleScale,
              }}
              className="text-[1.625rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.25] sm:leading-tight px-0 max-w-full"
            >
              <span className="block text-balance">Catálogo Completo de </span>
              <span className="bg-gradient-to-r from-[var(--color-brand-accent-light)] via-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] bg-clip-text text-transparent drop-shadow-lg">
                Instrutores
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : subtitleY,
              }}
              className="mx-auto max-w-full sm:max-w-2xl text-[0.8125rem] sm:text-base md:text-lg lg:text-xl leading-relaxed text-[var(--color-brand-text-muted)] px-0"
            >
              <span className="block text-pretty">
                Navegue pelo catálogo completo, filtre por cidade, categoria e preço. Encontre o instrutor perfeito para
                você.
              </span>
            </motion.p>

            <motion.div variants={itemVariants} className="mx-auto max-w-4xl w-full px-0 sm:px-4">
              <PremiumCard className="p-3 sm:p-6 bg-white/95 backdrop-blur-sm">
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
                      <Button
                        onClick={clearFilters}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 py-1 px-2"
                      >
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
              </PremiumCard>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : buttonsY,
              }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center items-stretch sm:items-center px-0 max-w-full"
            >
              <Breadcrumb />
            </motion.div>
          </motion.div>
        </div>

        <div ref={heroEndRef} className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none" aria-hidden="true" />
      </motion.section>

      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl pt-8 relative z-20">
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

            <div className="md:col-span-3 grid gap-4 sm:gap-6">
              {filteredInstructors.length === 0 ? (
                <PremiumCard className="p-8 text-center">
                  <p className="text-gray-500">Nenhum instrutor encontrado com os filtros selecionados.</p>
                </PremiumCard>
              ) : (
                filteredInstructors.map((inst) => {
                  const instructorSlug = generateSlug(inst.name, inst.city)
                  const cats = extractCategories(inst.role)

                  return (
                    <PremiumCard key={instructorSlug} hover className="overflow-hidden group relative">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-1/3 h-48 sm:h-full relative">
                          <img
                            src={inst.photo || "/placeholder.svg"}
                            alt={inst.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 sm:p-6 sm:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{inst.name}</h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                  <MapPin className="w-4 h-4 text-emerald-600" />
                                  <span>
                                    {inst.neighborhood}, {inst.city}/{inst.state}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BadgeChip variant="rating" icon={Star}>
                                    {inst.rating}
                                  </BadgeChip>
                                  <span className="text-sm text-gray-600">{inst.experience}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600">{inst.price}</div>
                                <div className="text-xs text-gray-600">por aula</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {cats.map((cat) => (
                                <BadgeChip key={cat} variant="category">
                                  Cat. {cat}
                                </BadgeChip>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <div className="font-bold text-gray-900">{inst.studentsApproved}</div>
                                  <div className="text-xs text-gray-600">Aprovados</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Link href={`/instrutores/${instructorSlug}`} className="flex-1">
                              <Button variant="outline" className="w-full bg-transparent">
                                Ver Perfil
                              </Button>
                            </Link>
                            <Button
                              onClick={() => openQuoteModal(instructorSlug, inst.name)}
                              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
                            >
                              Pedir Orçamento
                            </Button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFavorite(instructorSlug, inst.name)}
                        className={cn(
                          "absolute top-4 right-4 p-2 rounded-full transition-all",
                          favorites.includes(instructorSlug) ? "bg-rose-500 text-white" : "bg-white/80 hover:bg-white",
                        )}
                      >
                        <Heart className={cn("h-5 w-5", favorites.includes(instructorSlug) && "fill-current")} />
                      </button>
                    </PremiumCard>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
            <SectionHeader
              title="Perguntas Frequentes"
              subtitle="Tudo o que você precisa saber sobre o catálogo Via Betel"
              centered
            />
            <ExpandableMenu items={FAQ_ITEMS.map((faq) => ({ title: faq.question, content: faq.answer }))} />
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

      <LoginGuardModal open={showLoginGuard} onOpenChange={setShowLoginGuard} feature={loginGuardFeature} />
    </>
  )
}
