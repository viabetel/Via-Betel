"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
      setIsScrolled(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userToken = localStorage.getItem("userToken")
      setIsLoggedIn(!!userToken)
    }
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
        "fixed top-0 left-0 right-0 z-50 w-full overflow-visible max-w-full",
        "transition-all duration-700 ease-in-out",
      )}
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: isScrolled ? 1 : 0,
        y: isScrolled ? 0 : -100,
      }}
      style={{
        backgroundColor: "rgb(6, 95, 70)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        pointerEvents: isScrolled ? "auto" : "none",
      }}
    >
      <div className="container mx-auto max-w-7xl w-full">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="flex-shrink-0 min-w-0">
            <Link href="/" aria-label="Via Betel Home">
              <Image
                src="/images/viabetel-logo.png"
                alt="Via Betel"
                width={160}
                height={50}
                className="h-7 sm:h-8 md:h-10 lg:h-11 w-auto drop-shadow-lg"
                priority
              />
            </Link>
          </motion.div>

          <nav ref={dropdownRef} className="flex items-center gap-2 lg:gap-3 min-w-0">
            {/* Mobile menu button */}
            <div className="md:hidden relative">
              <Button
                variant="ghost"
                onClick={() => setOpenDropdown(openDropdown === "mobile-menu" ? null : "mobile-menu")}
                className="text-[var(--color-brand-text-light)] hover:text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 font-medium text-sm px-2 py-2 rounded-lg"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <AnimatePresence>
                {openDropdown === "mobile-menu" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-2 min-w-[180px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                  >
                    <Link
                      href="/instrutores"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Encontrar Instrutores
                    </Link>
                    <Link
                      href="/aluno"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Para Alunos
                    </Link>
                    <Link
                      href="/instrutor"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Para Instrutores
                    </Link>
                    <div className="border-t border-emerald-200 my-1"></div>
                    <a
                      href="#aulas-praticas"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Aulas Práticas
                    </a>
                    <a
                      href="#simulado"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Simulados
                    </a>
                    <a
                      href="#renovacao"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                    >
                      Renovação CNH
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
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
                <AnimatePresence>
                  {openDropdown === "para-voce" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      <Link
                        href="/instrutores"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-md mx-2 mb-2 transition-all hover:from-emerald-600 hover:to-teal-600"
                      >
                        🔍 Encontrar Instrutores
                      </Link>
                      <Link
                        href="/orcamento"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Pedir Orçamento
                      </Link>
                      <Link
                        href="/aluno"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Para Alunos
                      </Link>
                      <Link
                        href="/para-instrutores"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 border-t border-emerald-200 mt-1 pt-2.5"
                      >
                        Para Instrutores
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <AnimatePresence>
                  {openDropdown === "servicos" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      <Link
                        href="#aulas-praticas"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Aulas Práticas
                      </Link>
                      <Link
                        href="#simulado"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Simulados
                      </Link>
                      <Link
                        href="#renovacao"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 border-t border-emerald-200 mt-1 pt-2.5"
                      >
                        Renovação CNH
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <AnimatePresence>
                  {openDropdown === "produtos" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      <a
                        href="#featured-products"
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Nossos Planos
                      </a>
                      <a
                        href="#categorias"
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 border-t border-emerald-200 mt-1 pt-2.5"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Categorias CNH
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0"
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
                <AnimatePresence>
                  {openDropdown === "minha-conta" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm"
                    >
                      <Link
                        href="#perfil"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Meu Perfil
                      </Link>
                      <Link
                        href="#aulas"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                      >
                        Minhas Aulas
                      </Link>
                      <Link
                        href="#configuracoes"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 border-t border-emerald-200 mt-1 pt-2.5"
                      >
                        Configurações
                      </Link>
                      <Link
                        href="#sair"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2 border-t border-emerald-200 mt-1 pt-2.5"
                      >
                        Sair
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <a
              href="https://wa.me/5532988093506"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] hover:from-[var(--color-brand-accent-dark)] hover:to-[var(--color-brand-accent-darker)] shadow-lg shadow-[var(--color-brand-accent)]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[var(--color-brand-accent)]/40"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[var(--color-brand-text-light)]" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
