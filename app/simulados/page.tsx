import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Simulados CNH | Via Betel",
  description: "Prepare-se para a prova teórica com nossos simulados de CNH.",
}

export default function SimuladosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Simulados CNH</h1>
          <p className="text-lg text-gray-600 mb-8">
            Em breve você poderá praticar com simulados completos da prova teórica do DETRAN.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-3">Simulado Completo</h2>
              <p className="text-gray-700 mb-4">
                30 questões baseadas no exame oficial do DETRAN para testar seus conhecimentos.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
              >
                Em Breve
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-3">Questões por Tema</h2>
              <p className="text-gray-700 mb-4">
                Pratique questões específicas de legislação, direção defensiva, primeiros socorros e mais.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
              >
                Em Breve
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
