import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeChipProps {
  children: ReactNode
  className?: string
  variant?: "default" | "amber" | "teal"
}

/**
 * Badge/Chip estilo Home
 * Usado para tags, categorias, status
 */
export function BadgeChip({ children, className, variant = "default" }: BadgeChipProps) {
  const variantClass = {
    default: "from-emerald-400/20 to-teal-400/20 border-emerald-400/30 text-emerald-900",
    amber: "from-amber-400/20 to-amber-500/20 border-amber-400/30 text-amber-900",
    teal: "from-teal-400/20 to-cyan-400/20 border-teal-400/30 text-teal-900",
  }[variant]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 bg-gradient-to-r backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg text-sm font-medium",
        variantClass,
        className,
      )}
    >
      {children}
    </span>
  )
}
