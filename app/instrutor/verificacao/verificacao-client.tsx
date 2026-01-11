"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const REQUIRED_DOCS = [
  { id: "ID", name: "Documento de Identidade", description: "RG ou CNH válidos" },
  { id: "CERTIFICATE", name: "Certificado de Instrutor", description: "Comprovação de qualificação" },
  {
    id: "BACKGROUND_CHECK",
    name: "Antecedentes",
    description: "Comprovação de idoneidade (opcional)",
  },
]

export default function VerificacaoClient() {
  const router = useRouter()
  const [uploads, setUploads] = useState<Record<string, File | null>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFileSelect = (docId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "Arquivo muito grande (máx 10MB)" })
      return
    }

    setUploads({ ...uploads, [docId]: file })
  }

  const handleSubmit = async () => {
    if (!uploads.ID || !uploads.CERTIFICATE) {
      setMessage({ type: "error", text: "Envie pelo menos ID e Certificado" })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(uploads).forEach(([docId, file]) => {
        if (file) formData.append(docId, file)
      })

      const res = await fetch("/api/instructor/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Documentos enviados! Aguarde análise." })
        setTimeout(() => router.push("/conta/perfil"), 2000)
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "Erro ao enviar" })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setMessage({ type: "error", text: "Erro ao enviar documentos" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verificação de Identidade</h1>
          <p className="text-gray-600">Envie documentos para verificação de sua identidade</p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {REQUIRED_DOCS.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                  {uploads[doc.id] && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>

                <label className="block">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(doc.id, e.target.files[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">{uploads[doc.id]?.name || "Clique ou arraste um arquivo"}</p>
                    <p className="text-xs text-gray-500">JPG, PNG ou PDF (máx 10MB)</p>
                  </div>
                </label>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar para Análise"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
