import { NextResponse } from "next/server"

export async function GET() {
  try {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
    const smtpPort = process.env.SMTP_PORT || "465"
    const smtpSecure = process.env.SMTP_SECURE || "true"
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const emailFrom = process.env.EMAIL_FROM || "contato@viabetel.com"
    const emailTo = process.env.EMAIL_TO || "contato@viabetel.com"

    return NextResponse.json({
      has_SMTP_USER: !!smtpUser,
      has_SMTP_PASS: !!smtpPass,
      smtp_host: smtpHost,
      smtp_port: smtpPort,
      smtp_secure: smtpSecure,
      email_from: emailFrom,
      email_to: emailTo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao verificar configuração de email",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
