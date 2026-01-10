"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart, GitCompare } from "lucide-react"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Search, MapPin, Star, Award, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { instructors } from "@/data/instructors-data"
import { extractCategories, parsePrice, parseRating, generateSlug } from "@/lib/instructor-utils"
import { Button } from "@/components/ui/button"
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

type SortOption = "relevance" | "rating" | "price-low" | "price-high" | "students" | "experience"

const FAQ_ITEMS = [
  {
    question: "Como peço orçamento?",
    answer:
      'Navegue pelo catálogo, escolha o instrutor que mais combina com você e clique em "Pedir Orçamento". Preencha o formulário e a Via Betel fará a intermediação, entrando em contato em até 24h.',
  },
  {
    question: "Por que não aparece contato direto do instrutor?",
    answer:
      "Por privacidade e segurança, mantemos o contato intermediado através do chat interno da Via Betel. Isso garante proteção de dados pessoais e permite que oferecemos suporte durante todo o processo.",
  },
  {
    question: "Em quanto tempo a Via Betel responde?",
    answer:
      "Nossa equipe responde pedidos de orçamento em até 24 horas úteis. Você receberá retorno no email cadastrado e poderá acompanhar tudo pelo chat interno da plataforma.",
  },
  {
    question: "Como funciona remarcação?",
    answer:
      "Após confirmar sua primeira aula, você pode remarcar através do chat da Via Betel com até 4 horas de antecedência sem custos. A plataforma facilita todo o processo de agendamento.",
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
  initialInstructors?: typeof instructors
}

export default function InstrutoresClient({ initialInstructors = instructors }: Props) {
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

  const [searchText, setSearchText] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  )
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "relevance")
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 200)
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0)
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "")
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(searchParams.get("neighborhood") || "")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.get("specialties")?.split(",").filter(Boolean) || [],
  )
  const [onlySponsored, setOnlySponsored] = useState(searchParams.get("sponsored") === "true")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const savedState = localStorage.getItem("marketplace-state")
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.searchText) setSearchText(state.searchText)
        if (state.selectedCategory) setSelectedCategory(state.selectedCategory)
        if (state.sortBy) setSortBy(state.sortBy)
        if (state.maxPrice) setMaxPrice(state.maxPrice)
        if (state.minRating) setMinRating(state.minRating)
        if (state.selectedCity) setSelectedCity(state.selectedCity)
        if (state.selectedState) setSelectedState(state.selectedState)
        if (state.selectedSpecialties) setSelectedSpecialties(state.selectedSpecialties)
        if (state.viewMode) setViewMode(state.viewMode)
      } catch (e) {
        console.error("[v0] Failed to parse saved marketplace state", e)
      }
    }
  }, [])

  useEffect(() => {
    const state = {
      searchText,
      selectedCategory,
      sortBy,
      maxPrice,
      minRating,
      selectedCity,
      selectedState,
      selectedSpecialties,
      viewMode,
      scrollY: window.scrollY,
    }
    localStorage.setItem("marketplace-state", JSON.stringify(state))
  }, [
    searchText,
    selectedCategory,
    sortBy,
    maxPrice,
    minRating,
    selectedCity,
    selectedState,
    selectedSpecialties,
    viewMode,
  ])

  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>()
    initialInstructors?.forEach((instructor) => {
      instructor.specialties?.forEach((s) => specialtiesSet.add(s))
    })
    return Array.from(specialtiesSet).sort()
  }, [initialInstructors])

  const allCities = useMemo(() => {
    const citiesSet = new Set(initialInstructors?.map((i) => i.city).filter(Boolean))
    return Array.from(citiesSet).sort()
  }, [initialInstructors])

  const allStates = useMemo(() => {
    const statesSet = new Set(initialInstructors?.map((i) => i.state).filter(Boolean))
    return Array.from(statesSet).sort()
  }, [initialInstructors])

  const filteredInstructors = useMemo(() => {
    let result = [...(initialInstructors || [])]

    if (searchText) {
      const search = searchText.toLowerCase()
      result = result.filter(
        (i) =>
          i.name?.toLowerCase().includes(search) ||
          i.bio?.toLowerCase().includes(search) ||
          i.specialties?.some((s) => s.toLowerCase().includes(search)) ||
          i.location?.toLowerCase().includes(search),
      )
    }

    if (selectedCategory.length > 0) {
      result = result.filter((i) => {
        const cats = extractCategories(i.role || "")
        return selectedCategory.some((cat) => cats.includes(cat))
      })
    }

    if (maxPrice < 200) {
      result = result.filter((i) => {
        const price = parsePrice(i.price || "")
        return price <= maxPrice
      })
    }

    if (minRating > 0) {
      result = result.filter((i) => {
        const rating = parseRating(i.rating || "0")
        return rating >= minRating
      })
    }

    if (selectedCity) {
      result = result.filter((i) => i.city === selectedCity)
    }

    if (selectedState) {
      result = result.filter((i) => i.state === selectedState)
    }

    if (selectedNeighborhood) {
      result = result.filter((i) => i.neighborhood?.toLowerCase().includes(selectedNeighborhood.toLowerCase()))
    }

    if (selectedSpecialties.length > 0) {
      result = result.filter((i) =>
        selectedSpecialties.some((spec) => i.specialties?.some((s) => s.toLowerCase().includes(spec.toLowerCase()))),
      )
    }

    if (onlySponsored) {
      result = result.filter((i) => i.isSponsored === true)
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => parseRating(b.rating || "0") - parseRating(a.rating || "0"))
        break
      case "price-low":
        result.sort((a, b) => parsePrice(a.price || "0") - parsePrice(b.price || "0"))
        break
      case "price-high":
        result.sort((a, b) => parsePrice(b.price || "0") - parsePrice(a.price || "0"))
        break
      case "students":
        result.sort((a, b) => (b.studentsApproved || 0) - (a.studentsApproved || 0))
        break
      case "experience":
        result.sort((a, b) => {
          const expA = Number.parseInt(a.experience || "0")
          const expB = Number.parseInt(b.experience || "0")
          return expB - expA
        })
        break
      case "relevance":
      default:
        // Relevância: patrocinados primeiro, depois rating
        result.sort((a, b) => {
          if (a.isSponsored && !b.isSponsored) return -1
          if (!a.isSponsored && b.isSponsored) return 1
          return parseRating(b.rating || "0") - parseRating(a.rating || "0")
        })
    }

    return result
  }, [
    initialInstructors,
    searchText,
    selectedCategory,
    maxPrice,
    minRating,
    selectedCity,
    selectedState,
    selectedNeighborhood,
    selectedSpecialties,
    onlySponsored,
    sortBy,
  ])

  const handleResetFilters = () => {
    setSearchText("")
    setSelectedCategory([])
    setSortBy("relevance")
    setMaxPrice(200)
    setMinRating(0)
    setSelectedCity("")
    setSelectedState("")
    setSelectedNeighborhood("")
    setSelectedSpecialties([])
    setOnlySponsored(false)
    router.push(pathname)
  }

  const handleShareSearch = () => {
    const params = new URLSearchParams()
    if (searchText) params.set("search", searchText)
    if (selectedCategory.length > 0) params.set("category", selectedCategory.join(","))
    if (sortBy !== "relevance") params.set("sort", sortBy)
    if (maxPrice < 200) params.set("maxPrice", maxPrice.toString())
    if (minRating > 0) params.set("minRating", minRating.toString())
    if (selectedCity) params.set("city", selectedCity)
    if (selectedState) params.set("state", selectedState)
    if (selectedSpecialties.length > 0) params.set("specialties", selectedSpecialties.join(","))
    if (onlySponsored) params.set("sponsored", "true")

    const url = `${window.location.origin}${pathname}?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Link da busca copiado! Compartilhe com seus amigos.")
    })
  }

  const handleSaveSearch = () => {
    if (!user) {
      setLoginGuardFeature("salvar busca")
      setShowLoginGuard(true)
      return
    }
    // TODO: Salvar no Supabase quando tabela existir
    const savedSearches = JSON.parse(localStorage.getItem("saved-searches") || "[]")
    const newSearch = {
      id: Date.now(),
      name: `Busca ${new Date().toLocaleDateString()}`,
      filters: {
        searchText,
        selectedCategory,
        sortBy,
        maxPrice,
        minRating,
        selectedCity,
        selectedState,
        selectedSpecialties,
      },
      createdAt: new Date().toISOString(),
    }
    savedSearches.push(newSearch)
    localStorage.setItem("saved-searches", JSON.stringify(savedSearches))
    alert("Busca salva com sucesso!")
  }

  const handleFavorite = (instructorId: string) => {
    if (!user) {
      setLoginGuardFeature("favoritar")
      setShowLoginGuard(true)
      return
    }
    toggleFavorite(instructorId)
  }

  const handleCompare = (instructorId: string) => {
    if (!user) {
      setLoginGuardFeature("comparar")
      setShowLoginGuard(true)
      return
    }
    if (compareList.length >= 3 && !compareList.includes(instructorId)) {
      alert("Você pode comparar no máximo 3 instrutores por vez.")
      return
    }
    toggleCompare(instructorId)
  }

  return (
    <>
      <motion.section
        ref={heroRef}
        className="relative min-h-[65vh] sm:min-h-[75vh] lg:min-h-[480px] flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary-darkest)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-secondary-dark)] text-[var(--color-brand-text-light)] overflow-hidden"
      >
        {/* Fixed HeaderContent no topo do hero */}
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
                {filteredInstructors.length} instrutores encontrados
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
              <span className="block text-balance">Encontre instrutores </span>
              <span className="bg-gradient-to-r from-[var(--color-brand-accent-light)] via-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] bg-clip-text text-transparent drop-shadow-lg">
                certificados
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
                Compare, favorite e escolha o melhor instrutor para sua CNH. Use os filtros abaixo para encontrar
                exatamente o que precisa.
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{
                y: shouldDisableMotion ? 0 : buttonsY,
              }}
              className="mx-auto max-w-4xl w-full"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200/20 p-6 space-y-4">
                {/* Busca principal */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, especialidade, localização..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Filtros rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900"
                  >
                    <option value="">Todas as cidades</option>
                    {allCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900"
                  >
                    <option value="">Todos os estados</option>
                    {allStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="rating">Melhor avaliação</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="students">Mais aprovados</option>
                    <option value="experience">Mais experiente</option>
                  </select>

                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                  >
                    Limpar filtros
                  </Button>
                </div>

                {/* Ações premium */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <Button
                    onClick={handleSaveSearch}
                    variant="ghost"
                    size="sm"
                    className="text-emerald-700 hover:bg-emerald-50"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Salvar busca
                  </Button>
                  <Button
                    onClick={handleShareSearch}
                    variant="ghost"
                    size="sm"
                    className="text-emerald-700 hover:bg-emerald-50"
                  >
                    Compartilhar
                  </Button>
                  <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      checked={onlySponsored}
                      onChange={(e) => setOnlySponsored(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Somente patrocinados
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Breadcrumb */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Instrutores", href: "/instrutores" },
                ]}
              />
            </motion.div>
          </motion.div>
        </div>

        <div ref={heroEndRef} className="absolute bottom-0 left-0 w-full h-1" />
      </motion.section>

      {/* Lista de instrutores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => (
              <PremiumCard key={instructor.id} hover shadow="md" className="relative">
                {instructor.isSponsored && (
                  <BadgeChip variant="premium" className="absolute top-4 right-4 z-10">
                    Patrocinado
                  </BadgeChip>
                )}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={instructor.photo || "/placeholder.svg?height=64&width=64"}
                        alt={instructor.name || "Instrutor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                      <p className="text-sm text-gray-600">{instructor.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFavorite(instructor.id)}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          favorites.includes(instructor.id)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500",
                        )}
                      >
                        <Heart className={cn("h-4 w-4", favorites.includes(instructor.id) && "fill-current")} />
                      </button>
                      <button
                        onClick={() => handleCompare(instructor.id)}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          compareList.includes(instructor.id)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500",
                        )}
                      >
                        <GitCompare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>{instructor.studentsApproved} aprovados</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{instructor.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties?.slice(0, 3).map((spec, idx) => (
                      <BadgeChip key={idx} variant="secondary" size="sm">
                        {spec}
                      </BadgeChip>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">A partir de</p>
                      <p className="text-xl font-bold text-emerald-700">{instructor.price}</p>
                    </div>
                    <Link href={`/instrutores/${generateSlug(instructor.name || "")}`}>
                      <Button>Ver perfil</Button>
                    </Link>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum instrutor encontrado com os filtros aplicados.</p>
              <Button onClick={handleResetFilters} className="mt-4">
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader
            title="Perguntas Frequentes"
            subtitle="Tire suas dúvidas sobre como funciona o marketplace Via Betel"
          />
          <div className="mt-8">
            <ExpandableMenu items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Comparar ({compareList.length}/3)</h3>
            <Button onClick={clearCompare} variant="ghost" size="sm">
              Limpar
            </Button>
          </div>
          <Button className="w-full" disabled={compareList.length < 2}>
            Comparar agora
          </Button>
        </div>
      )}

      <LoginGuardModal
        open={showLoginGuard}
        onClose={() => setShowLoginGuard(false)}
        feature={loginGuardFeature}
        returnTo={`${pathname}?${searchParams.toString()}`}
      />
    </>
  )
}
