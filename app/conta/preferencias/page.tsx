import { ContaPreferenciasClient } from "./preferencias-client"

export const metadata = {
  title: "Preferências - Via Betel",
  description: "Configure suas preferências",
}

export default function PreferenciasPage() {
  return <ContaPreferenciasClient />
}
