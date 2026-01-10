import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Política de Privacidade | Via Betel",
  description: "Como a Via Betel coleta, usa e protege seus dados pessoais.",
}

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: Janeiro de 2025 • Versão inicial</p>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">1. Introdução</h2>
              <p>
                A Via Betel respeita sua privacidade. Esta política explica como coletamos, usamos, armazenamos e
                protegemos seus dados pessoais de acordo com a LGPD (Lei Geral de Proteção de Dados).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">2. Dados Coletados</h2>
              <p>Coletamos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dados cadastrais: nome, email, telefone, endereço</li>
                <li>Dados de navegação: IP, cookies, páginas visitadas</li>
                <li>Dados de uso: interações, preferências, histórico de aulas</li>
                <li>Dados de pagamento: transações via intermediadores seguros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">3. Uso dos Dados</h2>
              <p>Usamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conectar você com instrutores adequados</li>
                <li>Processar pagamentos e emitir recibos</li>
                <li>Melhorar a experiência na plataforma</li>
                <li>Enviar notificações sobre aulas e atualizações</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">4. Compartilhamento de Dados</h2>
              <p>
                Compartilhamos dados apenas com instrutores credenciados (para agendar aulas) e parceiros técnicos
                (hospedagem, pagamento) sob contratos de confidencialidade. Nunca vendemos seus dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">5. Segurança</h2>
              <p>
                Utilizamos criptografia SSL, firewalls e auditorias regulares para proteger seus dados contra acesso não
                autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">6. Seus Direitos (LGPD)</h2>
              <p>Você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar se tratamos seus dados</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar exclusão de dados</li>
                <li>Revogar consentimento</li>
                <li>Portabilidade de dados</li>
              </ul>
              <p className="mt-4">
                Para exercer esses direitos, envie email para{" "}
                <a href="mailto:privacidade@viabetel.com" className="text-emerald-600 hover:underline">
                  privacidade@viabetel.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">7. Cookies</h2>
              <p>
                Usamos cookies essenciais (login, carrinho) e analíticos (Google Analytics). Você pode gerenciar cookies
                nas configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-3">8. Alterações na Política</h2>
              <p>
                Podemos atualizar esta política. Mudanças significativas serão notificadas por email e na plataforma.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
