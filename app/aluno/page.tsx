import type { Metadata } from "next"
import AlunoClientPage from "./aluno-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Quero Aprender - Encontre seu Instrutor de Direção",
  description:
    "Cadastre-se gratuitamente e encontre instrutores de direção qualificados perto de você. Aulas práticas para todas as categorias (A, B, C, D, E). Comece sua jornada para a CNH agora!",
  openGraph: {
    title: "Quero Aprender - Via Betel",
    description: "Encontre instrutores de direção qualificados perto de você",
    url: "https://viabetel.com/aluno",
  },
}

export default function AlunoPage() {
  return <AlunoClientPage />
}
