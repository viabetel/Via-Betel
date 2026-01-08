"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const instructors = [
  {
    name: "Carlos Silva",
    photo: "/images/instructor-carlos.jpg",
    city: "Belo Horizonte, MG",
    categories: ["B", "C", "D"],
    rating: 4.9,
    experience: 8,
    students: 340,
  },
  {
    name: "Marina Costa",
    photo: "/images/instructor-marina.jpg",
    city: "Contagem, MG",
    categories: ["B", "A"],
    rating: 5.0,
    experience: 12,
    students: 520,
  },
  {
    name: "Roberto Almeida",
    photo: "/images/instructor-roberto.jpg",
    city: "Betim, MG",
    categories: ["B", "C"],
    rating: 4.8,
    experience: 6,
    students: 280,
  },
  {
    name: "Paula Mendes",
    photo: "/images/instructor-paula.jpg",
    city: "Nova Lima, MG",
    categories: ["B"],
    rating: 4.9,
    experience: 10,
    students: 450,
  },
  {
    name: "José Santos",
    photo: "/images/instructor-jose.jpg",
    city: "Sabará, MG",
    categories: ["B", "C", "D", "E"],
    rating: 5.0,
    experience: 15,
    students: 680,
  },
]

export function RegionalInstructorsSection() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-4 py-2 mb-4 shadow-lg"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-semibold">Instrutores Perto de Você</span>
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-balance">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              Na Sua Região
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto text-pretty">
            Conheça instrutores qualificados e avaliados por alunos reais na sua cidade
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 max-w-7xl mx-auto">
          {instructors.map((instructor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                <img
                  src={instructor.photo || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-900">{instructor.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-emerald-600 transition-colors">
                  {instructor.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{instructor.city}</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {instructor.categories.map((cat) => (
                    <span
                      key={cat}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                      )}
                    >
                      Cat. {cat}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{instructor.experience} anos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>{instructor.students} alunos</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:shadow-lg transition-all"
                >
                  Ver Perfil
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-600 font-bold text-sm px-8 py-3 rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all shadow-lg"
          >
            Ver Todos os Instrutores
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
