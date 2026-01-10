"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Star,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { instructors as allInstructors } from "@/data/instructors-data"
import { generateSlug, extractCategories, parsePrice, parseRating } from "@/lib/instructor-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AppLink from "@/components/app-link"
import { useMotionDebug } from "@/hooks/use-motion-debug"

const mockInstructors = allInstructors.slice(0, 12).map((inst) => ({
  ...inst,
  slug: generateSlug(inst.name, inst.city),
  categories: extractCategories(inst.role),
  priceNum: parsePrice(inst.price),
  ratingNum: parseRating(inst.rating),
  isVerified: inst.isSponsored, // usar sponsored como proxy de verificado
  availability: ["Hoje", "Amanhã", "Esta semana"][Math.floor(Math.random() * 3)],
  shift: ["Manhã", "Tarde", "Noite"][Math.floor(Math.random() * 3)],
}))

type FilterState = {
  city: string
  categories: string[]
  shifts: string[]
  verified: boolean
  highRating: boolean
  maxPrice: boolean
}

export function NearbyDiscoverySection() {
  const { shouldDisableMotion } = useMotionDebug()

  // Estados
  const [filters, setFilters] = useState<FilterState>({
    city: "",
    categories: [],
    shifts: [],
    verified: false,
    highRating: false,
    maxPrice: false,
  })

  const [showFilters, setShowFilters] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<(typeof mockInstructors)[0] | null>(null)
  const [quoteSuccess, setQuoteSuccess] = useState(false)

  const filteredInstructors = useMemo(() => {
    let results = mockInstructors

    // Filtro de cidade
    if (filters.city.trim()) {
      const cityLower = filters.city.toLowerCase()
      results = results.filter(
        (i) => i.city.toLowerCase().includes(cityLower) || i.neighborhood.toLowerCase().includes(cityLower),
      )
    }

    // Filtro de categorias
    if (filters.categories.length > 0) {
      results = results.filter((i) => i.categories.some((cat) => filters.categories.includes(cat)))
    }

    // Filtro de turno
    if (filters.shifts.length > 0) {
      results = results.filter((i) => filters.shifts.includes(i.shift))
    }

    // Filtro verificados
    if (filters.verified) {
      results = results.filter((i) => i.isVerified)
    }

    // Filtro avaliação alta
    if (filters.highRating) {
      results = results.filter((i) => i.ratingNum >= 4.8)
    }

    // Filtro preço máximo
    if (filters.maxPrice) {
      results = results.filter((i) => i.priceNum <= 200)
    }

    return results.slice(0, 6) // Mostrar apenas 6 resultados
  }, [filters])

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
    }))
  }

  const toggleShift = (shift: string) => {
    setFilters((prev) => ({
      ...prev,
      shifts: prev.shifts.includes(shift) ? prev.shifts.filter((s) => s !== shift) : [...prev.shifts, shift],
    }))
  }

  const clearFilters = () => {
    setFilters({
      city: "",
      categories: [],
      shifts: [],
      verified: false,
      highRating: false,
      maxPrice: false,
    })
  }

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuoteSuccess(true)
    setTimeout(() => {
      setShowQuoteModal(false)
      setQuoteSuccess(false)
      setSelectedInstructor(null)
    }, 2000)
  }

  const getMarketplaceUrl = () => {
    const params = new URLSearchParams()
    if (filters.city) params.set("cidade", filters.city)
    if (filters.categories.length) params.set("categorias", filters.categories.join(","))
    if (filters.verified) params.set("verificados", "true")
    if (filters.highRating) params.set("rating", "4.8")
    if (filters.maxPrice) params.set("maxPrice", "200")
    return `/instrutores${params.toString() ? `?${params.toString()}` : ""}`
  }

  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full px-4 py-2 mb-4 shadow-lg"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-800 font-semibold">Instrutores perto de você</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Encontre o instrutor ideal em minutos
            </span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Avaliados por alunos reais</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Chat protegido</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Instrutores verificados</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl border-2 border-emerald-100 p-6 mb-8"
        >
          {/* Input de busca */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Ex: Juiz de Fora, Centro, 36015-000"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="pl-12 h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
            />
          </div>

          {/* Toggle filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-4 hover:text-emerald-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? "Ocultar" : "Mostrar"} filtros avançados</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Categorias */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Categoria CNH</Label>
                  <div className="flex flex-wrap gap-2">
                    {["A", "B", "C", "D", "E"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2",
                          filters.categories.includes(cat)
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Turno */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Turno preferido</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Manhã", "Tarde", "Noite"].map((shift) => (
                      <button
                        key={shift}
                        onClick={() => toggleShift(shift)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2",
                          filters.shifts.includes(shift)
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                        )}
                      >
                        {shift}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtros rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium text-sm transition-all border-2 flex items-center justify-center gap-2",
                      filters.verified
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300",
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verificados
                  </button>

                  <button
                    onClick={() => setFilters({ ...filters, highRating: !filters.highRating })}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium text-sm transition-all border-2 flex items-center justify-center gap-2",
                      filters.highRating
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300",
                    )}
                  >
                    <Star className="w-4 h-4" />
                    Avaliação 4.8+
                  </button>

                  <button
                    onClick={() => setFilters({ ...filters, maxPrice: !filters.maxPrice })}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium text-sm transition-all border-2 flex items-center justify-center gap-2",
                      filters.maxPrice
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Até R$ 200
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões de ação e contador */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 font-medium">
              <span className="text-emerald-600 font-bold text-lg">{filteredInstructors.length}</span> resultados
              encontrados
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {filteredInstructors.map((instructor, idx) => (
            <motion.div
              key={instructor.id}
              initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={shouldDisableMotion ? {} : { y: -4, scale: 1.01 }}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-emerald-100 hover:border-emerald-300"
            >
              {/* Foto + Badge */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                <img
                  src={instructor.photo || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{instructor.rating}</span>
                </div>

                {/* Badge Verificado */}
                {instructor.isVerified && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    Verificado
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {instructor.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">
                    {instructor.neighborhood}, {instructor.city}
                  </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {instructor.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      CAT {cat}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{instructor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{instructor.studentsApproved} alunos</span>
                  </div>
                </div>

                {/* Disponibilidade e Preço */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Disponível</p>
                    <p className="text-sm font-bold text-emerald-600">{instructor.availability}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">A partir de</p>
                    <p className="text-lg font-bold text-gray-900">{instructor.price}</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-2">
                  <AppLink href={`/instrutores/${instructor.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold bg-transparent"
                    >
                      Ver perfil
                    </Button>
                  </AppLink>

                  <Button
                    onClick={() => {
                      setSelectedInstructor(instructor)
                      setShowQuoteModal(true)
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
                  >
                    Orçamento
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum instrutor encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou buscar por outra localização</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <AppLink href={getMarketplaceUrl()}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all group"
            >
              Ver todos no Marketplace
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </AppLink>

          <AppLink href="#como-funciona">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold bg-transparent"
            >
              Como funciona a Via Betel
            </Button>
          </AppLink>
        </motion.div>
      </div>

      <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
        <DialogContent className="sm:max-w-[500px]">
          {!quoteSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Solicitar Orçamento</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Envie sua solicitação para {selectedInstructor?.name}. Você receberá resposta em breve.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <select
                    id="objetivo"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="baliza">Prática de Baliza</option>
                    <option value="prova">Preparação para Prova</option>
                    <option value="reciclagem">Reciclagem CNH</option>
                    <option value="primeira">Primeira Habilitação</option>
                    <option value="medo">Superar Medo de Dirigir</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria CNH</Label>
                  <select
                    id="categoria"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="A">A - Moto</option>
                    <option value="B">B - Carro</option>
                    <option value="C">C - Caminhão</option>
                    <option value="D">D - Ônibus</option>
                    <option value="E">E - Carreta</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    type="text"
                    placeholder="Ex: Juiz de Fora"
                    className="border-2 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="horario">Melhor horário</Label>
                  <select
                    id="horario"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="manha">Manhã (08h-12h)</option>
                    <option value="tarde">Tarde (13h-18h)</option>
                    <option value="noite">Noite (18h-21h)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Conte mais sobre suas necessidades..."
                    className="border-2 border-gray-200 focus:border-emerald-500 min-h-[100px]"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowQuoteModal(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                  >
                    Enviar Solicitação
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Solicitação criada!</h3>
              <p className="text-gray-600 mb-6">
                Você receberá uma resposta em breve. Acompanhe o status em "Minhas Solicitações".
              </p>
              <AppLink href="/conta/solicitacoes">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold">
                  Acompanhar em Minhas Solicitações
                </Button>
              </AppLink>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
