"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

/**
 * RouteLoadingOverlay - Overlay global que aparece durante navegação
 * Detecta mudança de rota e exibe feedback visual
 */
export function RouteLoadingOverlay() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true)
      setPrevPathname(pathname)

      // Hide after short delay (component will mount)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99998] bg-emerald-900/10 backdrop-blur-[2px] pointer-events-none flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-emerald-900">Carregando página...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
