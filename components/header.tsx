"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/components/header-content"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleHeroVisibility = (e: CustomEvent) => {
      setIsHeroVisible(e.detail.isHeroVisible)
    }

    window.addEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)

    return () => {
      window.removeEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full overflow-visible max-w-full",
        "transition-shadow duration-300 ease-out",
      )}
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: isHeroVisible ? 0 : 1,
        y: isHeroVisible ? 0 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        backgroundColor: "rgba(6, 78, 59, 0.95)",
        backdropFilter: "blur(12px)",
        boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "0 2px 12px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        pointerEvents: isHeroVisible ? "none" : "auto",
      }}
      aria-hidden={isHeroVisible}
    >
      <div className="container mx-auto max-w-7xl w-full">
        <HeaderContent isScrolled={isScrolled} variant="header" />
      </div>
    </motion.header>
  )
}

export { Header as default }
