"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

/**
 * Componente reutilizável para títulos de seção
 * Extraído da Home para uso em todo o projeto
 */
export function SectionHeader({ title, subtitle, align = "left", className }: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left"

  return (
    <motion.div
      className={cn("mb-8 md:mb-10", alignClass, className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl lg:text-3xl text-neutral-900 font-semibold mb-3">{title}</h2>
      {subtitle && <p className="text-base text-neutral-600 max-w-2xl text-pretty leading-normal">{subtitle}</p>}
    </motion.div>
  )
}
