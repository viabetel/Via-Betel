import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle2, Clock, FileText, CreditCard } from "lucide-react"

export const metadata = {
  title: "Renovação CNH | Via Betel",
  description: "Saiba como renovar sua CNH com a Via Betel.",
}

export default function RenovacaoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Renovação de CNH</h1>
          <p className="text-lg text-gray-600 mb-12">
            Renove sua Carteira Nacional de Habilitação de forma rápida e descomplicada.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">Quando Renovar?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>A cada 5 anos para condutores com menos de 50 anos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>A cada 3 anos para condutores entre 50 e 70 anos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>A cada 3 anos para condutores acima de 70 anos (com avaliação especial)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Documentos Necessários</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>RG ou CNH (original e cópia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>CPF (original e cópia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Comprovante de residência atualizado</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Passo a Passo da Renovação</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">1. Agendamento</h3>
                <p className="text-sm text-white/90">Agende os exames médico e psicológico no DETRAN</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">2. Exames</h3>
                <p className="text-sm text-white/90">Realize os exames médico e psicotécnico em clínica credenciada</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">3. Pagamento</h3>
                <p className="text-sm text-white/90">Pague as taxas do DETRAN (valores conforme tabela estadual)</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">4. Recebimento</h3>
                <p className="text-sm text-white/90">Receba sua CNH renovada em até 30 dias</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              A Via Betel em breve oferecerá serviço completo de assessoria para renovação de CNH.
            </p>
            <button
              disabled
              className="px-8 py-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
            >
              Serviço em Breve
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
