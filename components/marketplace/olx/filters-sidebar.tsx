"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, Info, MapPin, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FiltersSidebarProps {
  selectedCity: string
  selectedState: string
  allCities: string[]
  allStates: string[]
  onCityChange: (city: string) => void
  onStateChange: (state: string) => void
  selectedCategory: string[]
  onCategoryChange: (categories: string[]) => void
  maxPrice: number
  onPriceChange: (price: number) => void
  minRating: number
  onRatingChange: (rating: number) => void
  selectedAvailability: string[]
  onAvailabilityChange: (availability: string[]) => void
  selectedTurno: string[]
  onTurnoChange: (turno: string[]) => void
  onlyVerified: boolean
  onVerifiedChange: (value: boolean) => void
  onlySponsored: boolean
  onSponsoredChange: (value: boolean) => void
  onClearFilters: () => void
  onApplyFilters?: () => void
  className?: string
}

export function FiltersSidebar({
  selectedCity,
  selectedState,
  allCities,
  allStates,
  onCityChange,
  onStateChange,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedTurno,
  onTurnoChange,
  onlyVerified,
  onVerifiedChange,
  onlySponsored,
  onSponsoredChange,
  onClearFilters,
  onApplyFilters,
  className,
}: FiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["category", "price", "rating", "availability"])
  const [locationSearch, setLocationSearch] = useState("")
  const [priceFrom, setPriceFrom] = useState("")
  const [priceTo, setPriceTo] = useState(maxPrice.toString())

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const categories = ["A", "B", "C", "D", "E"]
  const ratingOptions = [
    { label: "4.0+", value: 4.0 },
    { label: "4.5+", value: 4.5 },
    { label: "4.8+", value: 4.8 },
  ]
  const availabilityOptions = ["Hoje", "Esta semana"]
  const turnoOptions = ["Manhã", "Tarde", "Noite", "Fim de semana"]

  const toggleCategory = (cat: string) => {
    if (selectedCategory.includes(cat)) {
      onCategoryChange(selectedCategory.filter((c) => c !== cat))
    } else {
      onCategoryChange([...selectedCategory, cat])
    }
  }

  const toggleAvailability = (avail: string) => {
    if (selectedAvailability.includes(avail)) {
      onAvailabilityChange(selectedAvailability.filter((a) => a !== avail))
    } else {
      onAvailabilityChange([...selectedAvailability, avail])
    }
  }

  const toggleTurno = (turno: string) => {
    if (selectedTurno.includes(turno)) {
      onTurnoChange(selectedTurno.filter((t) => t !== turno))
    } else {
      onTurnoChange([...selectedTurno, turno])
    }
  }

  const filteredCities = locationSearch
    ? allCities.filter((c) => c.toLowerCase().includes(locationSearch.toLowerCase()))
    : allCities

  const filteredStates = locationSearch
    ? allStates.filter((s) => s.toLowerCase().includes(locationSearch.toLowerCase()))
    : allStates

  const hasLocationFilter = selectedCity || selectedState

  const handlePriceApply = () => {
    const to = Number(priceTo) || 300
    onPriceChange(to)
  }

  return (
    <aside
      className={cn(
        "flex-shrink-0 bg-white",
        "lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto",
        className,
      )}
    >
      {/* Mini breadcrumb estilo OLX */}
      <div className="px-4 py-3 space-y-1">
        <button className="flex items-center gap-1 text-xs text-emerald-600 hover:underline">
          <ChevronLeft className="w-3 h-3" />
          <span>Início</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ChevronLeft className="w-3 h-3" />
          <span>Marketplace</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">Instrutores</span>
        </div>
      </div>

      {/* Card Localização estilo OLX */}
      <div className="mx-4 mb-3 p-3 border border-gray-200 rounded-xl bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-900">Localização</span>
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">Novo</span>
          </div>
          {hasLocationFilter && (
            <button
              onClick={() => {
                onCityChange("")
                onStateChange("")
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasLocationFilter ? (
          <div className="h-9 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
            {selectedCity && selectedState ? `${selectedCity}, ${selectedState}` : selectedCity || selectedState}
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cidade ou estado..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full h-9 px-3 pr-8 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {locationSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredStates.slice(0, 3).map((state) => (
                  <button
                    key={state}
                    onClick={() => {
                      onStateChange(state)
                      setLocationSearch("")
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                  >
                    {state}
                  </button>
                ))}
                {filteredCities.slice(0, 5).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onCityChange(city)
                      setLocationSearch("")
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filtros empilhados em cards */}
      <div className="px-4 space-y-3">
        {/* Verificados toggle */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-900">Verificados</span>
            <div
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative cursor-pointer",
                onlyVerified ? "bg-emerald-600" : "bg-gray-200",
              )}
              onClick={() => onVerifiedChange(!onlyVerified)}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  onlyVerified ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">Instrutores com documentação verificada</p>
        </div>

        {/* Categoria CNH */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <button
            onClick={() => toggleSection("category")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2"
          >
            <span>Categoria CNH</span>
            {expandedSections.includes("category") ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          {expandedSections.includes("category") && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "h-7 px-3 rounded-lg text-xs font-semibold transition-all",
                    selectedCategory.includes(cat)
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2"
          >
            <span>Preço por aula</span>
            {expandedSections.includes("price") ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          {expandedSections.includes("price") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="De"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="flex-1 h-9 px-2.5 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Até"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="flex-1 h-9 px-2.5 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handlePriceApply}
                  className="h-9 w-9 flex items-center justify-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => {
                  onPriceChange(Number(e.target.value))
                  setPriceTo(e.target.value)
                }}
                className="w-full accent-emerald-600 h-1"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>R$ 50</span>
                <span className="text-emerald-600 font-medium">Até R$ {maxPrice}</span>
                <span>R$ 300</span>
              </div>
            </div>
          )}
        </div>

        {/* Avaliação */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <button
            onClick={() => toggleSection("rating")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2"
          >
            <span>Avaliação mínima</span>
            {expandedSections.includes("rating") ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          {expandedSections.includes("rating") && (
            <div className="flex flex-wrap gap-1.5">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRatingChange(minRating === option.value ? 0 : option.value)}
                  className={cn(
                    "h-7 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                    minRating === option.value
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
                  )}
                >
                  <span className={minRating === option.value ? "text-white" : "text-amber-500"}>★</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Disponibilidade */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <button
            onClick={() => toggleSection("availability")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2"
          >
            <span>Disponibilidade</span>
            {expandedSections.includes("availability") ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          {expandedSections.includes("availability") && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                {availabilityOptions.map((avail) => (
                  <button
                    key={avail}
                    onClick={() => toggleAvailability(avail)}
                    className={cn(
                      "h-7 px-2.5 rounded-lg text-xs font-medium transition-all border",
                      selectedAvailability.includes(avail)
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200",
                    )}
                  >
                    {avail}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] font-medium text-gray-500 uppercase">Turno</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {turnoOptions.map((turno) => (
                    <button
                      key={turno}
                      onClick={() => toggleTurno(turno)}
                      className={cn(
                        "h-7 px-2.5 rounded-lg text-xs font-medium transition-all border",
                        selectedTurno.includes(turno)
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200",
                      )}
                    >
                      {turno}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Somente destaques */}
        <div className="p-3 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-900">Somente destaques</span>
              <button className="text-gray-400 hover:text-gray-600" title="Instrutores em destaque">
                <Info className="w-3 h-3" />
              </button>
            </div>
            <div
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative cursor-pointer",
                onlySponsored ? "bg-amber-500" : "bg-gray-200",
              )}
              onClick={() => onSponsoredChange(!onlySponsored)}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  onlySponsored ? "translate-x-4" : "translate-x-0.5",
                )}
              />
            </div>
          </div>
        </div>

        {/* Botões Aplicar/Limpar */}
        <div className="flex gap-2 pt-2 pb-4">
          {onApplyFilters && (
            <Button
              onClick={onApplyFilters}
              className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Aplicar
            </Button>
          )}
          <Button
            onClick={onClearFilters}
            variant="outline"
            className={cn(
              "h-9 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold bg-transparent",
              onApplyFilters ? "flex-1" : "w-full",
            )}
          >
            Limpar filtros
          </Button>
        </div>
      </div>
    </aside>
  )
}
