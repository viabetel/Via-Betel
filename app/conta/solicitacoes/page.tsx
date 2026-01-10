import { ContaSolicitacoesClient } from "./solicitacoes-client"

export const metadata = {
  title: "Minhas Solicitações - Via Betel",
  description: "Acompanhe suas solicitações de aulas",
}

export default function SolicitacoesPage() {
  return <ContaSolicitacoesClient />
}
