import { getUser } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

const statusConfig = {
  STARTED: {
    icon: Clock,
    title: "Cadastro em Andamento",
    description: "Complete seu perfil para ativar sua conta de instrutor",
    nextStep: "/instrutor/onboarding",
    nextStepLabel: "Continuar Cadastro",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  PROFILE_DONE: {
    icon: Clock,
    title: "Perfil Completo",
    description: "Seu perfil foi enviado para revisão. Aguarde a aprovação.",
    nextStep: "/instrutor/status",
    nextStepLabel: "Aguardando Aprovação",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  UNDER_REVIEW: {
    icon: Clock,
    title: "Em Revisão",
    description: "Seus documentos estão sendo analisados pelo nosso time.",
    nextStep: "#",
    nextStepLabel: "Em Revisão",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  VERIFIED: {
    icon: CheckCircle2,
    title: "Verificado com Sucesso",
    description: "Sua conta foi aprovada! Você pode começar a receber alunos.",
    nextStep: "/instrutor/dashboard",
    nextStepLabel: "Ir para Dashboard",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  REJECTED: {
    icon: XCircle,
    title: "Solicitação Rejeitada",
    description: "Sua solicitação foi rejeitada. Você pode tentar novamente.",
    nextStep: "/instrutor/onboarding",
    nextStepLabel: "Tentar Novamente",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  SUSPENDED: {
    icon: AlertCircle,
    title: "Conta Suspensa",
    description: "Sua conta foi suspensa. Entre em contato com o suporte.",
    nextStep: "#",
    nextStepLabel: "Contatar Suporte",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
}

export default async function InstructorStatusPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login?returnTo=/instrutor/status")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("instructor_status").eq("id", user.id).single()

  if (!profile?.instructor_status) {
    redirect("/inscricao")
  }

  const status = profile.instructor_status as keyof typeof statusConfig
  const config = statusConfig[status] || statusConfig.STARTED
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0">
          <CardHeader className={`${config.bgColor} rounded-t-lg`}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={`${config.color} text-3xl mb-2`}>{config.title}</CardTitle>
                <CardDescription className={`${config.color} text-base`}>{config.description}</CardDescription>
              </div>
              <Icon className={`${config.color} w-12 h-12`} />
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {status === "REJECTED" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Motivo da rejeição:</strong> Documentação incompleta. Por favor, reenvie com todos os arquivos
                  solicitados.
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Status do Processo</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Conta Criada</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${status !== "STARTED" ? "text-gray-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${status !== "STARTED" ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span>Perfil Completo</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${["PROFILE_DONE", "UNDER_REVIEW", "VERIFIED"].includes(status) ? "text-gray-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${["PROFILE_DONE", "UNDER_REVIEW", "VERIFIED"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span>Documentos Enviados</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${status === "VERIFIED" ? "text-gray-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${status === "VERIFIED" ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span>Verificado</span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className={`w-full ${
                  status === "VERIFIED"
                    ? "bg-green-600 hover:bg-green-700"
                    : status === "REJECTED"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <Link href={config.nextStep}>{config.nextStepLabel}</Link>
              </Button>

              {status !== "VERIFIED" && (
                <p className="text-sm text-gray-600 text-center">
                  Precisa de ajuda? Entre em contato com nosso suporte.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
