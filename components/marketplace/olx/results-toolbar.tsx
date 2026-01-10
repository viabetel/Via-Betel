"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, Grid3X3, List, ChevronDown, Check } from "lucide-react"
import { AppLink } from "@/components/app-link"
import { cn } from "@/lib/utils"

interface ResultsToolbarProps {
  selectedCity: string
  selectedState: string
  totalResults: number
  currentPage: number
  resultsPerPage: number
  selectedType: string
  onTypeChange: (type: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

interface ToolbarSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

function ToolbarSelect({ label, value, onChange, options }: ToolbarSelectProps) {
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

  const selectedLabel = options.find((opt) => opt.value === value)?.label || label

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-500 font-medium">{label}</span>
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-8 px-2.5 text-[11px] border rounded-lg bg-white flex items-center gap-1.5 min-w-[120px] justify-between transition-all duration-200",
            isOpen
              ? "border-emerald-400 ring-2 ring-emerald-100 shadow-sm"
              : "border-gray-200 hover:border-emerald-300 hover:shadow-sm",
          )}
        >
          <span className="truncate font-medium text-gray-700">{selectedLabel}</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute left-0 mt-1 z-50 min-w-full",
              "bg-white border border-gray-200 rounded-lg shadow-lg",
              "animate-in fade-in-0 slide-in-from-top-2 duration-200",
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
                  "w-full px-3 py-2 text-left text-[11px] flex items-center justify-between gap-2 transition-colors whitespace-nowrap",
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
    </div>
  )
}

export function ResultsToolbar({
  selectedCity,
  selectedState,
  totalResults,
  currentPage,
  resultsPerPage,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ResultsToolbarProps) {
  const typeOptions = [
    { label: "Todos os anúncios", value: "all" },
    { label: "Instrutores", value: "instructor" },
    { label: "Pacotes", value: "packages" },
    { label: "Simulador", value: "simulator" },
  ]

  const sortOptions = [
    { label: "Mais Relevantes", value: "relevance" },
    { label: "Melhor avaliação", value: "rating" },
    { label: "Menor preço", value: "price-low" },
    { label: "Maior preço", value: "price-high" },
  ]

  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  const getTitle = () => {
    if (selectedCity && selectedState) {
      return `Instrutores em ${selectedCity}, ${selectedState}`
    }
    if (selectedCity) {
      return `Instrutores em ${selectedCity}`
    }
    if (selectedState) {
      return `Instrutores em ${selectedState}`
    }
    return "Instrutores"
  }

  return (
    <div className="space-y-2">
      <nav className="flex items-center gap-1 text-[10px]">
        <AppLink
          href="/"
          className="text-emerald-500 hover:text-emerald-600 hover:underline font-medium transition-colors"
        >
          Brasil
        </AppLink>
        {selectedState && (
          <>
            <ChevronRight className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-gray-600 font-medium">{selectedState}</span>
          </>
        )}
        {selectedCity && (
          <>
            <ChevronRight className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-gray-600 font-medium">{selectedCity}</span>
          </>
        )}
      </nav>

      {(selectedCity || selectedState) && (
        <div className="p-2.5 bg-gradient-to-r from-white to-emerald-50/50 border border-emerald-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-semibold text-gray-900">Localização</span>
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[8px] font-bold rounded-full">
              Novo
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {selectedCity && selectedState ? `${selectedCity}, ${selectedState}` : selectedCity || selectedState}
          </span>
        </div>
      )}

      <div>
        <h1 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {getTitle()}
        </h1>
        <p className="text-[10px] text-gray-500">
          {totalResults > 0 ? (
            <>
              <span className="font-semibold text-emerald-600">
                {startResult} - {endResult}
              </span>{" "}
              de <span className="font-semibold text-amber-600">{totalResults.toLocaleString()}</span> resultados
            </>
          ) : (
            "Nenhum resultado encontrado"
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
        <ToolbarSelect label="Tipos de anúncio" value={selectedType} onChange={onTypeChange} options={typeOptions} />

        <ToolbarSelect label="Ordenar por" value={sortBy} onChange={onSortChange} options={sortOptions} />

        <div className="flex-1" />

        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "h-8 w-8 flex items-center justify-center transition-all duration-200",
              viewMode === "list"
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                : "bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600",
            )}
            title="Lista"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "h-8 w-8 flex items-center justify-center transition-all duration-200",
              viewMode === "grid"
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                : "bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600",
            )}
            title="Grade"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
