"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Users, ArrowLeft } from "lucide-react"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { encodeReturnTo, saveReturnTo } from "@/lib/return-to"

export function InscricaoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const mode = searchParams.get("mode") as "signup" | "login" | null
  const userType = searchParams.get("userType") as "student" | "instructor" | null
  const returnTo = searchParams.get("returnTo")

  const [selectedCard, setSelectedCard] = useState<"student" | "instructor" | null>(userType)
  const [showLoginModal, setShowLoginModal] = useState(mode === "login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  useEffect(() => {
    if (returnTo) {
      saveReturnTo(returnTo)
    }
  }, [returnTo])

  const handleStudentSignUp = () => {
    const params = new URLSearchParams({ userType: "student" })
    if (returnTo) params.set("returnTo", returnTo)
    router.push(`/auth/sign-up?${params}`)
  }

  const handleInstructorSignUp = () => {
    const params = new URLSearchParams({ userType: "instructor" })
    if (returnTo) params.set("returnTo", "/instrutor/ativar")
    router.push(`/auth/sign-up?${params}`)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoginLoading(true)
    setLoginError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      if (error) throw error

      const finalPath = returnTo || (selectedCard === "instructor" ? "/instrutor/dashboard" : "/aluno")
      router.push(finalPath)
      router.refresh()
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleGoogleLogin = async (type: "student" | "instructor") => {
    const supabase = createClient()

    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

      const callbackParams = new URLSearchParams()
      callbackParams.set("userType", type)
      if (returnTo) callbackParams.set("returnTo", encodeReturnTo(returnTo))
      const callbackUrl = `${siteUrl}/auth/callback?${callbackParams}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : "Erro ao entrar com Google")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Botão voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo Via Betel</h1>
          <p className="text-lg text-gray-600">Escolha seu papel e comece agora</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Aluno */}
          <Card
            style={{ boxShadow: SHADOWS.lg }}
            className={`border-0 cursor-pointer transition-all ${
              selectedCard === "student" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedCard("student")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Aluno</CardTitle>
              <CardDescription>Encontre instrutores e aprenda a dirigir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Buscar instrutores qualificados</p>
                <p>✓ Solicitar orçamentos personalizados</p>
                <p>✓ Conversar com instrutores</p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleStudentSignUp}
                  disabled={isLoginLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCard("student")
                    setShowLoginModal(true)
                  }}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={isLoginLoading}
                >
                  Já tenho conta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Instrutor */}
          <Card
            style={{ boxShadow: SHADOWS.lg }}
            className={`border-0 cursor-pointer transition-all ${
              selectedCard === "instructor" ? "ring-2" : "border-2"
            }`}
            style={{
              borderColor: selectedCard === "instructor" ? undefined : COLORS.emerald,
              boxShadow: selectedCard === "instructor" ? `0 0 0 2px ${COLORS.emerald}` : SHADOWS.lg,
            }}
            onClick={() => setSelectedCard("instructor")}
          >
            <CardHeader className="text-center">
              <div
                className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.emerald}20` }}
              >
                <Users className="w-6 h-6" style={{ color: COLORS.emerald }} />
              </div>
              <CardTitle className="text-2xl">Instrutor</CardTitle>
              <CardDescription>Ganhe dinheiro ensinando a dirigir</CardDescription>
              <span
                className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white rounded-full"
                style={{ backgroundColor: COLORS.emerald }}
              >
                Destaque
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Apareça no catálogo de instrutores</p>
                <p>✓ Receba pedidos de alunos</p>
                <p>✓ Gerencie seu calendário e preços</p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleInstructorSignUp}
                  disabled={isLoginLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70"
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    "Cadastrar como Instrutor"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCard("instructor")
                    setShowLoginModal(true)
                  }}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={isLoginLoading}
                >
                  Já tenho conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Login */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Via Betel</DialogTitle>
            <DialogDescription>
              {selectedCard === "instructor" ? "Acesso para Instrutores" : "Acesso para Alunos"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{loginError}</div>}

            <Button type="submit" disabled={isLoginLoading} className="w-full">
              {isLoginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleGoogleLogin(selectedCard || "student")}
              variant="outline"
              className="w-full"
            >
              Google
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
