"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { ChevronDown, ChevronLeft, MapPin, X, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BRAZIL_STATES, getCitiesByState } from "@/data/brazil-locations"

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

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
  className?: string
}

function CustomSelect({ value, onChange, options, placeholder, disabled, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-8 px-2.5 text-[11px] border rounded-lg bg-white flex items-center justify-between gap-1 transition-all duration-200",
          disabled
            ? "cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200"
            : "cursor-pointer hover:border-emerald-400 hover:shadow-sm",
          isOpen ? "border-emerald-500 ring-2 ring-emerald-100 shadow-sm" : "border-gray-200",
          value ? "text-gray-900 font-medium" : "text-gray-500",
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute left-0 right-0 mt-1 z-50",
            "bg-white border border-gray-200 rounded-lg shadow-lg",
            "max-h-48 overflow-y-auto",
            "animate-in fade-in-0 slide-in-from-top-2 duration-200",
            "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full",
          )}
          style={{ top: "100%" }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "w-full px-2.5 py-2 text-left text-[11px] flex items-center justify-between gap-2 transition-colors",
                index === 0 && "rounded-t-lg",
                index === options.length - 1 && "rounded-b-lg",
                option.value === value
                  ? "bg-gradient-to-r from-emerald-50 to-amber-50 text-emerald-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700",
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <Check className="w-3 h-3 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
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
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "location",
    "category",
    "price",
    "rating",
    "availability",
  ])
  const [priceFrom, setPriceFrom] = useState("")
  const [priceTo, setPriceTo] = useState(maxPrice.toString())

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const availableCities = useMemo(() => {
    if (selectedState) {
      return getCitiesByState(selectedState)
    }
    return []
  }, [selectedState])

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

  const hasLocationFilter = selectedCity || selectedState

  const handlePriceApply = () => {
    const to = Number(priceTo) || 300
    onPriceChange(to)
  }

  const handleStateChange = (state: string) => {
    onStateChange(state)
    onCityChange("")
  }

  const stateOptions = [
    { value: "", label: "Todos os estados" },
    ...BRAZIL_STATES.map((state) => ({ value: state.sigla, label: `${state.nome} (${state.sigla})` })),
  ]

  const cityOptions = [
    { value: "", label: selectedState ? "Todas as cidades" : "Selecione um estado" },
    ...availableCities.map((city) => ({ value: city, label: city })),
  ]

  return (
    <aside
      className={cn(
        "flex-shrink-0 bg-white",
        "md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto",
        "[&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-emerald-300",
        className,
      )}
    >
      <div className="px-4 py-2.5 space-y-0.5">
        <button className="flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-600 hover:underline transition-colors">
          <ChevronLeft className="w-3 h-3" />
          <span>Início</span>
        </button>
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <ChevronLeft className="w-3 h-3" />
          <span>Marketplace</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Instrutores
          </span>
        </div>
      </div>

      <div className="mx-4 mb-3 p-4 border border-emerald-200 rounded-xl bg-gradient-to-br from-white to-emerald-50/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-sm">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Localização</span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-bold rounded-full shadow-sm">
              Novo
            </span>
          </div>
          {hasLocationFilter && (
            <button
              onClick={() => {
                onCityChange("")
                onStateChange("")
              }}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-emerald-600 uppercase mb-1.5 block tracking-wide">
              Estado
            </label>
            <CustomSelect
              value={selectedState}
              onChange={handleStateChange}
              options={stateOptions}
              placeholder="Todos os estados"
              className="[&_button]:h-9 [&_button]:text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-emerald-600 uppercase mb-1.5 block tracking-wide">
              Cidade
            </label>
            <CustomSelect
              value={selectedCity}
              onChange={onCityChange}
              options={cityOptions}
              placeholder={selectedState ? "Todas as cidades" : "Selecione um estado"}
              disabled={!selectedState}
              className="[&_button]:h-9 [&_button]:text-xs"
            />
          </div>

          {hasLocationFilter && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-100 to-amber-50 border border-emerald-200 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-medium text-emerald-700">
                {selectedCity && selectedState
                  ? `${selectedCity}, ${selectedState}`
                  : selectedState
                    ? BRAZIL_STATES.find((s) => s.sigla === selectedState)?.nome || selectedState
                    : selectedCity}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {/* Verificados */}
        <div className="p-3.5 border border-emerald-100 rounded-xl bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-900">Verificados</span>
            </div>
            <div
              className={cn(
                "w-10 h-5 rounded-full transition-all relative cursor-pointer shadow-inner",
                onlyVerified ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gray-200",
              )}
              onClick={() => onVerifiedChange(!onlyVerified)}
            >
              <div
                className={cn(
                  "absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform",
                  onlyVerified ? "translate-x-[22px]" : "translate-x-[3px]",
                )}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight mt-1.5 ml-7">Documentação verificada pela Via Betel</p>
        </div>

        {/* Categoria CNH */}
        <div className="p-3.5 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all">
          <button
            onClick={() => toggleSection("category")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2 group"
          >
            <span className="group-hover:text-emerald-600 transition-colors">Categoria CNH</span>
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                expandedSections.includes("category") ? "bg-emerald-100 rotate-180" : "bg-gray-100",
              )}
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  expandedSections.includes("category") ? "text-emerald-600" : "text-gray-500",
                )}
              />
            </div>
          </button>
          {expandedSections.includes("category") && (
            <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-bold transition-all duration-200",
                    selectedCategory.includes(cat)
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preço por aula */}
        <div className="p-3.5 border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2 group"
          >
            <span className="group-hover:text-amber-600 transition-colors">Preço por aula</span>
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                expandedSections.includes("price") ? "bg-amber-100 rotate-180" : "bg-gray-100",
              )}
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  expandedSections.includes("price") ? "text-amber-600" : "text-gray-500",
                )}
              />
            </div>
          </button>
          {expandedSections.includes("price") && (
            <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="De"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                />
                <input
                  type="number"
                  placeholder="Até"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                />
                <button
                  onClick={handlePriceApply}
                  className="h-9 w-9 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 shadow-sm transition-all"
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
                className="w-full h-2 appearance-none bg-gray-200 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">R$ 50</span>
                <span className="font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Até R$ {maxPrice}
                </span>
                <span className="text-gray-500">R$ 300</span>
              </div>
            </div>
          )}
        </div>

        {/* Avaliação mínima */}
        <div className="p-3.5 border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all">
          <button
            onClick={() => toggleSection("rating")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2 group"
          >
            <span className="group-hover:text-amber-600 transition-colors">Avaliação mínima</span>
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                expandedSections.includes("rating") ? "bg-amber-100 rotate-180" : "bg-gray-100",
              )}
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  expandedSections.includes("rating") ? "text-amber-600" : "text-gray-500",
                )}
              />
            </div>
          </button>
          {expandedSections.includes("rating") && (
            <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRatingChange(minRating === option.value ? 0 : option.value)}
                  className={cn(
                    "h-8 px-3 rounded-lg text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5",
                    minRating === option.value
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700 border border-gray-200 hover:border-amber-300",
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
        <div className="p-3.5 border border-gray-100 rounded-xl hover:border-teal-200 hover:shadow-sm transition-all">
          <button
            onClick={() => toggleSection("availability")}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 mb-2 group"
          >
            <span className="group-hover:text-teal-600 transition-colors">Disponibilidade</span>
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                expandedSections.includes("availability") ? "bg-teal-100 rotate-180" : "bg-gray-100",
              )}
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  expandedSections.includes("availability") ? "text-teal-600" : "text-gray-500",
                )}
              />
            </div>
          </button>
          {expandedSections.includes("availability") && (
            <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((avail) => (
                  <button
                    key={avail}
                    onClick={() => toggleAvailability(avail)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[11px] font-medium transition-all duration-200",
                      selectedAvailability.includes(avail)
                        ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-700 border border-gray-200 hover:border-teal-300",
                    )}
                  >
                    {avail}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-2">Turno preferido:</p>
                <div className="flex flex-wrap gap-2">
                  {turnoOptions.map((turno) => (
                    <button
                      key={turno}
                      onClick={() => toggleTurno(turno)}
                      className={cn(
                        "h-8 px-3 rounded-lg text-[11px] font-medium transition-all duration-200",
                        selectedTurno.includes(turno)
                          ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-700 border border-gray-200 hover:border-teal-300",
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

        {/* Patrocinados */}
        <div className="p-3.5 border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">★</span>
              </div>
              <span className="text-xs font-semibold text-gray-900">Patrocinados</span>
            </div>
            <div
              className={cn(
                "w-10 h-5 rounded-full transition-all relative cursor-pointer shadow-inner",
                onlySponsored ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gray-200",
              )}
              onClick={() => onSponsoredChange(!onlySponsored)}
            >
              <div
                className={cn(
                  "absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform",
                  onlySponsored ? "translate-x-[22px]" : "translate-x-[3px]",
                )}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight mt-1.5 ml-7">Destaque no topo dos resultados</p>
        </div>

        {/* Botões de ação */}
        <div className="pt-3 pb-4 space-y-2">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full h-10 text-xs font-medium border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all bg-transparent"
          >
            Limpar todos os filtros
          </Button>
          {onApplyFilters && (
            <Button
              onClick={onApplyFilters}
              className="w-full h-10 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
            >
              Aplicar filtros
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
