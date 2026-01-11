import { Suspense } from "react"
import SignUpContent from "./sign-up-content"

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <SignUpContent />
    </Suspense>
  )
}
