"use client"

import type { InstructorProfile } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

interface StatusRejectedProps {
  profile: InstructorProfile
  onRetry: () => void
}

export default function StatusRejected({ profile, onRetry }: StatusRejectedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-2 border-red-200 shadow-2xl">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />

            <Badge variant="destructive" className="mb-4">
              CADASTRO REPROVADO
            </Badge>

            <h1 className="text-3xl font-bold text-red-900 mb-2">Cadastro Reprovado</h1>
            <p className="text-gray-600 mb-6">
              Infelizmente, seu cadastro não foi aprovado. Verifique os documentos e tente novamente.
            </p>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                onClick={onRetry}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              >
                Reenviar Documentos
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
