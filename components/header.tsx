"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronDown } from "lucide-react"
import { analytics } from "@/lib/analytics"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 700)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const userToken = localStorage.getItem("userToken")
    setIsLoggedIn(!!userToken)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const handleWhatsAppClick = () => {
    analytics.clickWhatsApp("header")
  }

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full overflow-hidden max-w-full",
        "transition-all duration-700 ease-in-out",
      )}
      style={{
        backgroundColor: isScrolled ? "var(--color-brand-primary-darker)" : "transparent",
        boxShadow: isScrolled ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      <div className="container mx-auto max-w-7xl w-full">
        <div className="flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="flex-shrink-0 min-w-0">
            <Link href="/" aria-label="Via Betel Home">
              <Image
                src="/images/viabetel-logo.png"
                alt="Via Betel"
                width={160}
                height={50}
                className="h-8 md:h-10 lg:h-11 w-auto drop-shadow-lg"
                priority
              />
            </Link>
          </motion.div>

          <nav ref={dropdownRef} className="hidden md:flex items-center gap-2 lg:gap-3 min-w-0">
            {/* Para você dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => toggleDropdown("para-voce")}
                className="text-[var(--color-brand-text-light)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              >
                Para você
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    openDropdown === "para-voce" && "rotate-180",
                  )}
                />
              </Button>
              {openDropdown === "para-voce" && (
                <div className="absolute top-full left-0 mt-2 bg-background rounded-lg shadow-xl py-2 min-w-[200px] z-50 border border-border">
                  <Link
                    href="/aluno"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                  >
                    Para Alunos
                  </Link>
                  <Link
                    href="/instrutor"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                  >
                    Para Instrutores
                  </Link>
                </div>
              )}
            </div>

            {/* Serviços dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => toggleDropdown("servicos")}
                className="text-[var(--color-brand-text-light)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              >
                Serviços
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    openDropdown === "servicos" && "rotate-180",
                  )}
                />
              </Button>
              {openDropdown === "servicos" && (
                <div className="absolute top-full left-0 mt-2 bg-background rounded-lg shadow-xl py-2 min-w-[200px] z-50 border border-border">
                  <Link
                    href="#aulas-praticas"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                  >
                    Aulas Práticas
                  </Link>
                  <Link
                    href="#simulado"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                  >
                    Simulados
                  </Link>
                  <Link
                    href="#renovacao"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm border-t border-border transition-colors"
                  >
                    Renovação CNH
                  </Link>
                </div>
              )}
            </div>

            {/* Produtos dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => toggleDropdown("produtos")}
                className="text-[var(--color-brand-text-light)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              >
                Produtos
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    openDropdown === "produtos" && "rotate-180",
                  )}
                />
              </Button>
              {openDropdown === "produtos" && (
                <div className="absolute top-full left-0 mt-2 bg-background rounded-lg shadow-xl py-2 min-w-[200px] z-50 border border-border">
                  <a
                    href="#featured-products"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Nossos Planos
                  </a>
                  <a
                    href="#categorias"
                    className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm border-t border-border transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Categorias CNH
                  </a>
                </div>
              )}
            </div>
          </nav>

          <motion.div
            className="flex items-center gap-2 lg:gap-3 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLoggedIn && (
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  onClick={() => toggleDropdown("minha-conta")}
                  className="text-[var(--color-brand-text-light)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1"
                >
                  Minha conta
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === "minha-conta" && "rotate-180",
                    )}
                  />
                </Button>
                {openDropdown === "minha-conta" && (
                  <div className="absolute top-full right-0 mt-2 bg-background rounded-lg shadow-xl py-2 min-w-[200px] z-50 border border-border">
                    <Link
                      href="#perfil"
                      className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="#aulas"
                      className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm transition-colors"
                    >
                      Minhas Aulas
                    </Link>
                    <Link
                      href="#configuracoes"
                      className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm border-t border-border transition-colors"
                    >
                      Configurações
                    </Link>
                    <Link
                      href="#sair"
                      className="block px-4 py-2.5 text-foreground hover:bg-gradient-to-r hover:from-[var(--color-brand-bg-accent-light)] hover:to-[var(--color-brand-bg-light)] hover:text-[var(--color-brand-primary-dark)] text-sm border-t border-border transition-colors"
                    >
                      Sair
                    </Link>
                  </div>
                )}
              </div>
            )}

            <a
              href="https://wa.me/5532988093506"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] hover:from-[var(--color-brand-accent-dark)] hover:to-[var(--color-brand-accent-darker)] shadow-lg shadow-[var(--color-brand-accent)]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[var(--color-brand-accent)]/40"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-brand-text-light)]" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
