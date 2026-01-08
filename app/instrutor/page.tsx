import type { Metadata } from "next"
import InstrutorClientPage from "./instrutor-client"

export const metadata: Metadata = {
  title: "Seja um Instrutor - Conecte-se com Alunos",
  description:
    "Cadastre-se como instrutor de direção na Via Betel e conecte-se com alunos que procuram aulas práticas. Amplie sua base de alunos e gerencie suas aulas com flexibilidade.",
  openGraph: {
    title: "Seja um Instrutor - Via Betel",
    description: "Conecte-se com alunos e amplie sua base de clientes",
    url: "https://viabetel.com/instrutor",
  },
}

export default function InstrutorPage() {
  return <InstrutorClientPage />
}
