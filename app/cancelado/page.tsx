import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CanceladoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Pagamento Cancelado</h1>

        <p className="text-gray-600">
          Você cancelou o processo de pagamento. Não se preocupe, você pode tentar novamente quando quiser.
        </p>

        <div className="space-y-3">
          <Link href="/instrutores" className="block">
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 text-lg">
              Voltar para Instrutores
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 bg-transparent">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
