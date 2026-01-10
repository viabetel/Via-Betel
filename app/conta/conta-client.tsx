"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Shield,
  Heart,
  MessageSquare,
  Briefcase,
  Home,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { COLORS } from "@/lib/ui/tokens"

type UserType = "student" | "instructor" | null

export function ContaClient() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [userType, setUserType] = useState<UserType>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    state: "",
    bio: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/conta")
    }

    if (profile) {
      setUserType((profile.user_type as UserType) || "student")
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        state: profile.state || "",
        bio: profile.bio || "",
      })
    }
  }, [user, profile, authLoading, router])

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const supabase = createBrowserClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      setIsEditing(false)
    } catch (error: any) {
      console.error("[v0] Erro ao salvar perfil:", error)
      setMessage({ type: "error", text: error.message || "Erro ao salvar perfil. Tente novamente." })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
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
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600">
            <Home className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            className="px-8 py-6 border-b border-gray-100"
            style={{
              background: COLORS.gradients.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Minha Conta</h1>
                <p className="text-emerald-100 text-sm">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="bg-white/10 text-white border-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          <Tabs defaultValue="perfil" className="w-full">
            <div className="border-b border-gray-100 px-8">
              <TabsList className="bg-transparent border-0 h-auto p-0 gap-1">
                <TabsTrigger
                  value="perfil"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger
                  value="seguranca"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger
                  value="conversas"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Conversas
                </TabsTrigger>
                {userType === "student" && (
                  <TabsTrigger
                    value="favoritos"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </TabsTrigger>
                )}
                {userType === "instructor" && (
                  <TabsTrigger
                    value="anuncio"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Meu Anúncio
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="perfil" className="mt-0">
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Informações do Perfil</h2>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {message && (
                    <div
                      className={`flex items-start gap-2 p-3 rounded-lg mb-6 ${
                        message.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-red-50 border border-red-200 text-red-800"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user.email || ""} disabled className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                    </div>

                    <div>
                      <Label htmlFor="full_name">Nome completo</Label>
                      <Input
                        id="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
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
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="UF"
                          maxLength={2}
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {userType === "instructor" && (
                      <div>
                        <Label htmlFor="bio">Biografia</Label>
                        <textarea
                          id="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                          placeholder="Conte um pouco sobre sua experiência como instrutor..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seguranca" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Segurança</h2>

                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Senha</h3>
                          <p className="text-sm text-gray-600">Última alteração: Nunca</p>
                        </div>
                        <Button asChild variant="outline">
                          <Link href="/auth/forgot-password">Trocar senha</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Login com Google</h3>
                          <p className="text-sm text-gray-600">
                            {user.app_metadata?.provider === "google" ? "Conectado" : "Não conectado"}
                          </p>
                        </div>
                        {user.app_metadata?.provider !== "google" && (
                          <Button variant="outline" disabled>
                            Conectar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conversas" className="mt-0">
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Suas conversas</h3>
                  <p className="text-gray-600 mb-4">Acesse todas as suas conversas com instrutores ou alunos</p>
                  <Button asChild>
                    <Link href="/chat">Abrir Chat</Link>
                  </Button>
                </div>
              </TabsContent>

              {userType === "student" && (
                <TabsContent value="favoritos" className="mt-0">
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Seus favoritos</h3>
                    <p className="text-gray-600 mb-4">Instrutores salvos aparecem aqui</p>
                    <Button asChild variant="outline">
                      <Link href="/instrutores">Explorar Instrutores</Link>
                    </Button>
                  </div>
                </TabsContent>
              )}

              {userType === "instructor" && (
                <TabsContent value="anuncio" className="mt-0">
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Meu Anúncio</h3>
                    <p className="text-gray-600 mb-4">Gerencie seu perfil profissional no marketplace</p>
                    <Button disabled variant="outline">
                      Em breve
                    </Button>
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
