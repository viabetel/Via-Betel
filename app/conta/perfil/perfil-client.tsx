"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ContaPerfilClient() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refresh } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    bio: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta/perfil")
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        bio: profile.bio || "",
      })
    }
  }, [user, profile, authLoading, router])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          city: formData.city,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      await refresh()
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
    } catch (error: any) {
      console.error("[v0] Erro ao salvar perfil:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar perfil. Tente novamente." })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/conta" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Perfil</h1>

          {message && (
            <div
              className={`flex items-start gap-2 p-4 rounded-lg mb-6 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || "Avatar"}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-emerald-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-3xl">
                  {(formData.full_name || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Foto de perfil</h3>
                <p className="text-sm text-gray-600 mb-3">Recomendamos uma imagem quadrada de pelo menos 400x400px</p>
                <Button variant="outline" size="sm" disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Alterar foto (em breve)
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled className="mt-1.5 bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1.5">O email não pode ser alterado</p>
            </div>

            <div>
              <Label htmlFor="full_name">Nome completo *</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Digite seu nome completo"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                placeholder="Ex: São Paulo - SP"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {profile?.role === "INSTRUCTOR" && (
              <div>
                <Label htmlFor="bio">Biografia</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Conte um pouco sobre sua experiência como instrutor..."
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Esta informação será exibida no seu perfil público no marketplace
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
              <Button variant="outline" onClick={() => router.push("/conta")} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
