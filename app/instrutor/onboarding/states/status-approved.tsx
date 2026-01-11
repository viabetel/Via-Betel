import type { InstructorProfile } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Home, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

interface StatusApprovedProps {
  profile: InstructorProfile
}

export default function StatusApproved({ profile }: StatusApprovedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-2 border-emerald-200 shadow-2xl">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
            </div>

            <Badge className="mb-4 bg-emerald-100 text-emerald-700">INSTRUTOR VERIFICADO</Badge>

            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Parabéns! 🎉</h1>
            <p className="text-gray-600 mb-6 text-lg">
              Seu cadastro como instrutor foi aprovado! Agora você pode acessar todas as funcionalidades.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-900">Encontre Alunos</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <MessageSquare className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-900">Converse</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-900">Planos</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/meus-planos">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                  Meus Planos
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
