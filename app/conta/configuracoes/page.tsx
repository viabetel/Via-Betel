import { ContaConfiguracoesClient } from "./configuracoes-client"

export const metadata = {
  title: "Configurações | Via Betel",
  description: "Gerencie as configurações da sua conta.",
}

export default function ConfiguracoesPage() {
  return <ContaConfiguracoesClient />
}
