"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, MapPin, Star, Award, X } from "lucide-react"
import Link from "next/link"
import { instructors } from "@/data/instructors-data"
import { extractCategories, parsePrice, parseRating, generateSlug } from "@/lib/instructor-utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type SortOption = "rating" | "price" | "students" | "experience"

export default function InstrutoresClient() {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [maxPrice, setMaxPrice] = useState(200)
  const [minRating, setMinRating] = useState(0)
  const [onlyJF, setOnlyJF] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const allSpecialties = useMemo(() => {
    const specs = new Set<string>()
    instructors.forEach((inst) => inst.specialties.forEach((s) => specs.add(s)))
    return Array.from(specs).sort()
  }, [])

  const filteredInstructors = useMemo(() => {
    const result = instructors.filter((inst) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase()
        const matchesSearch =
          inst.city.toLowerCase().includes(search) ||
          inst.neighborhood.toLowerCase().includes(search) ||
          inst.location.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== "Todas") {
        const cats = extractCategories(inst.role)
        if (!cats.includes(selectedCategory)) return false
      }

      // Price filter
      if (parsePrice(inst.price) > maxPrice) return false

      // Rating filter
      if (parseRating(inst.rating) < minRating) return false

      // JF filter
      if (onlyJF && (inst.city !== "Juiz de Fora" || inst.state !== "MG")) return false

      // Specialties filter
      if (selectedSpecialties.length > 0) {
        const hasSpecialty = selectedSpecialties.some((spec) => inst.specialties.includes(spec))
        if (!hasSpecialty) return false
      }

      return true
    })

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return parseRating(b.rating) - parseRating(a.rating)
        case "price":
          return parsePrice(a.price) - parsePrice(b.price)
        case "students":
          return b.studentsApproved - a.studentsApproved
        case "experience":
          return Number.parseInt(b.experience) - Number.parseInt(a.experience)
        default:
          return 0
      }
    })

    return result
  }, [searchText, selectedCategory, sortBy, maxPrice, minRating, onlyJF, selectedSpecialties])

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) => (prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-balance"
          >
            Encontre seu Instrutor Ideal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-emerald-50 text-pretty"
          >
            {filteredInstructors.length} instrutores qualificados disponíveis
          </motion.p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 max-w-7xl -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cidade ou Bairro"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>

            {/* Category select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
              >
                <option value="Todas">Todas Categorias</option>
                <option value="A">Categoria A</option>
                <option value="B">Categoria B</option>
                <option value="C">Categoria C</option>
                <option value="D">Categoria D</option>
                <option value="E">Categoria E</option>
                <option value="AB">AB</option>
              </select>
            </div>

            {/* Sort select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
              >
                <option value="rating">Melhor Avaliação</option>
                <option value="price">Menor Preço</option>
                <option value="students">Mais Aprovados</option>
                <option value="experience">Mais Experiência</option>
              </select>
            </div>
          </div>

          {/* Filter button (mobile) */}
          <div className="mt-4 md:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros Avançados
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="md:col-span-1 space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="md:hidden">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preço máximo: R$ {maxPrice}
                    </label>
                    <Slider
                      value={[maxPrice]}
                      onValueChange={([val]) => setMaxPrice(val)}
                      min={50}
                      max={200}
                      step={10}
                      className="mb-2"
                    />
                  </div>

                  {/* Rating filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Avaliação mínima</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                    >
                      <option value="0">Todas</option>
                      <option value="4.0">4.0+</option>
                      <option value="4.5">4.5+</option>
                      <option value="4.8">4.8+</option>
                      <option value="4.9">4.9+</option>
                    </select>
                  </div>

                  {/* JF toggle */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyJF}
                        onChange={(e) => setOnlyJF(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Somente Juiz de Fora/MG</span>
                    </label>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Especialidades</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {allSpecialties.map((spec) => (
                        <label key={spec} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.includes(spec)}
                            onChange={() => toggleSpecialty(spec)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-xs text-gray-600">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map((instructor, idx) => {
                const slug = generateSlug(instructor.name, instructor.city)
                const categories = extractCategories(instructor.role)

                return (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Photo */}
                    <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100">
                      <img
                        src={instructor.photo || "/placeholder.svg"}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-900">{instructor.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{instructor.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="truncate">
                          {instructor.neighborhood}, {instructor.city}
                        </span>
                      </div>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded"
                          >
                            Cat. {cat}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pb-3 border-b">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>{instructor.studentsApproved} aprovados</span>
                        </div>
                        <div className="font-bold text-emerald-600 text-lg">{instructor.price}</div>
                      </div>

                      {/* CTAs */}
                      <div className="space-y-2">
                        <Link href={`/instrutores/${slug}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                            Ver Perfil
                          </Button>
                        </Link>
                        <Link
                          href={`/aluno?cidade=${encodeURIComponent(instructor.city)}&uf=${instructor.state}&categoria=${categories[0] || "B"}`}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                          >
                            Quero Contato
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filteredInstructors.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Nenhum instrutor encontrado com os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
