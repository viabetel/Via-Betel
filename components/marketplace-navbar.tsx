"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, CreditCard, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export function MarketplaceNavbar() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 relative">
              <Image src="/images/via-betel-transparent.png" alt="Via Betel" fill className="object-contain" priority />
            </div>
            <span className="font-bold text-lg text-gray-900">Via Betel</span>
          </Link>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/inscricao?mode=login">
                  <Button variant="ghost" className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50">
                    Login
                  </Button>
                </Link>
                <Link href="/inscricao?userType=student">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Cadastro</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/planos">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    Planos
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
                    <User className="w-4 h-4" />
                    <span>{profile?.name || "Meu Perfil"}</span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      href="/conta/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 first:rounded-t-lg"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/conta"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            {!user ? (
              <>
                <Link href="/inscricao?mode=login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-700">
                    Login
                  </Button>
                </Link>
                <Link href="/inscricao?userType=student" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Cadastro</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/planos" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Planos
                  </Button>
                </Link>
                <Link href="/conta/perfil" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Meu Perfil
                  </Button>
                </Link>
                <Link href="/conta" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Configurações
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
