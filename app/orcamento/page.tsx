import type { Metadata } from "next"
import OrcamentoClient from "./orcamento-client"

export const metadata: Metadata = {
  title: "Solicitar Orçamento | Via Betel",
  description: "Peça orçamento de instrutores certificados. A Via Betel conecta você aos melhores profissionais.",
}

export default function OrcamentoPage() {
  return <OrcamentoClient />
}
