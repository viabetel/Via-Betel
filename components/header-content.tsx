"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronDown, User, LogOut, ClipboardList, Instagram } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/viabetel/"

interface HeaderContentProps {
  isScrolled?: boolean
  variant?: "header" | "hero"
}

/**
 * Componente reutilizável que contém TODO o conteúdo do header.
 * Usado tanto no Header real quanto no HeroNav.
 */
export function HeaderContent({ isScrolled = false, variant = "header" }: HeaderContentProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    if (!user) return

    const loadUnreadCount = async () => {
      const supabase = createClient()
      const { data } = await supabase.rpc("get_unread_count", { user_uuid: user.id })
      if (data) {
        const total = data.reduce((acc: number, curr: { unread_count: number }) => acc + curr.unread_count, 0)
        setUnreadCount(total)
      }
    }

    loadUnreadCount()

    const supabase = createClient()
    const channel = supabase
      .channel("unread_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        loadUnreadCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

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

  const handleSignOut = async () => {
    await signOut()
    setOpenDropdown(null)
  }

  // Cores adaptadas ao contexto (hero vs header scrolled)
  const textColor = variant === "hero" ? "text-white" : isScrolled ? "text-gray-700" : "text-white"
  const hoverBg = variant === "hero" ? "hover:bg-white/10" : isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"

  return (
    <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
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
            onClick={() => toggleDropdown("mobile-menu")}
            className={cn(textColor, hoverBg, "font-medium text-sm px-2 py-2 rounded-lg")}
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

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Para você dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown("para-voce")}
              className={cn(
                textColor,
                hoverBg,
                "font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all",
              )}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Serviços dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown("servicos")}
              className={cn(
                textColor,
                hoverBg,
                "font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all",
              )}
            >
              Serviços
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "servicos" && "rotate-180")}
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
              className={cn(
                textColor,
                hoverBg,
                "font-medium text-sm lg:text-base px-3 lg:px-4 py-2 rounded-lg flex items-center gap-1 transition-all",
              )}
            >
              Produtos
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-200", openDropdown === "produtos" && "rotate-180")}
              />
            </Button>
            <AnimatePresence>
              {openDropdown === "produtos" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50"
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

      {/* Actions (Instagram, Auth, Chat) */}
      <motion.div
        className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Via Betel"
          className={cn(
            "p-2 rounded-full transition-all",
            variant === "hero"
              ? "text-white hover:bg-white/10"
              : isScrolled
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-white hover:bg-white/10",
          )}
        >
          <Instagram className="w-5 h-5" />
        </a>

        {!user ? (
          <>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className={cn("text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2", textColor, hoverBg)}
              >
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg">
                Criar conta
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/chat" className="relative">
              <Button variant="ghost" size="sm" className={cn("p-2 rounded-full relative", textColor, hoverBg)}>
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => toggleDropdown("user-menu")}
                className={cn("p-2 rounded-full", textColor, hoverBg)}
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
              <AnimatePresence>
                {openDropdown === "user-menu" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[200px] z-[9999] border-2 border-emerald-300/50"
                  >
                    <div className="px-4 py-2 border-b border-emerald-200">
                      <p className="text-sm font-semibold text-emerald-900">{profile?.full_name || "Usuário"}</p>
                      <p className="text-xs text-emerald-600 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href={profile?.role === "STUDENT" ? "/aluno" : "/instrutor"}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Minhas Solicitações
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm transition-all font-medium border-t border-emerald-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
