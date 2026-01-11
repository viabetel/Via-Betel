import { Suspense } from "react"
import { InscricaoContent } from "./inscricao-content"

export default function InscricaoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <InscricaoContent />
    </Suspense>
  )
}
