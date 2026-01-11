"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Briefcase, TrendingUp, Shield } from "lucide-react"
import { motion } from "framer-motion"

const BENEFITS = [
  {
    icon: Briefcase,
    title: "Receba Solicitações",
    description: "Alunos podem solicitar seu atendimento",
  },
  {
    icon: TrendingUp,
    title: "Cresça seu Negócio",
    description: "Construa base de clientes com rating",
  },
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Plataforma segura com chat criptografado",
  },
]

export function AtivarInstructorClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/instructor/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        router.push("/instrutor/onboarding")
      }
    } catch (error) {
      console.error("Erro ao ativar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Torne-se um Instrutor</h1>
          <p className="text-xl text-gray-600">Comece a atender alunos e ganhe dinheiro com sua experiência</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">O que você precisa fazer:</h2>
          <ul className="space-y-4">
            {[
              "Completar seu perfil com foto e informações profissionais",
              "Listar as categorias em que você é especialista (CNH A, B, etc)",
              "Enviar documentos de verificação (RG, Certificados, etc)",
              "Aguardar aprovação de nossa equipe",
              "Começar a receber solicitações de alunos",
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button size="lg" onClick={handleStart} disabled={loading}>
            {loading ? "Carregando..." : "Começar Agora"}
          </Button>
        </div>
      </div>
    </div>
  )
}
