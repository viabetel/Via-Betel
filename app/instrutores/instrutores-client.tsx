"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

import { useState, useMemo, useEffect } from "react"
import { instructors } from "@/data/instructors-data"
import { extractCategories, parsePrice, parseRating, generateSlug } from "@/lib/instructor-utils"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/components/header-content"
import { SectionHeader } from "@/components/ui/section-header"
import { ExpandableMenu } from "@/components/ui/expandable-menu"
import { useMarketplaceSync } from "@/hooks/use-marketplace-sync"
import { LoginGuardModal } from "@/components/auth/login-guard-modal"
import { useAuth } from "@/lib/auth-context"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { useIsDesktop } from "@/hooks/use-media-query"

import { FiltersSidebar } from "@/components/marketplace/olx/filters-sidebar"
import { ResultsToolbar } from "@/components/marketplace/olx/results-toolbar"
import { InstructorCard } from "@/components/marketplace/olx/instructor-card"
import { SafetyTipBanner } from "@/components/marketplace/olx/safety-tip-banner"

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
  const { favorites, toggleFavorite } = useMarketplaceSync()

  const isDesktop = useIsDesktop()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const [showLoginGuard, setShowLoginGuard] = useState(false)
  const [loginGuardFeature, setLoginGuardFeature] = useState<"favoritar" | "comparar" | "salvar busca">("favoritar")

  const [searchText, setSearchText] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  )
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "relevance")
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 200)
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0)
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "")
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "")
  const [onlySponsored, setOnlySponsored] = useState(searchParams.get("sponsored") === "true")
  const [onlyVerified, setOnlyVerified] = useState(searchParams.get("verified") === "true")
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    searchParams.get("availability")?.split(",").filter(Boolean) || [],
  )
  const [selectedTurno, setSelectedTurno] = useState<string[]>(
    searchParams.get("turno")?.split(",").filter(Boolean) || [],
  )
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)

  useEffect(() => {
    if (isDesktop && showFiltersDrawer) {
      setShowFiltersDrawer(false)
    }
  }, [isDesktop, showFiltersDrawer])

  useEffect(() => {
    const savedState = localStorage.getItem("marketplace-state")
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.viewMode) setViewMode(state.viewMode)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    const state = { viewMode }
    localStorage.setItem("marketplace-state", JSON.stringify(state))

    const params = new URLSearchParams()
    if (searchText) params.set("search", searchText)
    if (selectedCategory.length > 0) params.set("category", selectedCategory.join(","))
    if (sortBy !== "relevance") params.set("sort", sortBy)
    if (maxPrice < 200) params.set("maxPrice", maxPrice.toString())
    if (minRating > 0) params.set("minRating", minRating.toString())
    if (selectedCity) params.set("city", selectedCity)
    if (selectedState) params.set("state", selectedState)
    if (onlySponsored) params.set("sponsored", "true")
    if (onlyVerified) params.set("verified", "true")
    if (selectedAvailability.length > 0) params.set("availability", selectedAvailability.join(","))
    if (selectedTurno.length > 0) params.set("turno", selectedTurno.join(","))
    if (selectedType !== "all") params.set("type", selectedType)

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [
    searchText,
    selectedCategory,
    sortBy,
    maxPrice,
    minRating,
    selectedCity,
    selectedState,
    onlySponsored,
    onlyVerified,
    selectedAvailability,
    selectedTurno,
    selectedType,
    viewMode,
    pathname,
    router,
  ])

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

    if (onlySponsored) {
      result = result.filter((i) => i.isSponsored === true)
    }

    if (onlyVerified) {
      result = result.filter((i) => i.isVerified === true)
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
    onlySponsored,
    onlyVerified,
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
    setOnlySponsored(false)
    setOnlyVerified(false)
    setSelectedAvailability([])
    setSelectedTurno([])
    setSelectedType("all")
    router.push(pathname)
  }

  const handleFavorite = (instructorId: string) => {
    if (!user) {
      setLoginGuardFeature("favoritar")
      setShowLoginGuard(true)
      return
    }
    toggleFavorite(instructorId)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <HeaderContent variant="hero" />
        </div>
      </header>

      <div className="h-16" />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="hidden md:block w-72 flex-shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <FiltersSidebar
                selectedCity={selectedCity}
                selectedState={selectedState}
                allCities={allCities}
                allStates={allStates}
                onCityChange={setSelectedCity}
                onStateChange={setSelectedState}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                minRating={minRating}
                onRatingChange={setMinRating}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
                selectedTurno={selectedTurno}
                onTurnoChange={setSelectedTurno}
                onlyVerified={onlyVerified}
                onVerifiedChange={setOnlyVerified}
                onlySponsored={onlySponsored}
                onSponsoredChange={setOnlySponsored}
                onClearFilters={handleResetFilters}
              />
            </aside>

            <main className="flex-1 min-w-0 space-y-3">
              <ResultsToolbar
                selectedCity={selectedCity}
                selectedState={selectedState}
                totalResults={filteredInstructors.length}
                currentPage={1}
                resultsPerPage={20}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                sortBy={sortBy}
                onSortChange={(value) => setSortBy(value as SortOption)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <SafetyTipBanner />

              <Button
                onClick={() => setShowFiltersDrawer(true)}
                variant="outline"
                className="w-full h-9 justify-center gap-2 border-emerald-200 text-emerald-700 bg-white text-xs md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </Button>

              {filteredInstructors.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
                      : "flex flex-col gap-2",
                  )}
                >
                  {filteredInstructors.map((instructor) => {
                    const categories = extractCategories(instructor.role || "")
                    const slug = generateSlug(instructor.name || "", instructor.city || "")
                    const isFavorited = favorites.includes(instructor.id)

                    return (
                      <InstructorCard
                        key={instructor.id}
                        instructor={instructor}
                        categories={categories}
                        slug={slug}
                        isFavorited={isFavorited}
                        onFavorite={() => handleFavorite(instructor.id)}
                        viewMode={viewMode}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Nenhum instrutor encontrado com os filtros aplicados.</p>
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    size="sm"
                    className="border-emerald-600 text-emerald-700 bg-transparent text-xs"
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6 max-w-4xl">
            <SectionHeader
              title="Perguntas Frequentes"
              subtitle="Tire suas dúvidas sobre como funciona o marketplace Via Betel"
            />
            <div className="mt-6">
              <ExpandableMenu items={FAQ_ITEMS} />
            </div>
          </div>
        </section>
      </div>

      <Sheet open={showFiltersDrawer} onOpenChange={setShowFiltersDrawer}>
        <SheetContent side="bottom" className="h-[85vh] p-0 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Filtros</h2>
              <Button onClick={() => setShowFiltersDrawer(false)} variant="ghost" size="sm" className="h-8 text-xs">
                Fechar
              </Button>
            </div>
            <FiltersSidebar
              selectedCity={selectedCity}
              selectedState={selectedState}
              allCities={allCities}
              allStates={allStates}
              onCityChange={setSelectedCity}
              onStateChange={setSelectedState}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
              minRating={minRating}
              onRatingChange={setMinRating}
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={setSelectedAvailability}
              selectedTurno={selectedTurno}
              onTurnoChange={setSelectedTurno}
              onlyVerified={onlyVerified}
              onVerifiedChange={setOnlyVerified}
              onlySponsored={onlySponsored}
              onSponsoredChange={setOnlySponsored}
              onClearFilters={handleResetFilters}
              onApplyFilters={() => setShowFiltersDrawer(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <LoginGuardModal
        isOpen={showLoginGuard}
        onClose={() => setShowLoginGuard(false)}
        feature={loginGuardFeature}
        currentPath={pathname}
      />
    </>
  )
}
