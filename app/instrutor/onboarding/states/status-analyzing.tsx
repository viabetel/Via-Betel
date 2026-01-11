import type { InstructorProfile } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Home } from "lucide-react"
import Link from "next/link"

interface StatusAnalyzingProps {
  profile: InstructorProfile
}

export default function StatusAnalyzing({ profile }: StatusAnalyzingProps) {
  const docs = [
    { label: "CNH", completed: !!profile.cnhUrl },
    { label: "Certificado", completed: !!profile.certificadoUrl },
    { label: "Vínculo", completed: profile.isLinkedToAutoescola ? !!profile.vinculoUrl : true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-2 border-blue-200 shadow-2xl">
          <div className="p-8 text-center">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              EM ANÁLISE
            </Badge>

            <h1 className="text-3xl font-bold text-blue-900 mb-2">Cadastro em Análise</h1>
            <p className="text-gray-600 mb-6">
              Obrigado por enviar seus documentos! Nossa equipe está revisando seu cadastro.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200 text-left">
              <h3 className="font-semibold text-blue-900 mb-4">Documentos Enviados:</h3>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.label} className="flex items-center gap-3">
                    {doc.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={doc.completed ? "text-emerald-600 font-medium" : "text-gray-600"}>
                      {doc.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-amber-800">
                ⏱️ <strong>Prazo estimado:</strong> Responderemos em até 3 dias úteis
              </p>
            </div>

            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
