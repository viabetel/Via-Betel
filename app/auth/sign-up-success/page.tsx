import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-center">Conta Criada!</CardTitle>
            <CardDescription className="text-center">Verifique seu email</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Enviamos um email de confirmação. Por favor, clique no link para ativar sua conta antes de fazer login.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
              <Link href="/auth/login">Ir para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
