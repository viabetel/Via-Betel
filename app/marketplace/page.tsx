"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Heart } from "lucide-react"
import Link from "next/link"

const MOCK_INSTRUCTORS = [
  {
    id: "1",
    name: "Alice Silva",
    city: "São Paulo",
    state: "SP",
    category: "CNH A",
    rating: 4.8,
    price: 150,
    specialty: "Direção defensiva",
    students: 342,
    experience: "8 anos",
    image: "👩‍🏫",
  },
  {
    id: "2",
    name: "Carlos Santos",
    city: "Rio de Janeiro",
    state: "RJ",
    category: "CNH B",
    rating: 4.6,
    price: 120,
    specialty: "Câmbio manual",
    students: 215,
    experience: "5 anos",
    image: "👨‍🏫",
  },
  {
    id: "3",
    name: "Mariana Costa",
    city: "São Paulo",
    state: "SP",
    category: "CNH A",
    rating: 4.9,
    price: 200,
    specialty: "Estacionamento",
    students: 512,
    experience: "10 anos",
    image: "👩‍🏫",
  },
  {
    id: "4",
    name: "João Oliveira",
    city: "Belo Horizonte",
    state: "MG",
    category: "CNH D",
    rating: 4.5,
    price: 100,
    specialty: "Prática urbana",
    students: 189,
    experience: "3 anos",
    image: "👨‍🏫",
  },
  {
    id: "5",
    name: "Fernanda Martins",
    city: "São Paulo",
    state: "SP",
    category: "CNH B",
    rating: 4.7,
    price: 180,
    specialty: "Segurança no trânsito",
    students: 423,
    experience: "7 anos",
    image: "👩‍🏫",
  },
]

const CATEGORIES = ["CNH A", "CNH B", "CNH D", "CNH C"]
const SPECIALTIES = ["Direção defensiva", "Câmbio manual", "Estacionamento", "Prática urbana", "Segurança no trânsito"]
const STATES = ["SP", "RJ", "MG", "BA", "SC"]
const EXPERIENCE_LEVELS = ["0-2 anos", "3-5 anos", "6-10 anos", "10+ anos"]

export default function MarketplacePage() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(300)
  const [sortBy, setSortBy] = useState("relevant")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setInstructors(MOCK_INSTRUCTORS)
    setLoading(false)
  }, [])

  const filteredInstructors = instructors
    .filter((instructor) => {
      const matchSearch =
        searchText === "" ||
        instructor.name.toLowerCase().includes(searchText.toLowerCase()) ||
        instructor.specialty.toLowerCase().includes(searchText.toLowerCase())

      const matchCategory = selectedCategory === null || instructor.category === selectedCategory
      const matchState = selectedState === null || instructor.state === selectedState
      const matchPrice = instructor.price <= maxPrice
      const matchRating = instructor.rating >= minRating
      const matchSpecialty = selectedSpecialties.length === 0 || selectedSpecialties.includes(instructor.specialty)
      const matchExperience =
        selectedExperience === null || instructor.experience.includes(selectedExperience.split("-")[0])

      return (
        matchSearch && matchCategory && matchState && matchPrice && matchRating && matchSpecialty && matchExperience
      )
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "popular") return b.students - a.students
      return 0
    })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Marketplace</h1>
                <p className="text-emerald-100 text-sm">Encontre instrutores qualificados</p>
              </div>
            </div>
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">Publicar Anúncio</Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8 max-w-7xl mx-auto px-4 py-8">
        <div className="w-72 flex-shrink-0">
          <div className="sticky top-32 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

            {/* Category Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Categoria</label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Todas as categorias</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* State/Location Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Estado</label>
              <select
                value={selectedState || ""}
                onChange={(e) => setSelectedState(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Todos os estados</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4">Preço Máximo</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>R$ 0</span>
                  <span className="font-semibold text-emerald-700">R$ {maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Avaliação Mínima</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value={0}>Qualquer avaliação</option>
                <option value={3}>3+ estrelas</option>
                <option value={4}>4+ estrelas</option>
                <option value={4.5}>4.5+ estrelas</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Experiência</label>
              <select
                value={selectedExperience || ""}
                onChange={(e) => setSelectedExperience(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Qualquer nível</option>
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialties Filter */}
            <div className="mb-7 pb-6 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Especialidades</label>
              <div className="space-y-2">
                {SPECIALTIES.map((spec) => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => toggleSpecialty(spec)}
                      className="w-4 h-4 border-gray-300 rounded accent-emerald-600"
                    />
                    <span className="text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="relevant">Mais relevantes</option>
                <option value="rating">Melhor avaliação</option>
                <option value="price-low">Menor preço</option>
                <option value="price-high">Maior preço</option>
                <option value="popular">Mais populares</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Buscar instrutores ou especialidades..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-semibold">Buscar</Button>
          </div>

          {/* Results */}
          {filteredInstructors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-2 text-lg font-semibold">Nenhum instrutor encontrado</p>
              <p className="text-sm text-gray-500">Tente ajustar seus filtros de busca</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6 font-medium">
                {filteredInstructors.length} instrutor{filteredInstructors.length !== 1 ? "es" : ""} encontrado
                {filteredInstructors.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white hover:border-emerald-200"
                  >
                    {/* Header with Category Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{instructor.name}</h3>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        {instructor.category}
                      </span>
                    </div>

                    {/* Specialty */}
                    <p className="text-sm text-gray-600 mb-4 font-medium">{instructor.specialty}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(instructor.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-bold text-gray-900">{instructor.rating}</span>
                    </div>

                    {/* Location, Experience & Students */}
                    <div className="space-y-2 mb-5 text-xs text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        {instructor.city}, {instructor.state}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">{instructor.students}</span> alunos •{" "}
                        <span className="font-semibold text-gray-900">{instructor.experience}</span> de experiência
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-end justify-between gap-3 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Por hora</p>
                        <p className="text-2xl font-bold text-emerald-700">R$ {instructor.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/marketplace/${instructor.id}`} className="flex-1">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2.5 font-semibold">
                            Ver Detalhes
                          </Button>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(instructor.id)}
                          className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(instructor.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
