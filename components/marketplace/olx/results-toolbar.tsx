"use client"

import { ChevronRight, Grid3X3, List } from "lucide-react"
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
    <div className="space-y-3">
      {/* Breadcrumb compacto */}
      <nav className="flex items-center gap-1 text-xs">
        <AppLink href="/" className="text-emerald-600 hover:underline">
          Brasil
        </AppLink>
        {selectedState && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{selectedState}</span>
          </>
        )}
        {selectedCity && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">{selectedCity}</span>
          </>
        )}
      </nav>

      {/* Card Localização destacado - igual OLX */}
      {(selectedCity || selectedState) && (
        <div className="p-3 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-900">Localização</span>
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">Novo</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedCity && selectedState ? `${selectedCity}, ${selectedState}` : selectedCity || selectedState}
            </span>
          </div>
        </div>
      )}

      {/* Título e contador */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">{getTitle()}</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {totalResults > 0 ? (
            <>
              {startResult} - {endResult} de {totalResults.toLocaleString()} resultados
            </>
          ) : (
            "Nenhum resultado encontrado"
          )}
        </p>
      </div>

      {/* Toolbar compacta - uma linha, altura 36px */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tipo de anúncio */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">Tipos de anúncio</span>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-9 text-xs border border-gray-200 rounded-lg px-2.5 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none min-w-[140px]"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600">Ordenar por</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 text-xs border border-gray-200 rounded-lg px-2.5 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none min-w-[140px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Toggle grid/list - compacto */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "h-9 w-9 flex items-center justify-center transition-colors",
              viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50",
            )}
            title="Lista"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "h-9 w-9 flex items-center justify-center transition-colors",
              viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50",
            )}
            title="Grade"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
