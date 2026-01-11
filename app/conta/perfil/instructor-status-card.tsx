"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface InstructorStatusCardProps {
  status: string
  rejectionReason?: string | null
}

const statusConfig = {
  NONE: {
    icon: null,
    label: "Aluno",
    description: "Deseja se tornar instrutor?",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  STARTED: {
    icon: Clock,
    label: "Cadastro Iniciado",
    description: "Finalize seu perfil de instrutor",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  PROFILE_DONE: {
    icon: CheckCircle2,
    label: "Perfil Completo",
    description: "Envie documentos para verificação",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  UNDER_REVIEW: {
    icon: Clock,
    label: "Em Análise",
    description: "Seus documentos estão sendo analisados",
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  VERIFIED: {
    icon: CheckCircle2,
    label: "Verificado",
    description: "Você está aprovado como instrutor",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
  REJECTED: {
    icon: AlertCircle,
    label: "Reprovado",
    description: "Sua solicitação foi reprovada",
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-700",
  },
}

export function InstructorStatusCard({ status, rejectionReason }: InstructorStatusCardProps) {
  const router = useRouter()
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NONE
  const Icon = config.icon

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className={`p-6 border-2 ${config.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {Icon && <Icon className="w-5 h-5" />}
              <h3 className="font-semibold text-lg">{config.label}</h3>
              <Badge className={config.badgeColor}>{status}</Badge>
            </div>
            <p className="text-sm text-gray-600">{config.description}</p>
            {status === "REJECTED" && (
              <p className="text-sm text-red-600 mt-2">{rejectionReason || "Sua solicitação foi reprovada"}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {status === "NONE" && (
            <Button onClick={() => router.push("/instrutor/ativar")} className="w-full">
              Tornar-se Instrutor
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {status === "STARTED" && (
            <Button onClick={() => router.push("/instrutor/onboarding")} className="w-full">
              Continuar Cadastro
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {status === "PROFILE_DONE" && (
            <Button onClick={() => router.push("/instrutor/verificacao")} className="w-full">
              Enviar Documentos
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {(status === "VERIFIED" || status === "UNDER_REVIEW") && (
            <Button variant="outline" onClick={() => router.push("/instrutor/dashboard")} className="w-full">
              Ver Dashboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {status === "REJECTED" && (
            <Button variant="outline" onClick={() => router.push("/instrutor/ativar")} className="w-full">
              Tentar Novamente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
