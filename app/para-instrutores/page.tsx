import type { Metadata } from "next"
import ParaInstrutoresClient from "./para-instrutores-client"

export const metadata: Metadata = {
  title: "Para Instrutores - Assine e Apareça | Via Betel",
  description: "Conecte-se com alunos qualificados. Assinatura mensal a partir de R$ 99. Gestão de leads e pagamentos.",
}

export default function ParaInstrutoresPage() {
  return <ParaInstrutoresClient />
}
