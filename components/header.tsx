"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronDown } from "lucide-react"

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

  return (
    <motion.header
      className={cn("fixed top-0 left-0 right-0 z-50 w-full max-w-full", "transition-all duration-700 ease-in-out")}
      style={{
        backgroundColor: isScrolled ? "rgb(22, 101, 52)" : "transparent",
        boxShadow: isScrolled ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="-ml-4 md:-ml-6">
            <a href="#" aria-label="Via Betel Home">
              <Image
                src="/images/viabetel-logo.png"
                alt="Via Betel"
                width={160}
                height={50}
                className="h-9 md:h-10 w-auto drop-shadow-lg"
                priority
              />
            </a>
          </motion.div>

          <nav ref={dropdownRef} className="flex items-center gap-1 flex-1 justify-center">
            {/* Para você dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => toggleDropdown("para-voce")}
                className="text-white hover:text-amber-400 hover:bg-white/5 font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Para você
                <ChevronDown className="w-4 h-4" />
              </Button>
              {openDropdown === "para-voce" && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  <Link href="#alunos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    Para Alunos
                  </Link>
                  <Link href="#instrutores" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
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
                className="text-white hover:text-amber-400 hover:bg-white/5 font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Serviços
                <ChevronDown className="w-4 h-4" />
              </Button>
              {openDropdown === "servicos" && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  <Link href="#aulas-praticas" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    Aulas Práticas
                  </Link>
                  <Link href="#simulado" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    Simulados
                  </Link>
                  <Link href="#renovacao" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
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
                className="text-white hover:text-amber-400 hover:bg-white/5 font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Produtos
                <ChevronDown className="w-4 h-4" />
              </Button>
              {openDropdown === "produtos" && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  <Link href="#planos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    Planos
                  </Link>
                  <Link href="#categorias" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    Categorias
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" className="font-medium text-sm px-5 py-2 text-white hover:bg-white/10 rounded-lg">
                Entrar
              </Button>
            </Link>

            {isLoggedIn && (
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  onClick={() => toggleDropdown("minha-conta")}
                  className="text-white hover:text-amber-400 hover:bg-white/5 font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-1"
                >
                  Minha conta
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {openDropdown === "minha-conta" && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                    <Link href="#perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      Meu Perfil
                    </Link>
                    <Link href="#aulas" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      Minhas Aulas
                    </Link>
                    <Link href="#configuracoes" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      Configurações
                    </Link>
                    <Link href="#sair" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
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
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
