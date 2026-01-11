"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2, User, Award, Briefcase } from "lucide-react"
import { AppLink } from "@/components/app-link"
import Image from "next/image"

export function ContaPerfilClient() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refresh } = useAuth()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false) // added deleting state
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [stats, setStats] = useState({
    profileCompleteness: 0,
    solicitacoes: 0,
    favoritos: 0,
    avaliacoes: 0,
    rating: 0,
  })

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    bio: "",
    // Campos específicos para instrutores
    categories: [] as string[],
    hourly_rate: 0,
    available_regions: "",
    experience_years: 0,
    specialties: [] as string[],
  })

  useEffect(() => {
    if (profile) {
      let completeness = 20 // email sempre existe
      if (profile.full_name) completeness += 20
      if (profile.phone) completeness += 20
      if (profile.city) completeness += 20
      if (profile.bio) completeness += 20

      setStats((prev) => ({
        ...prev,
        profileCompleteness: completeness,
      }))
    }
  }, [profile])

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
        categories: profile.categories || [],
        hourly_rate: profile.hourly_rate || 0,
        available_regions: profile.available_regions || "",
        experience_years: profile.experience_years || 0,
        specialties: profile.specialties || [],
      })
    }
  }, [user, profile, authLoading, router])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const updateData: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        city: formData.city,
        bio: formData.bio,
        updated_at: new Date().toISOString(),
      }

      // Adicionar campos específicos de instrutor se aplicável
      if (profile?.role === "INSTRUCTOR") {
        updateData.categories = formData.categories
        updateData.hourly_rate = formData.hourly_rate
        updateData.available_regions = formData.available_regions
        updateData.experience_years = formData.experience_years
        updateData.specialties = formData.specialties
      }

      const { error } = await supabase.from("profiles").update(updateData).eq("id", user.id)

      if (error) throw error

      await refresh()
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })

      setTimeout(() => setMessage(null), 5000)
    } catch (error: any) {
      console.error("[v0] Erro ao salvar perfil:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar perfil. Tente novamente." })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    const confirmDelete = prompt(
      'Digite "EXCLUIR" para confirmar a exclusão permanente da sua conta. Esta ação não pode ser desfeita.',
    )

    if (confirmDelete !== "EXCLUIR") {
      return
    }

    setDeleting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "EXCLUIR" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao deletar conta")
      }

      setMessage({ type: "success", text: "Conta deletada com sucesso. Redirecionando..." })
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Delete account error:", error)
      setMessage({ type: "error", text: error.message || "Erro ao deletar conta. Tente novamente." })
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-600">Carregando seu perfil...</p>
      </motion.div>
    )
  }

  if (!user) return null

  const isInstructor = profile?.role === "INSTRUCTOR"
  const completenessColor =
    stats.profileCompleteness === 100
      ? "text-emerald-600"
      : stats.profileCompleteness >= 60
        ? "text-amber-600"
        : "text-red-600"

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div className="mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <AppLink
            href="/conta"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </AppLink>
        </motion.div>

        {/* Header com Avatar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PremiumCard className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name || "User"}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-emerald-200"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-emerald-200">
                    {(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.full_name || "Usuário"}</h1>
                <p className="text-gray-600 mb-3">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">
                    {isInstructor ? "Instrutor" : "Aluno"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.profileCompleteness}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${completenessColor}`}>{stats.profileCompleteness}%</span>
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Mensagem de feedback */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário de Edição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Dados Pessoais */}
          <PremiumCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Dados Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Juiz de Fora - MG"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="mt-1 bg-gray-100" />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="bio">Sobre você</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder={
                  isInstructor
                    ? "Conte um pouco sobre sua experiência como instrutor..."
                    : "Conte um pouco sobre você..."
                }
                rows={4}
                className="mt-1"
              />
            </div>
          </PremiumCard>

          {/* Campos específicos para Instrutor */}
          {isInstructor && (
            <>
              <PremiumCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Dados Profissionais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience_years">Anos de Experiência</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                      placeholder="Ex: 10"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly_rate">Valor por Hora (R$)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                      placeholder="Ex: 120.00"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="available_regions">Regiões de Atendimento</Label>
                    <Input
                      id="available_regions"
                      value={formData.available_regions}
                      onChange={(e) => setFormData({ ...formData, available_regions: e.target.value })}
                      placeholder="Ex: Zona Sul, Centro, Zona Norte"
                      className="mt-1"
                    />
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Categorias e Especialidades
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label>Categorias CNH que atende</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["A", "B", "C", "D", "E", "AB"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const newCategories = formData.categories.includes(cat)
                              ? formData.categories.filter((c) => c !== cat)
                              : [...formData.categories, cat]
                            setFormData({ ...formData, categories: newCategories })
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            formData.categories.includes(cat)
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Especialidades</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "Primeira Habilitação",
                        "Reciclagem",
                        "Aula Noturna",
                        "Trânsito Urbano",
                        "Rodovia",
                        "Baliza",
                        "Rampa",
                      ].map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => {
                            const newSpecs = formData.specialties.includes(spec)
                              ? formData.specialties.filter((s) => s !== spec)
                              : [...formData.specialties, spec]
                            setFormData({ ...formData, specialties: newSpecs })
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            formData.specialties.includes(spec)
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </>
          )}

          {/* Botão Salvar */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>

          <PremiumCard className="p-6 border-2 border-red-200 bg-red-50/30">
            <h2 className="text-xl font-bold text-red-800 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-gray-700 mb-4">
              A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados, incluindo solicitações,
              favoritos e conversas, serão removidos.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar Conta Permanentemente"
              )}
            </Button>
          </PremiumCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
