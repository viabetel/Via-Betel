"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("[v0] Login attempt:", { email })
      // TODO: Implement your own authentication logic here
      // For now, just simulate a login
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Login successful")
    } catch (error) {
      console.error("[v0] Erro ao fazer login:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button variant="ghost" className="gap-2 text-white hover:bg-white/20 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="flex justify-center mb-6">
            <Image src="/images/viabetel-logo.png" alt="Via Betel" width={200} height={75} className="h-auto" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-white">Bem-vindo de volta!</h1>
          <p className="text-center text-slate-300 mb-8">Entre para continuar sua jornada</p>

          <div className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/30 bg-white/10 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-slate-300">Lembrar-me</span>
                </label>
                <Link href="#" className="text-green-500 hover:text-green-400 font-medium">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-300 mt-6">Entre em contato para criar uma conta</p>
        </div>
      </motion.div>
    </div>
  )
}
