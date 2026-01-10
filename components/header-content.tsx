"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppLink } from "@/components/app-link"
import {
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
  ClipboardList,
  Instagram,
  Heart,
  Briefcase,
  Calendar,
  Shield,
  Settings,
} from "lucide-react"
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
        <AppLink href="/" hardNavigation aria-label="Via Betel Home">
          <Image
            src="/images/viabetel-logo.png"
            alt="Via Betel"
            width={160}
            height={50}
            className="h-7 sm:h-8 md:h-10 lg:h-11 w-auto drop-shadow-lg"
            priority
          />
        </AppLink>
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
                <AppLink
                  href="/instrutores"
                  hardNavigation
                  onClick={() => setOpenDropdown(null)}
                  className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                >
                  Encontrar Instrutores
                </AppLink>
                <AppLink
                  href="/aluno"
                  hardNavigation
                  onClick={() => setOpenDropdown(null)}
                  className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                >
                  Para Alunos
                </AppLink>
                <AppLink
                  href="/instrutor"
                  hardNavigation
                  onClick={() => setOpenDropdown(null)}
                  className="block px-3 py-2 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-xs transition-all font-medium"
                >
                  Para Instrutores
                </AppLink>
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
                  <AppLink
                    href="/instrutores"
                    hardNavigation
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-md mx-2 mb-2 transition-all hover:from-emerald-600 hover:to-teal-600"
                  >
                    🔍 Encontrar Instrutores
                  </AppLink>
                  <AppLink
                    href="/orcamento"
                    hardNavigation
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                  >
                    Pedir Orçamento
                  </AppLink>
                  <AppLink
                    href="/aluno"
                    hardNavigation
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2"
                  >
                    Para Alunos
                  </AppLink>
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
            <AppLink href="/auth/login" hardNavigation>
              <Button
                variant="ghost"
                className={cn("text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2", textColor, hoverBg)}
              >
                Entrar
              </Button>
            </AppLink>
            <AppLink href="/auth/sign-up" hardNavigation>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg">
                Criar conta
              </Button>
            </AppLink>
          </>
        ) : (
          <>
            <AppLink href="/chat" className="relative">
              <Button variant="ghost" size="sm" className={cn("p-2 rounded-full relative", textColor, hoverBg)}>
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </AppLink>

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
                    className="absolute top-full right-0 mt-2 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-2 min-w-[240px] z-[9999] border-2 border-emerald-300/50"
                  >
                    <div className="px-4 py-3 border-b border-emerald-200/50">
                      <div className="flex items-center gap-3">
                        {profile?.avatar_url ? (
                          <Image
                            src={profile.avatar_url || "/placeholder.svg"}
                            alt={profile.full_name || "User"}
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-emerald-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                            {(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-emerald-900 truncate">
                            {profile?.full_name || "Usuário"}
                          </p>
                          <p className="text-xs text-emerald-600 truncate">{user?.email}</p>
                          {profile?.role && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                              {profile.role === "STUDENT"
                                ? "Aluno"
                                : profile.role === "INSTRUCTOR"
                                  ? "Instrutor"
                                  : "Admin"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <AppLink
                        href="/conta"
                        hardNavigation
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-semibold"
                      >
                        <User className="w-4 h-4" />
                        Minha Conta
                      </AppLink>
                      <Link
                        href="/conta/perfil"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                      >
                        <User className="w-4 h-4" />
                        Ver meu perfil
                      </Link>
                    </div>

                    <div className="border-t border-emerald-200/50 my-1"></div>

                    {profile?.role === "STUDENT" ? (
                      <div className="py-1">
                        <Link
                          href="/conta/solicitacoes"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <ClipboardList className="w-4 h-4" />
                          Minhas Solicitações
                        </Link>
                        <Link
                          href="/conta/favoritos"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <Heart className="w-4 h-4" />
                          Favoritos
                        </Link>
                        <Link
                          href="/inbox"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Mensagens
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    ) : profile?.role === "INSTRUCTOR" ? (
                      <div className="py-1">
                        <Link
                          href="/conta/anuncios"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <Briefcase className="w-4 h-4" />
                          Meu anúncio
                        </Link>
                        <Link
                          href="/conta/disponibilidade"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <Calendar className="w-4 h-4" />
                          Disponibilidade
                        </Link>
                        <Link
                          href="/inbox"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Mensagens
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    ) : (
                      <div className="py-1">
                        <Link
                          href="/inbox"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Mensagens
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-emerald-200/50 my-1"></div>

                    <div className="py-1">
                      <Link
                        href="/conta/seguranca"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Segurança
                      </Link>
                      <Link
                        href="/conta/preferencias"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                      >
                        <Settings className="w-4 h-4" />
                        Preferências
                      </Link>
                    </div>

                    <div className="border-t border-emerald-200/50 my-1"></div>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm transition-all font-semibold rounded-b-lg"
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
