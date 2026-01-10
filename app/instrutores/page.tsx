import type { Metadata } from "next"
import InstrutoresClient from "./instrutores-client"

export const metadata: Metadata = {
  title: "Encontre Instrutores de Direção | Via Betel",
  description:
    "Marketplace de instrutores de direção qualificados. Busque por cidade, categoria CNH (A, B, C, D, E), preço e avaliação. Encontre o instrutor ideal para você em Juiz de Fora e todo Brasil.",
  keywords: [
    "instrutores de direção",
    "aulas de direção",
    "instrutor particular",
    "categoria A",
    "categoria B",
    "categoria C",
    "categoria D",
    "categoria E",
    "Juiz de Fora",
    "MG",
    "auto escola",
    "CNH",
  ],
  openGraph: {
    title: "Encontre Instrutores de Direção - Via Betel",
    description: "Marketplace de instrutores qualificados para todas as categorias de CNH",
    url: "https://viabetel.com/instrutores",
  },
}

export default function InstrutoresPage() {
  return <InstrutoresClient />
}
