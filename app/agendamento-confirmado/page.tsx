import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AgendamentoConfirmadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Agendamento Recebido!</h1>

        <p className="text-gray-600">
          Suas preferências de horário foram registradas com sucesso. A equipe da Via Betel entrará em contato em até 24
          horas para confirmar os horários com seu instrutor.
        </p>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900 font-medium">
            Você receberá uma confirmação por WhatsApp assim que os horários forem validados.
          </p>
        </div>

        <Link href="/" className="block">
          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6">
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
