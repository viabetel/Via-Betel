import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContaPerfilClient } from "./perfil/perfil-client"
import { getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Minha Conta | Via Betel",
  description: "Gerencie suas informações, preferências e configurações da sua conta Via Betel",
}

export default async function ContaPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login?returnTo=/conta")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="mt-6">
            <ContaPerfilClient />
          </TabsContent>

          <TabsContent value="seguranca" className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Segurança</h2>
              <p className="text-gray-600">Gerencie sua senha e configurações de segurança.</p>
              {/* TODO: Implementar aba de segurança */}
            </div>
          </TabsContent>

          <TabsContent value="configuracoes" className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Configurações</h2>
              <p className="text-gray-600">Personalize suas preferências e notificações.</p>
              {/* TODO: Implementar aba de configurações */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
