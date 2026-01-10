"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { COLORS, SHADOWS } from "@/lib/ui/tokens"

export function ContaPerfilClient() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refresh } = useAuth()
  const [saving, setSaving] = useState(false)
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

      // Auto dismiss success message
      setTimeout(() => setMessage(null), 5000)
    } catch (error: any) {
      console.error("[v0] Erro ao salvar perfil:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar perfil. Tente novamente." })
    } finally {
      setSaving(false)
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
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card Completude do Perfil */}
            <PremiumCard className="p-6" gradient>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Perfil</h3>
                  <p className="text-sm text-gray-600">Completude</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-3xl font-bold ${completenessColor}`}>{stats.profileCompleteness}%</span>
                  {stats.profileCompleteness === 100 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <Award className="w-8 h-8 text-amber-500" />
                    </motion.div>
                  )}
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.profileCompleteness}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {stats.profileCompleteness < 100 && (
                  <p className="text-xs text-gray-600">
                    Complete seu perfil para aumentar suas chances de ser encontrado!
                  </p>
                )}
              </div>
            </PremiumCard>

            {/* Card Stats Rápidos */}
            <PremiumCard className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Suas estatísticas
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Solicitações</span>
                  <span className="font-semibold text-emerald-600">{stats.solicitacoes}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Favoritos</span>
                  <span className="font-semibold text-emerald-600">{stats.favoritos}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Membro desde</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.created_at || Date.now()).toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Coluna Direita - Formulário */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PremiumCard className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
              <p className="text-gray-600 mb-6">Mantenha suas informações sempre atualizadas</p>

              {/* Message Banner with Animation */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-xl mb-6 ${
                      message.type === "success"
                        ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-2 border-red-200 text-red-800"
                    }`}
                    style={{
                      boxShadow: message.type === "success" ? SHADOWS.emerald : SHADOWS.md,
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 className="w-6 h-6 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                {/* Avatar Section com hover effect */}
                <motion.div
                  className="flex items-center gap-6 pb-6 border-b-2 border-gray-100"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative group">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url || "/placeholder.svg"}
                        alt={profile.full_name || "Avatar"}
                        width={96}
                        height={96}
                        className="rounded-full border-4 border-emerald-200 group-hover:border-emerald-400 transition-all"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-3xl group-hover:scale-105 transition-transform shadow-lg">
                        {(formData.full_name || user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-emerald-500 group-hover:scale-110 transition-transform cursor-pointer">
                      <Camera className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      Foto de perfil
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Recomendamos uma imagem quadrada de pelo menos 400x400px
                    </p>
                    <Button variant="outline" size="sm" disabled className="gap-2 bg-transparent">
                      <Upload className="w-4 h-4" />
                      Alterar foto (em breve)
                    </Button>
                  </div>
                </motion.div>

                {/* Form Fields com ícones e animações */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-50 border-2 border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />O email não pode ser alterado
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Label htmlFor="full_name" className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    Nome completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Digite seu nome completo"
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Label htmlFor="city" className="flex items-center gap-2 text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Ex: São Paulo - SP"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </motion.div>

                {profile?.role === "INSTRUCTOR" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="bio" className="flex items-center gap-2 text-gray-700 mb-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Biografia
                    </Label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full rounded-xl border-2 border-emerald-200 focus:border-emerald-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                      placeholder="Conte um pouco sobre sua experiência como instrutor..."
                    />
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Esta informação será exibida no seu perfil público no marketplace
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons com loading state animado */}
                <motion.div
                  className="flex gap-3 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 h-12 text-base font-semibold"
                    style={{
                      background: COLORS.gradients.primary,
                      boxShadow: SHADOWS.emerald,
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/conta")}
                    disabled={saving}
                    className="px-8 h-12 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    Cancelar
                  </Button>
                </motion.div>
              </div>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
