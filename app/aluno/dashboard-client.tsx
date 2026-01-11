"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Heart, MessageSquare } from "lucide-react"

export default function AlunoDashboardClient() {
  const { user, profile } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/auth/login?returnTo=/aluno")
    return null
  }

  const stats = [
    {
      label: "Solicitações Ativas",
      value: "0",
      icon: Briefcase,
      color: "text-blue-600",
      href: "/conta/solicitacoes",
    },
    {
      label: "Favoritos",
      value: "0",
      icon: Heart,
      color: "text-red-600",
      href: "/conta/favoritos",
    },
    {
      label: "Conversas",
      value: "0",
      icon: MessageSquare,
      color: "text-emerald-600",
      href: "/chat",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo, {profile?.full_name || "Aluno"}!</h1>
          <p className="text-gray-600">Gerencie suas solicitações e encontre instrutores qualificados</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {stat.label}
                    <Icon className={`${stat.color} w-5 h-5`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <Link href={stat.href}>
                    <Button variant="link" className="mt-3 p-0">
                      Ver detalhes →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTAs */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-transparent">
            <CardHeader>
              <CardTitle>Buscar Instrutores</CardTitle>
              <CardDescription>Encontre instrutores qualificados perto de você</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 w-full">
                <Link href="/instrutores">Buscar Agora</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
            <CardHeader>
              <CardTitle>Criar Solicitação</CardTitle>
              <CardDescription>Descreva suas necessidades e receba orçamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full">
                <Link href="/orcamento">Criar Agora</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
