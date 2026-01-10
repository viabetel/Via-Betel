import { Suspense } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function SucessoContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Pagamento Confirmado!</h1>

        <p className="text-gray-600">
          Seu pagamento foi processado com sucesso. Agora você pode agendar suas aulas de direção.
        </p>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800 font-medium">
            A Via Betel entrará em contato em até 24h para confirmar os horários disponíveis com seu instrutor.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/agendar" className="block">
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 text-lg">
              Agendar Minhas Aulas
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full border-2 border-emerald-600 text-emerald-600 bg-transparent">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Carregando...</div>
        </div>
      }
    >
      <SucessoContent />
    </Suspense>
  )
}
