import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Termos de Uso | Via Betel",
  description: "Termos e condições de uso da plataforma Via Betel.",
}

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Termos de Uso</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2025 • Versão inicial</p>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma Via Betel, você concorda com estes Termos de Uso. Se não concordar, não
                utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">2. Descrição do Serviço</h2>
              <p>
                A Via Betel é uma plataforma que conecta alunos interessados em tirar CNH com instrutores de direção
                certificados. Não somos uma autoescola, mas uma intermediadora de serviços educacionais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">3. Cadastro e Conta</h2>
              <p>
                Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades
                realizadas em sua conta. Dados falsos ou fraudulentos resultarão em suspensão imediata.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">4. Uso Proibido</h2>
              <p>É proibido usar a plataforma para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publicar conteúdo ofensivo, difamatório ou ilegal</li>
                <li>Tentar acessar sistemas sem autorização</li>
                <li>Contornar medidas de segurança da plataforma</li>
                <li>Usar dados de terceiros sem permissão</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma (textos, logos, design) é propriedade da Via Betel e protegido por leis de
                direitos autorais. Uso não autorizado é proibido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">6. Limitação de Responsabilidade</h2>
              <p>
                A Via Betel não se responsabiliza por danos diretos ou indiretos decorrentes do uso da plataforma. As
                aulas e serviços são de responsabilidade exclusiva dos instrutores credenciados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">7. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Mudanças significativas serão
                comunicadas por email aos usuários registrados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">8. Contato</h2>
              <p>
                Para dúvidas sobre estes termos, entre em contato através de{" "}
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
