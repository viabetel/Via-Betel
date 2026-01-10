import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Política de Cookies | Via Betel",
  description: "Como a Via Betel usa cookies e tecnologias similares.",
}

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Política de Cookies</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2025 • Versão inicial</p>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles
                ajudam a melhorar sua experiência e permitem funcionalidades essenciais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Tipos de Cookies que Usamos</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">1. Cookies Essenciais</h3>
                  <p>
                    Necessários para o funcionamento básico da plataforma (login, carrinho, preferências). Não podem ser
                    desativados.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">2. Cookies de Desempenho</h3>
                  <p>
                    Coletam informações anônimas sobre como você usa o site (páginas visitadas, tempo de permanência)
                    para melhorar a performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">3. Cookies de Funcionalidade</h3>
                  <p>Lembram suas preferências (idioma, localização) para oferecer uma experiência personalizada.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">4. Cookies de Marketing</h3>
                  <p>
                    Usados para exibir anúncios relevantes e medir a eficácia de campanhas publicitárias. Requerem seu
                    consentimento.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Como Gerenciar Cookies</h2>
              <p>Você pode controlar cookies através de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Configurações do navegador (Chrome, Firefox, Safari, Edge)</li>
                <li>Banner de consentimento ao acessar o site</li>
                <li>Ferramentas de opt-out de terceiros (Google Analytics)</li>
              </ul>
              <p className="mt-4">
                <strong>Atenção:</strong> Desabilitar cookies essenciais pode prejudicar o funcionamento da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Cookies de Terceiros</h2>
              <p>Utilizamos cookies de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics (análise de tráfego)</li>
                <li>Vercel (hospedagem e performance)</li>
                <li>Supabase (autenticação e banco de dados)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Contato</h2>
              <p>
                Dúvidas sobre cookies? Entre em contato:{" "}
                <a href="mailto:contato@viabetel.com" className="text-emerald-600 hover:underline">
                  contato@viabetel.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
