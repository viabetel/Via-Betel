"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PremiumCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

/**
 * Card premium estilo Home
 * Base para todos os cards do projeto
 */
export function PremiumCard({ children, className, hover = true, gradient = false }: PremiumCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl bg-white shadow-xl transition-all duration-500 border-2 border-emerald-100",
        hover && "hover:shadow-2xl hover:border-emerald-300 hover:scale-[1.02]",
        gradient && "bg-gradient-to-br from-emerald-50 to-teal-50",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
