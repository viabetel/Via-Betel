"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { SHADOWS } from "@/lib/ui/tokens"

const encodeReturnTo = (returnTo: string) => encodeURIComponent(returnTo)
const saveReturnTo = (returnTo: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("returnTo", returnTo)
  }
}

export default function SignUpContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState<"student" | "instructor">("student")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const paramUserType = searchParams.get("userType")
    const paramReturnTo = searchParams.get("returnTo")
    if (paramUserType === "student" || paramUserType === "instructor") {
      setUserType(paramUserType)
    }
    if (paramReturnTo) {
      saveReturnTo(paramReturnTo)
    }
  }, [searchParams])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/sign-up-success`
          : "/auth/sign-up-success"

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "/auth/callback"

      const callbackParams = new URLSearchParams()
      callbackParams.set("userType", userType)

      const savedReturnTo = typeof window !== "undefined" ? sessionStorage.getItem("returnTo") : null
      if (savedReturnTo) {
        callbackParams.set("returnTo", encodeReturnTo(savedReturnTo))
      }

      const callbackWithParams = `${redirectUrl}?${callbackParams}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackWithParams,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Não foi possível cadastrar com Google. Tente novamente.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Home
      </Link>

      <div className="w-full max-w-sm">
        <Card style={{ boxShadow: SHADOWS.xl }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Cadastro Via Betel</CardTitle>
                <CardDescription>Crie sua conta gratuitamente</CardDescription>
              </div>
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                style={{
                  backgroundColor:
                    userType === "instructor"
                      ? "rgb(34, 197, 94)" // emerald
                      : "rgb(59, 130, 246)", // blue
                }}
              >
                {userType === "instructor" ? "Instrutor" : "Aluno"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="w-full border-2 hover:bg-gray-50 bg-transparent"
                >
                  {isGoogleLoading ? (
                    "Conectando..."
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Cadastrar com Google
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? "Criando..." : "Criar Conta"}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Já tem conta?{" "}
              <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
