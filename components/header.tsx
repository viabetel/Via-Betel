"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/components/header-content"

export function Header() {
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const handleHeroVisibility = (e: CustomEvent) => {
      setIsHeroVisible(e.detail.isHeroVisible)
    }

    window.addEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)

    return () => {
      window.removeEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out",
        isHeroVisible
          ? "bg-transparent border-transparent shadow-none"
          : "bg-emerald-500/95 border-b border-white/10 shadow-lg backdrop-blur-md",
      )}
    >
      <div className="container mx-auto max-w-7xl w-full px-4 sm:px-6">
        <HeaderContent variant="hero" />
      </div>
    </header>
  )
}

export { Header as default }
