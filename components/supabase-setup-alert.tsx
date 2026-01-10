"use client"

import { useState } from "react"
import { AlertCircle, Database, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function SupabaseSetupAlert() {
  // O alerta agora é mostrado apenas via query param ?setup=1 para debug
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if setup alert should be shown via query param
  const shouldShow = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("setup") === "1"

  if (!shouldShow || isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                <strong className="text-sm font-semibold">Configuração do Banco Necessária</strong>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-2">
                O sistema de chat e tracking de solicitações requer configuração do banco Supabase.
              </p>
              <details className="text-xs space-y-1">
                <summary className="cursor-pointer font-medium hover:underline mb-2">
                  📋 Como resolver (clique para expandir)
                </summary>
                <ol className="list-decimal list-inside space-y-1 pl-2 bg-white/10 rounded p-2">
                  <li>
                    Acesse:{" "}
                    <a
                      href="https://supabase.com/dashboard/project/goprgbfccixpwvshonvx/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-amber-100"
                    >
                      Supabase SQL Editor
                    </a>
                  </li>
                  <li>
                    Abra o arquivo{" "}
                    <code className="bg-black/20 px-1 rounded">scripts/002_complete_trust_system.sql</code> no projeto
                  </li>
                  <li>Copie TODO o conteúdo do arquivo (Ctrl+A, Ctrl+C)</li>
                  <li>Cole no SQL Editor do Supabase e clique em "Run"</li>
                  <li>Aguarde ~5 segundos até ver a mensagem de sucesso</li>
                  <li>Recarregue esta página</li>
                </ol>
                <p className="pt-2 text-[11px] opacity-90">
                  💡 Mais detalhes em <code className="bg-black/20 px-1 rounded">SUPABASE_SETUP.md</code>
                </p>
              </details>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Fechar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
