"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/components/header-content"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isInHero, setIsInHero] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Detecta direção do scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up")
      }

      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)

      // Detecta se ainda está no hero (aproximadamente)
      // O hero tem ~90vh, então ~600-700px
      setIsInHero(currentScrollY < 600)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full overflow-visible max-w-full",
        "transition-all duration-400 ease-in-out",
      )}
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: isInHero ? 0 : 1,
        y: isInHero ? -100 : scrollDirection === "down" && !isInHero ? -100 : 0,
      }}
      style={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgb(6, 95, 70)",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        boxShadow: isScrolled ? "0 2px 12px rgba(0, 0, 0, 0.08)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
        borderBottom: isScrolled ? "1px solid rgba(5, 150, 105, 0.1)" : "none",
        pointerEvents: isInHero ? "none" : "auto",
      }}
      aria-hidden={isInHero}
    >
      <div className="container mx-auto max-w-7xl w-full">
        <HeaderContent isScrolled={isScrolled} variant="header" />
      </div>
    </motion.header>
  )
}

export { Header as default }
