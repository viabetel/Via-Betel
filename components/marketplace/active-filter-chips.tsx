"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActiveFilter {
  label: string
  value: string
  onRemove: () => void
}

interface ActiveFilterChipsProps {
  filters: ActiveFilter[]
  onClearAll: () => void
  className?: string
}

export function ActiveFilterChips({ filters, onClearAll, className }: ActiveFilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-medium text-emerald-700">Filtros ativos:</span>
      {filters.map((filter, index) => (
        <button
          key={`${filter.value}-${index}`}
          onClick={filter.onRemove}
          className={cn(
            "inline-flex items-center gap-1.5",
            "px-3 py-1.5 rounded-full",
            "bg-emerald-100 text-emerald-800",
            "border border-emerald-300",
            "hover:bg-emerald-200 hover:border-emerald-400",
            "transition-all duration-200",
            "text-xs font-medium",
          )}
        >
          <span>{filter.label}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      ))}
      {filters.length > 1 && (
        <button onClick={onClearAll} className="text-xs font-medium text-red-600 hover:text-red-700 underline">
          Limpar todos
        </button>
      )}
    </div>
  )
}
