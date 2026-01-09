/**
 * Script de teste para enviar um email de teste usando a API Resend
 * Execute este script para verificar se a integração de email está funcionando
 */

const testData = {
  type: "aluno",
  formData: {
    nome: "João Silva (TESTE)",
    email: "teste@example.com",
    telefone: "(31) 98765-4321",
    cpf: "123.456.789-00",
    dataNascimento: "1990-05-15",
    categoria: "B",
    horarioPreferencia: "Manhã",
    observacoes: "Este é um email de teste do sistema Via Betel",
  },
}

async function sendTestEmail() {
  console.log("[v0] Iniciando teste de envio de email...")
  console.log("[v0] Dados do teste:", JSON.stringify(testData, null, 2))

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    console.log("[v0] Status da resposta:", response.status)

    const result = await response.json()
    console.log("[v0] Resultado:", JSON.stringify(result, null, 2))

    if (result.success) {
      console.log("[v0] ✅ Email de teste enviado com sucesso!")
      console.log("[v0] ID do email:", result.data?.id)
      console.log("[v0] Verifique a caixa de entrada de: contatoviabetel@gmail.com")
    } else {
      console.log("[v0] ❌ Erro ao enviar email de teste")
      console.log("[v0] Erro:", result.error)
    }
  } catch (error) {
    console.error("[v0] ❌ Erro na requisição:", error)
  }
}

// Executar o teste
sendTestEmail()
