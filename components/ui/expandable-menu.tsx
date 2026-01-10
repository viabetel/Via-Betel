"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ExpandableMenuProps {
  isOpen: boolean
  children: ReactNode
  className?: string
  position?: "left" | "right"
}

/**
 * Menu expansivo premium (dropdown/popover)
 * Estilo EXATO dos menus da Home
 */
export function ExpandableMenu({ isOpen, children, className, position = "left" }: ExpandableMenuProps) {
  const positionClass = position === "right" ? "right-0" : "left-0"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute top-full mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm",
            positionClass,
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableMenuItem({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 text-left",
        className,
      )}
    >
      {children}
    </button>
  )
}
