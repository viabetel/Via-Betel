"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MarketplaceFiltersSidebarProps {
  selectedCategory: string[]
  maxPrice: number
  minRating: number
  onlySponsored: boolean
  selectedSpecialties: string[]
  allSpecialties: string[]
  onCategoryChange: (categories: string[]) => void
  onPriceChange: (price: number) => void
  onRatingChange: (rating: number) => void
  onSponsoredChange: (value: boolean) => void
  onSpecialtiesChange: (specialties: string[]) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  onSaveSearch: () => void
  onShareSearch: () => void
  className?: string
}

export function MarketplaceFiltersSidebar({
  selectedCategory,
  maxPrice,
  minRating,
  onlySponsored,
  selectedSpecialties,
  allSpecialties,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onSponsoredChange,
  onSpecialtiesChange,
  onApplyFilters,
  onClearFilters,
  onSaveSearch,
  onShareSearch,
  className,
}: MarketplaceFiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["category", "price", "rating"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const categories = ["A", "B", "C", "D", "E"]
  const pricePresets = [
    { label: "Até R$ 150", value: 150 },
    { label: "Até R$ 200", value: 200 },
    { label: "Até R$ 300", value: 300 },
  ]
  const ratingOptions = [
    { label: "4.0+", value: 4.0 },
    { label: "4.5+", value: 4.5 },
    { label: "4.8+", value: 4.8 },
    { label: "5.0", value: 5.0 },
  ]

  const toggleCategory = (cat: string) => {
    if (selectedCategory.includes(cat)) {
      onCategoryChange(selectedCategory.filter((c) => c !== cat))
    } else {
      onCategoryChange([...selectedCategory, cat])
    }
  }

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      onSpecialtiesChange(selectedSpecialties.filter((s) => s !== spec))
    } else {
      onSpecialtiesChange([...selectedSpecialties, spec])
    }
  }

  return (
    <aside
      className={cn(
        "w-full lg:w-72 bg-white rounded-2xl shadow-lg border-2 border-emerald-100",
        "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto",
        "p-4 space-y-4",
        className,
      )}
    >
      <h2 className="text-lg font-bold text-emerald-900 pb-2 border-b-2 border-emerald-200">Filtros</h2>

      {/* Categoria CNH */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
        >
          <span>Categoria CNH</span>
          {expandedSections.includes("category") ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("category") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                    selectedCategory.includes(cat)
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                  )}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preço */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
        >
          <span>Preço máximo</span>
          {expandedSections.includes("price") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {expandedSections.includes("price") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="text-center text-sm font-medium text-emerald-700">Até R$ {maxPrice}</div>
              <div className="flex flex-wrap gap-2">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => onPriceChange(preset.value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      maxPrice === preset.value
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avaliação */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
        >
          <span>Avaliação mínima</span>
          {expandedSections.includes("rating") ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("rating") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRatingChange(option.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    minRating === option.value
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100",
                  )}
                >
                  ⭐ {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Especialidades */}
      {allSpecialties.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => toggleSection("specialties")}
            className="w-full flex items-center justify-between text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
          >
            <span>Especialidades</span>
            {expandedSections.includes("specialties") ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.includes("specialties") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 max-h-40 overflow-y-auto overflow-hidden"
              >
                {allSpecialties.slice(0, 10).map((spec) => (
                  <label
                    key={spec}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => toggleSpecialty(spec)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-sm text-emerald-900">{spec}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Verificado/Patrocinado */}
      <div className="space-y-2 pt-2 border-t-2 border-emerald-100">
        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-900">Somente patrocinados</span>
            <button className="text-emerald-600 hover:text-emerald-700" title="Instrutores destacados com selo premium">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="checkbox"
            checked={onlySponsored}
            onChange={(e) => onSponsoredChange(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded"
          />
        </label>
      </div>

      {/* Action buttons */}
      <div className="space-y-2 pt-4 border-t-2 border-emerald-200">
        <Button
          onClick={onApplyFilters}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
        >
          Aplicar Filtros
        </Button>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
        >
          Limpar Tudo
        </Button>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onSaveSearch}
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-emerald-700 hover:bg-emerald-50"
          >
            Salvar busca
          </Button>
          <Button
            onClick={onShareSearch}
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-emerald-700 hover:bg-emerald-50"
          >
            Compartilhar
          </Button>
        </div>
      </div>
    </aside>
  )
}
