"use client"

import { motion } from "framer-motion"
import { HeaderContent } from "@/components/header-content"

/**
 * HeroNav: versão do header que fica fixa no topo do hero.
 * Mantém todos os botões visíveis e clicáveis enquanto o usuário estiver no hero.
 * Desaparece quando o usuário sai do hero e o Header real assume.
 */
export function HeroNav({ isHeroVisible }: { isHeroVisible: boolean }) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] w-full"
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: isHeroVisible ? 1 : 0,
        y: isHeroVisible ? 0 : -100,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        pointerEvents: isHeroVisible ? "auto" : "none",
      }}
    >
      <div
        className="w-full"
        style={{
          backgroundColor: "rgba(6, 78, 59, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto max-w-7xl w-full">
          <HeaderContent variant="hero" />
        </div>
      </div>
    </motion.div>
  )
}
