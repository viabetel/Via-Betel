import { ContaDisponibilidadeClient } from "./disponibilidade-client"

export const metadata = {
  title: "Disponibilidade - Via Betel",
  description: "Gerencie sua disponibilidade de horários",
}

export default function DisponibilidadePage() {
  return <ContaDisponibilidadeClient />
}
