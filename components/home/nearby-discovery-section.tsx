"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Star, Search, Filter, CheckCircle2, MessageSquare, ArrowRight, Shield, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { instructors as allInstructors } from "@/data/instructors-data"
import { generateSlug, extractCategories, parsePrice, parseRating } from "@/lib/instructor-utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AppLink from "@/components/app-link"
import { useMotionDebug } from "@/hooks/use-motion-debug"

const mockInstructors = allInstructors.slice(0, 12).map((inst) => ({
  ...inst,
  slug: generateSlug(inst.name, inst.city),
  categories: extractCategories(inst.role),
  priceNum: parsePrice(inst.price),
  ratingNum: parseRating(inst.rating),
  isVerified: inst.isSponsored,
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

    if (filters.city.trim()) {
      const cityLower = filters.city.toLowerCase()
      results = results.filter(
        (i) => i.city.toLowerCase().includes(cityLower) || i.neighborhood.toLowerCase().includes(cityLower),
      )
    }

    if (filters.categories.length > 0) {
      results = results.filter((i) => i.categories.some((cat) => filters.categories.includes(cat)))
    }

    if (filters.shifts.length > 0) {
      results = results.filter((i) => filters.shifts.includes(i.shift))
    }

    if (filters.verified) {
      results = results.filter((i) => i.isVerified)
    }

    if (filters.highRating) {
      results = results.filter((i) => i.ratingNum >= 4.8)
    }

    if (filters.maxPrice) {
      results = results.filter((i) => i.priceNum <= 200)
    }

    return results.slice(0, 6)
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
    <section className="relative py-4 md:py-5 lg:py-6 overflow-hidden bg-white">
      <div className="container mx-auto px-3 sm:px-4 relative z-10 max-w-6xl">
        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3"
        >
          <motion.div
            initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full px-2.5 py-1 mb-2 shadow-md"
          >
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span className="text-xs text-emerald-800 font-semibold">Instrutores perto de você</span>
          </motion.div>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 text-balance">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Encontre o instrutor ideal
            </span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 max-w-2xl mx-auto">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Avaliados</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-teal-600" />
              <span>Chat protegido</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-600" />
              <span>Verificados</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg border border-emerald-100 p-3 mb-3"
        >
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por cidade ou bairro..."
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="pl-9 h-9 text-sm border border-emerald-200 focus:border-emerald-500 rounded-lg"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-emerald-700 font-medium text-xs mb-2 hover:text-emerald-800 transition-colors"
          >
            <Filter className="w-3 h-3" />
            <span>{showFilters ? "Ocultar" : "Mostrar"} filtros</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">Categoria CNH</Label>
                  <div className="flex flex-wrap gap-1">
                    {["A", "B", "C", "D", "E"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          "px-2.5 py-1 rounded-md font-semibold text-xs transition-all border",
                          filters.categories.includes(cat)
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">Turno</Label>
                  <div className="flex flex-wrap gap-1">
                    {["Manhã", "Tarde", "Noite"].map((shift) => (
                      <button
                        key={shift}
                        onClick={() => toggleShift(shift)}
                        className={cn(
                          "px-2.5 py-1 rounded-md font-semibold text-xs transition-all border",
                          filters.shifts.includes(shift)
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                        )}
                      >
                        {shift}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md font-medium text-xs transition-all border flex items-center gap-1",
                      filters.verified
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300",
                    )}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Verificados
                  </button>

                  <button
                    onClick={() => setFilters({ ...filters, highRating: !filters.highRating })}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md font-medium text-xs transition-all border flex items-center gap-1",
                      filters.highRating
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300",
                    )}
                  >
                    <Star className="w-3 h-3" />
                    4.8+
                  </button>

                  <button
                    onClick={() => setFilters({ ...filters, maxPrice: !filters.maxPrice })}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md font-medium text-xs transition-all border flex items-center gap-1",
                      filters.maxPrice
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300",
                    )}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Até R$200
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600 font-medium">
              <span className="text-emerald-600 font-bold">{filteredInstructors.length}</span> resultados
            </div>
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Limpar
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-3"
        >
          {filteredInstructors.map((instructor, idx) => (
            <motion.div
              key={instructor.id}
              initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={shouldDisableMotion ? {} : { y: -2 }}
              className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all border border-gray-100 hover:border-emerald-200"
            >
              <div className="relative h-16 overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                <img
                  src={instructor.photo || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 flex items-center gap-0.5 shadow">
                  <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
                  <span className="text-[8px] font-bold text-gray-900">{instructor.rating}</span>
                </div>

                {instructor.isVerified && (
                  <div className="absolute top-1 left-1 bg-amber-500 text-white rounded-full px-1 py-0.5 text-[7px] font-bold flex items-center gap-0.5 shadow">
                    <CheckCircle2 className="w-2 h-2" />
                  </div>
                )}
              </div>

              <div className="p-1.5">
                <h3 className="font-semibold text-[10px] text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                  {instructor.name.split(" ").slice(0, 2).join(" ")}
                </h3>

                <div className="flex items-center gap-0.5 text-[8px] text-gray-500 mb-1">
                  <MapPin className="w-2 h-2 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{instructor.city}</span>
                </div>

                <div className="flex gap-0.5 mb-1">
                  {instructor.categories.slice(0, 2).map((cat) => (
                    <span key={cat} className="px-1 py-0.5 rounded text-[7px] font-bold bg-emerald-500 text-white">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="text-[9px] font-bold text-gray-900 mb-1">{instructor.price}</div>

                <AppLink href={`/instrutores/${instructor.slug}`} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-5 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium bg-transparent text-[8px] px-1 rounded"
                  >
                    Ver
                  </Button>
                </AppLink>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredInstructors.length === 0 && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Nenhum instrutor encontrado</h3>
            <p className="text-xs text-gray-600 mb-2">Ajuste os filtros ou busque por outra localização</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        <motion.div
          initial={shouldDisableMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={shouldDisableMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-3"
        >
          <AppLink href={getMarketplaceUrl()}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg transition-all group text-xs h-8 px-4"
            >
              Ver todos no Marketplace
              <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </AppLink>

          <AppLink href="#como-funciona">
            <Button
              variant="outline"
              size="sm"
              className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium bg-transparent text-xs h-8 px-4"
            >
              Como funciona?
            </Button>
          </AppLink>
        </motion.div>
      </div>

      {/* Quote Modal - mantido mas não usado visualmente nesta seção compacta */}
      {showQuoteModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 max-w-md w-full shadow-2xl"
          >
            {quoteSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Solicitação enviada!</h3>
                <p className="text-sm text-gray-600">Acompanhe em Minhas Solicitações</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Solicitar orçamento - {selectedInstructor.name}
                </h3>
                <div className="space-y-3">
                  <Input placeholder="Seu nome" required className="h-9 text-sm" />
                  <Input type="email" placeholder="Seu e-mail" required className="h-9 text-sm" />
                  <Input type="tel" placeholder="Seu telefone" required className="h-9 text-sm" />
                  <textarea
                    placeholder="Mensagem (opcional)"
                    className="w-full border rounded-lg p-2 text-sm resize-none h-16"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 h-9 text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 h-9 text-sm bg-gradient-to-r from-emerald-600 to-teal-600">
                    Enviar
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}
