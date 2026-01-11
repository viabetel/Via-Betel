"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Users } from "lucide-react"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"

export default function InscricaoPage() {
  const router = useRouter()

  const handleStudentSignUp = () => {
    router.push("/auth/sign-up?userType=student")
  }

  const handleStudentLogin = () => {
    router.push("/auth/login?returnTo=/instrutores")
  }

  const handleInstructorSignUp = () => {
    router.push("/auth/sign-up?userType=instructor")
  }

  const handleInstructorLogin = () => {
    router.push("/auth/login?returnTo=/instrutor/onboarding")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo Via Betel</h1>
          <p className="text-lg text-gray-600">Escolha seu papel e comece agora</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Aluno */}
          <Card style={{ boxShadow: SHADOWS.lg }} className="border-0">
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
                <Button onClick={handleStudentSignUp} className="w-full bg-blue-600 hover:bg-blue-700">
                  Criar conta
                </Button>
                <Button onClick={handleStudentLogin} variant="outline" className="w-full bg-transparent">
                  Já tenho conta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Instrutor */}
          <Card style={{ boxShadow: SHADOWS.lg }} className="border-0 border-2" style={{ borderColor: COLORS.emerald }}>
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
                  className="w-full text-white"
                  style={{ backgroundColor: COLORS.emerald }}
                >
                  Criar conta
                </Button>
                <Button onClick={handleInstructorLogin} variant="outline" className="w-full bg-transparent">
                  Já tenho conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA para voltar */}
        <div className="text-center mt-12">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
