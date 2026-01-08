import { NextResponse } from "next/server"

type EmailData = {
  tipo: "aluno" | "instrutor"
  dados: {
    nome: string
    whatsapp: string
    cidade: string
    uf: string
    [key: string]: any
  }
}

export async function POST(request: Request) {
  try {
    const body: EmailData = await request.json()
    const { tipo, dados } = body

    const htmlContent =
      tipo === "aluno"
        ? `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
    .field { margin-bottom: 15px; padding: 10px; background: white; border-left: 3px solid #059669; border-radius: 4px; }
    .label { font-weight: bold; color: #059669; margin-bottom: 5px; }
    .value { color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎓 Novo Aluno Cadastrado - Via Betel</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Nome:</div>
        <div class="value">${dados.nome}</div>
      </div>
      <div class="field">
        <div class="label">WhatsApp:</div>
        <div class="value">${dados.whatsapp}</div>
      </div>
      <div class="field">
        <div class="label">Localização:</div>
        <div class="value">${dados.cidade}/${dados.uf}</div>
      </div>
      <div class="field">
        <div class="label">Categoria Desejada:</div>
        <div class="value">${dados.categoria}</div>
      </div>
      <div class="field">
        <div class="label">Objetivo:</div>
        <div class="value">${dados.objetivo}</div>
      </div>
      <div class="field">
        <div class="label">Melhor Horário:</div>
        <div class="value">${dados.horario}</div>
      </div>
    </div>
  </div>
</body>
</html>
`
        : `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
    .field { margin-bottom: 15px; padding: 10px; background: white; border-left: 3px solid #d97706; border-radius: 4px; }
    .label { font-weight: bold; color: #d97706; margin-bottom: 5px; }
    .value { color: #4b5563; }
    .schedule { display: grid; gap: 8px; margin-top: 10px; }
    .day { font-size: 13px; padding: 8px; background: #fef3c7; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>👨‍🏫 Novo Instrutor Cadastrado - Via Betel</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Nome:</div>
        <div class="value">${dados.nome}</div>
      </div>
      <div class="field">
        <div class="label">WhatsApp:</div>
        <div class="value">${dados.whatsapp}</div>
      </div>
      <div class="field">
        <div class="label">Localização:</div>
        <div class="value">${dados.cidade}/${dados.uf}</div>
      </div>
      <div class="field">
        <div class="label">Categorias que Ensina:</div>
        <div class="value">${dados.categorias.join(", ")}</div>
      </div>
      <div class="field">
        <div class="label">Experiência:</div>
        <div class="value">${dados.experiencia}</div>
      </div>
      <div class="field">
        <div class="label">Veículo Próprio:</div>
        <div class="value">${dados.veiculo}</div>
      </div>
      <div class="field">
        <div class="label">Disponibilidade Semanal:</div>
        <div class="schedule">
          ${Object.entries(dados.weekSchedule)
            .filter(([_, schedule]: [string, any]) => Object.values(schedule).some((v) => v))
            .map(([dia, schedule]: [string, any]) => {
              const periodos = Object.entries(schedule)
                .filter(([_, disponivel]) => disponivel)
                .map(([periodo]) => periodo)
                .join(", ")
              return `<div class="day"><strong>${dia}:</strong> ${periodos}</div>`
            })
            .join("")}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

    const emailConfig = {
      from: "Via Betel <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "contato@viabetel.com.br",
      subject: tipo === "aluno" ? `🎓 Novo Aluno: ${dados.nome}` : `👨‍🏫 Novo Instrutor: ${dados.nome}`,
      html: htmlContent,
      text:
        tipo === "aluno"
          ? `Novo Aluno Cadastrado\n\nNome: ${dados.nome}\nWhatsApp: ${dados.whatsapp}\nCidade: ${dados.cidade}/${dados.uf}\nCategoria: ${dados.categoria}\nObjetivo: ${dados.objetivo}\nHorário: ${dados.horario}`
          : `Novo Instrutor Cadastrado\n\nNome: ${dados.nome}\nWhatsApp: ${dados.whatsapp}\nCidade: ${dados.cidade}/${dados.uf}\nCategorias: ${dados.categorias.join(", ")}\nExperiência: ${dados.experiencia}\nVeículo: ${dados.veiculo}`,
    }

    // Se tiver a API KEY do Resend configurada, usa Resend
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailConfig),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json()
        console.error("[v0] Erro Resend:", errorData)
        throw new Error(`Erro ao enviar email via Resend: ${errorData.message || resendResponse.statusText}`)
      }

      const resendData = await resendResponse.json()
      return NextResponse.json({ success: true, provider: "resend", data: resendData })
    }

    // Fallback: apenas log para desenvolvimento
    console.log("[v0] Email que seria enviado:", emailConfig)

    return NextResponse.json({
      success: true,
      provider: "console",
      message: "Email registrado no console. Configure RESEND_API_KEY para enviar emails reais.",
    })
  } catch (error) {
    console.error("[v0] Erro ao processar envio de email:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
