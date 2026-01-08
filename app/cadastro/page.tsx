"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, GraduationCap, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CadastroPage() {
  const [userType, setUserType] = useState<"aluno" | "instrutor" | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    password: "",
    registro: "",
    categoria: "Categoria B",
    experiencia: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("[v0] Dados de cadastro:", { ...formData, userType })
      // TODO: Implement your own authentication logic here
      // For now, just simulate a signup
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Cadastro successful")
    } catch (error) {
      console.error("[v0] Erro ao cadastrar:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
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
        className="w-full max-w-2xl"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="flex justify-center mb-6">
            <Image src="/images/viabetel-logo.png" alt="Via Betel" width={200} height={75} className="h-auto" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-white">Crie sua conta</h1>
          <p className="text-center text-slate-300 mb-8">Junte-se à comunidade Via Betel</p>

          {!userType ? (
            <div className="space-y-4">
              <p className="text-center text-white font-medium mb-6">Como você quer se cadastrar?</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("aluno")}
                disabled={loading}
                className="w-full p-6 bg-gradient-to-br from-blue-900/50 to-blue-800/50 hover:from-blue-800/60 hover:to-blue-700/60 rounded-xl border-2 border-blue-500/30 hover:border-blue-400/50 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Sou Aluno</h3>
                    <p className="text-sm text-blue-200">Quero aprender a dirigir e tirar minha CNH</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("instrutor")}
                disabled={loading}
                className="w-full p-6 bg-gradient-to-br from-green-900/50 to-green-800/50 hover:from-green-800/60 hover:to-green-700/60 rounded-xl border-2 border-green-500/30 hover:border-green-400/50 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Sou Instrutor</h3>
                    <p className="text-sm text-green-200">Quero conectar com alunos e oferecer minhas aulas</p>
                  </div>
                </div>
              </motion.button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30">
                <p className="text-sm text-slate-200">
                  Cadastrando como:{" "}
                  <span className={`font-bold ${userType === "instrutor" ? "text-green-400" : "text-blue-400"}`}>
                    {userType === "instrutor" ? "Instrutor" : "Aluno"}
                  </span>{" "}
                  <button
                    onClick={() => setUserType(null)}
                    className="text-slate-400 hover:text-slate-200 underline ml-2"
                  >
                    alterar
                  </button>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-white mb-2">
                      Nome completo
                    </label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-white mb-2">
                      Telefone
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    disabled={loading}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {userType === "instrutor" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="registro" className="block text-sm font-medium text-white mb-2">
                          Registro profissional
                        </label>
                        <Input
                          id="registro"
                          type="text"
                          placeholder="Nº de registro"
                          value={formData.registro}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="categoria" className="block text-sm font-medium text-white mb-2">
                          Categoria CNH
                        </label>
                        <select
                          id="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="h-12 w-full rounded-md border border-white/20 bg-white/10 text-white px-3 text-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option className="bg-slate-900">Categoria A</option>
                          <option className="bg-slate-900">Categoria B</option>
                          <option className="bg-slate-900">Categoria C</option>
                          <option className="bg-slate-900">Categoria D</option>
                          <option className="bg-slate-900">Categoria E</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="experiencia" className="block text-sm font-medium text-white mb-2">
                        Anos de experiência
                      </label>
                      <Input
                        id="experiencia"
                        type="number"
                        placeholder="Ex: 5"
                        value={formData.experiencia}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    disabled={loading}
                    className="mt-1 rounded border-white/30 bg-white/10 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-300">
                    Aceito os{" "}
                    <Link href="#" className="text-green-500 hover:text-green-400 font-medium">
                      termos de uso
                    </Link>{" "}
                    e{" "}
                    <Link href="#" className="text-green-500 hover:text-green-400 font-medium">
                      política de privacidade
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </motion.div>
          )}

          <p className="text-center text-sm text-slate-300 mt-6">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-green-500 hover:text-green-400 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
