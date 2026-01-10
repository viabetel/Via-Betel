import { ContaAnunciosClient } from "./anuncios-client"

export const metadata = {
  title: "Meu Anúncio - Via Betel",
  description: "Gerencie seu perfil público no marketplace",
}

export default function AnunciosPage() {
  return <ContaAnunciosClient />
}
