"use client"
import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase/client"
import { LoadingState } from "@/components/loading-state"
import { Button } from "@/components/ui/button"

export default function VerificacaoPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [docs, setDocs] = useState({
    cnh: null as File | null,
    certificado: null as File | null,
    vinculo: null as File | null,
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile(data)
      } catch (error) {
        console.error("[v0] Load profile error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleUpload = async (docType: "cnh" | "certificado" | "vinculo") => {
    const file = docs[docType]
    if (!file) return

    setUploading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const fileName = `${user.id}/${docType}-${Date.now()}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(uploadData.path)

      // Save document record
      await supabase.from("documents").insert({
        id: crypto.randomUUID(),
        ownerId: user.id,
        type: docType.toUpperCase(),
        documentUrl: urlData.publicUrl,
        status: "PENDING_DOCS",
        createdAt: new Date().toISOString(),
      })

      setDocs({ ...docs, [docType]: null })
      alert("Documento enviado com sucesso!")
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Erro ao enviar documento")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <LoadingState message="Carregando..." />

  return (
    <div className="container-custom py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Verificação de Instrutor</h1>

      <div className="bg-white rounded-lg p-6 border mb-6">
        <p className="text-gray-600 mb-6">
          Para começar a receber solicitações de alunos, você precisa passar pelo processo de verificação enviando seus
          documentos.
        </p>

        <div className="space-y-6">
          {/* CNH */}
          <div>
            <h3 className="font-bold mb-2">CNH</h3>
            <p className="text-sm text-gray-500 mb-3">Envie uma cópia da sua CNH</p>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setDocs({ ...docs, cnh: e.target.files?.[0] || null })}
                className="flex-1 px-4 py-2 border rounded-lg text-sm"
              />
              <Button onClick={() => handleUpload("cnh")} disabled={!docs.cnh || uploading}>
                {uploading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          {/* Certificado */}
          <div>
            <h3 className="font-bold mb-2">Certificado de Instrutor</h3>
            <p className="text-sm text-gray-500 mb-3">Envie seu certificado de instrutor de trânsito</p>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setDocs({ ...docs, certificado: e.target.files?.[0] || null })}
                className="flex-1 px-4 py-2 border rounded-lg text-sm"
              />
              <Button onClick={() => handleUpload("certificado")} disabled={!docs.certificado || uploading}>
                {uploading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          {/* Vínculo */}
          <div>
            <h3 className="font-bold mb-2">Vínculo com Auto Escola (Opcional)</h3>
            <p className="text-sm text-gray-500 mb-3">
              Se for vinculado a uma auto escola, envie o documento de vínculo
            </p>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setDocs({ ...docs, vinculo: e.target.files?.[0] || null })}
                className="flex-1 px-4 py-2 border rounded-lg text-sm"
              />
              <Button onClick={() => handleUpload("vinculo")} disabled={!docs.vinculo || uploading}>
                {uploading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Status atual:</strong> {profile?.verificationStatus || "PENDING_DOCS"}
          </p>
          <p className="text-sm text-blue-800 mt-2">
            Nosso time de verificação analisará seus documentos dentro de 24-48 horas. Você receberá um email
            confirmando a aprovação ou solicitando ajustes.
          </p>
        </div>
      </div>
    </div>
  )
}
