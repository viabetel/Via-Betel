"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  GitCompare,
  BookmarkPlus,
  User,
  LogOut,
  MessageCircle,
  Instagram,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/viabetel/"

interface MarketplaceHeaderProps {
  isScrolled?: boolean
  variant?: "header" | "hero"
  totalResults?: number
  currentCity?: string
  currentSort?: string
  onOpenFilters?: () => void
  onClearFilters?: () => void
  hasActiveFilters?: boolean
}

/**
 * Header específico do Marketplace - Focado em busca e ações de compra
 * Diferente do header institucional da Home
 */
export function MarketplaceHeader({
  isScrolled = false,
  variant = "header",
  totalResults = 0,
  currentCity = "",
  currentSort = "",
  onOpenFilters,
  onClearFilters,
  hasActiveFilters = false,
}: MarketplaceHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, profile, signOut } = useAuth()

  const [searchText, setSearchText] = useState(searchParams?.get("q") || "")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load unread messages count
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

  // Load favorites and compare list from localStorage (fallback until backend is ready)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("via-betel-favorites")
      const storedCompare = localStorage.getItem("via-betel-compare")
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
      if (storedCompare) setCompareList(JSON.parse(storedCompare))
    }
  }, [])

  // Close dropdown when clicking outside
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

  const handleSearch = (value: string) => {
    setSearchText(value)
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSaveSearch = () => {
    if (!user) {
      // Save current URL and redirect to login
      const returnTo = `${pathname}?${searchParams?.toString() || ""}`
      router.push(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }

    // TODO: Implement save search to backend
    alert("Busca salva! Em breve você poderá gerenciar suas buscas salvas.")
  }

  const handleSignOut = async () => {
    await signOut()
    setOpenDropdown(null)
  }

  const textColor = variant === "hero" ? "text-white" : isScrolled ? "text-gray-700" : "text-white"
  const hoverBg = variant === "hero" ? "hover:bg-white/10" : isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"

  return (
    <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 lg:px-8 w-full gap-3">
      {/* Logo */}
      <Link href="/" aria-label="Via Betel Home" className="flex-shrink-0">
        <Image
          src="/images/viabetel-logo.png"
          alt="Via Betel"
          width={140}
          height={40}
          className="h-8 md:h-10 w-auto drop-shadow-lg"
          priority
        />
      </Link>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por bairro, cidade, especialidade..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Actions */}
      <nav ref={dropdownRef} className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className={cn("md:hidden p-2", textColor, hoverBg)}
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Filters Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenFilters}
          className={cn("p-2 relative", textColor, hoverBg)}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>}
        </Button>

        {/* Clear Filters (only if active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className={cn("hidden md:flex items-center gap-1 text-xs", textColor, hoverBg)}
          >
            <X className="w-4 h-4" />
            Limpar
          </Button>
        )}

        {/* Save Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveSearch}
          className={cn("hidden lg:flex items-center gap-1.5 text-xs", textColor, hoverBg)}
          aria-label="Salvar busca"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span className="hidden xl:inline">Salvar</span>
        </Button>

        {/* Favorites */}
        <Link href="/favoritos" className="relative">
          <Button variant="ghost" size="sm" className={cn("p-2 relative", textColor, hoverBg)} aria-label="Favoritos">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Button>
        </Link>

        {/* Compare */}
        <Link href="/comparar" className="hidden sm:block relative">
          <Button variant="ghost" size="sm" className={cn("p-2 relative", textColor, hoverBg)} aria-label="Comparar">
            <GitCompare className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </Button>
        </Link>

        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Via Betel"
          className={cn("hidden sm:block p-2 rounded-full transition-all", textColor, hoverBg)}
        >
          <Instagram className="w-5 h-5" />
        </a>

        {/* Auth / User Menu */}
        {!user ? (
          <>
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className={cn("text-sm px-3 py-2", textColor, hoverBg)}>
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm px-3 py-2 shadow-lg"
              >
                Criar conta
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Chat with unread count */}
            <Link href="/chat" className="relative hidden sm:block">
              <Button variant="ghost" size="sm" className={cn("p-2 relative", textColor, hoverBg)}>
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setOpenDropdown(openDropdown === "user-menu" ? null : "user-menu")}
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
                      href="/minhas-buscas"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      Minhas Buscas
                    </Link>
                    <Link
                      href="/conta"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2 px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium"
                    >
                      <User className="w-4 h-4" />
                      Minha Conta
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
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
            onClick={() => setShowMobileSearch(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileSearch(false)} className="p-2">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Info (Desktop only) */}
      {totalResults > 0 && (
        <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="font-bold">{totalResults}</span>
          <span>instrutores</span>
          {currentCity && (
            <>
              <span className="text-emerald-400">•</span>
              <span>{currentCity}</span>
            </>
          )}
          {currentSort && (
            <>
              <span className="text-emerald-400">•</span>
              <span>{currentSort}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
