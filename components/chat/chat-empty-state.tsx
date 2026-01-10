"use client"

import { MessageCircle, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PremiumCard } from "@/components/ui/premium-card"
import { AppLink } from "@/components/app-link"

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PremiumCard className="max-w-md text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Selecione uma conversa</h3>
        <p className="text-sm text-gray-600 mb-6">
          Escolha uma conversa na lista à esquerda ou inicie um novo contato com um instrutor.
        </p>

        <div className="space-y-3">
          <AppLink href="/instrutores" className="block">
            <Button className="w-full text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Search className="w-4 h-4 mr-2" />
              Buscar instrutores
            </Button>
          </AppLink>

          <AppLink href="/suporte" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              <HelpCircle className="w-4 h-4 mr-2" />
              Abrir suporte
            </Button>
          </AppLink>
        </div>
      </PremiumCard>
    </div>
  )
}
