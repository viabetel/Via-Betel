"use client"

import { useState, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Users, Star, MapPin, Award } from "lucide-react"
import { instructors } from "@/data/instructors-data"

export function CollectionStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "price" | "name">("rating")

  const sortedInstructors = useMemo(() => {
    const sorted = [...instructors]

    sorted.sort((a, b) => {
      if (sortBy === "rating") {
        return Number.parseFloat(b.rating || "0") - Number.parseFloat(a.rating || "0")
      }
      if (sortBy === "experience") {
        const expA = a.experience ? Number.parseInt(a.experience.split(" ")[0]) : 0
        const expB = b.experience ? Number.parseInt(b.experience.split(" ")[0]) : 0
        return expB - expA
      }
      if (sortBy === "price") {
        const priceA = Number.parseInt(a.price.replace("R$", "").trim())
        const priceB = Number.parseInt(b.price.replace("R$", "").trim())
        return priceA - priceB
      }
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

    return sorted
  }, [sortBy])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
            20 Instrutores <span className="text-emerald-600">Próximos a Você</span>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl text-lg">
            Profissionais qualificados e experientes na sua região, prontos para te ajudar a conquistar sua CNH
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <Users className="w-5 h-5" />
            <span>{sortedInstructors.length} instrutores</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
            >
              <option value="rating">Melhor Avaliado</option>
              <option value="experience">Mais Experiência</option>
              <option value="price">Menor Preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-emerald-500 hover:text-white text-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 -ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sortedInstructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex-shrink-0 w-[340px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-emerald-200"
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <img
                    src={instructor.photo || "/placeholder.svg"}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{instructor.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-1">{instructor.name}</h3>
                    <p className="text-emerald-100 text-sm font-medium">{instructor.role}</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{instructor.location}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{instructor.price}</div>
                      <div className="text-xs text-gray-500">por hora</div>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{instructor.studentsApproved}</div>
                      <div className="text-xs text-gray-500">aprovados</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{instructor.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.slice(0, 2).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl">
                    Ver Perfil Completo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-emerald-500 hover:text-white text-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 -mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
