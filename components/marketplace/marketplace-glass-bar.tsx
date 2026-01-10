"use client"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MarketplaceGlassBarProps {
  searchText: string
  selectedCity: string
  selectedState: string
  sortBy: string
  allCities: string[]
  allStates: string[]
  onSearchChange: (value: string) => void
  onCityChange: (value: string) => void
  onStateChange: (value: string) => void
  onSortChange: (value: string) => void
  onClearFilters: () => void
  onOpenFilters?: () => void
  className?: string
}

export function MarketplaceGlassBar({
  searchText,
  selectedCity,
  selectedState,
  sortBy,
  allCities,
  allStates,
  onSearchChange,
  onCityChange,
  onStateChange,
  onSortChange,
  onClearFilters,
  onOpenFilters,
  className,
}: MarketplaceGlassBarProps) {
  return (
    <div
      className={cn(
        "w-full max-w-5xl mx-auto",
        // Glass UI effect - iOS style
        "bg-white/10 backdrop-blur-md",
        "border border-white/20 rounded-2xl",
        "shadow-2xl shadow-black/10",
        "p-4 sm:p-6",
        className,
      )}
    >
      {/* Main search input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome, especialidade, localização..."
          className={cn(
            "w-full pl-12 pr-4 py-3.5 rounded-xl",
            "bg-white/20 backdrop-blur-sm",
            "border border-white/30",
            "text-white placeholder:text-white/60",
            "focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25",
            "transition-all duration-300",
          )}
        />
      </div>

      {/* Quick filters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* City select */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-lg",
              "bg-white/20 backdrop-blur-sm",
              "border border-white/30",
              "text-white text-sm",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "appearance-none cursor-pointer",
              "transition-all duration-300",
            )}
          >
            <option value="" className="text-gray-900 bg-white">
              Todas as cidades
            </option>
            {allCities.map((city) => (
              <option key={city} value={city} className="text-gray-900 bg-white">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* State select */}
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg",
            "bg-white/20 backdrop-blur-sm",
            "border border-white/30",
            "text-white text-sm",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            "appearance-none cursor-pointer",
            "transition-all duration-300",
          )}
        >
          <option value="" className="text-gray-900 bg-white">
            Todos os estados
          </option>
          {allStates.map((state) => (
            <option key={state} value={state} className="text-gray-900 bg-white">
              {state}
            </option>
          ))}
        </select>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg",
            "bg-white/20 backdrop-blur-sm",
            "border border-white/30",
            "text-white text-sm",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            "appearance-none cursor-pointer",
            "transition-all duration-300",
          )}
        >
          <option value="relevance" className="text-gray-900 bg-white">
            Mais relevantes
          </option>
          <option value="rating" className="text-gray-900 bg-white">
            Melhor avaliação
          </option>
          <option value="price-low" className="text-gray-900 bg-white">
            Menor preço
          </option>
          <option value="price-high" className="text-gray-900 bg-white">
            Maior preço
          </option>
          <option value="students" className="text-gray-900 bg-white">
            Mais alunos
          </option>
          <option value="experience" className="text-gray-900 bg-white">
            Mais experiente
          </option>
        </select>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className={cn(
              "flex-1 bg-white/15 backdrop-blur-sm",
              "border-white/30 text-white",
              "hover:bg-white/25",
              "transition-all duration-300",
            )}
          >
            Limpar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className={cn(
              "lg:hidden px-3",
              "bg-white/15 backdrop-blur-sm",
              "border-white/30 text-white",
              "hover:bg-white/25",
              "transition-all duration-300",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
