"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const instructors = [
  {
    name: "Carlos Silva",
    photo: "/professional-male-driving-instructor-realistic-por.jpg",
    city: "Belo Horizonte, MG",
    categories: ["B", "C"],
    rating: 4.8,
    experience: 5,
    students: 87,
  },
  {
    name: "Marina Costa",
    photo: "/professional-female-driving-instructor-realistic-p.jpg",
    city: "Contagem, MG",
    categories: ["B", "A"],
    rating: 4.9,
    experience: 7,
    students: 123,
  },
  {
    name: "Roberto Almeida",
    photo: "/professional-male-instructor-realistic-portrait-sm.jpg",
    city: "Betim, MG",
    categories: ["B"],
    rating: 4.7,
    experience: 4,
    students: 65,
  },
  {
    name: "Paula Mendes",
    photo: "/professional-female-instructor-new-portrait.jpg",
    city: "Nova Lima, MG",
    categories: ["B", "C"],
    rating: 4.9,
    experience: 6,
    students: 94,
  },
  {
    name: "José Santos",
    photo: "/professional-male-driving-teacher-realistic-portra.jpg",
    city: "Sabará, MG",
    categories: ["B", "C", "D"],
    rating: 5.0,
    experience: 8,
    students: 156,
  },
]

export function RegionalInstructorsSection() {
  return (
    <section className="relative py-10 sm:py-12 md:py-14 lg:py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 sm:left-20 w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-emerald-400 rounded-full blur-2xl md:blur-3xl" />
        <div className="absolute bottom-10 right-10 sm:right-20 w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-teal-400 rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-lg"
          >
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-emerald-700 font-semibold whitespace-nowrap">
              Instrutores Perto de Você
            </span>
          </motion.div>

          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-balance px-4"
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 2rem)" }}
          >
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              Na Sua Região
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto text-pretty px-4">
            Conheça instrutores qualificados e avaliados por alunos reais na sua cidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 max-w-7xl mx-auto">
          {instructors.map((instructor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 min-w-0"
            >
              {/* Photo */}
              <div className="relative h-36 sm:h-32 md:h-28 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                <img
                  src={instructor.photo || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-900">{instructor.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-2.5 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm sm:text-xs mb-1 group-hover:text-emerald-600 transition-colors truncate">
                  {instructor.name}
                </h3>

                <div className="flex items-center gap-1 text-xs sm:text-[10px] text-gray-600 mb-2 min-w-0">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{instructor.city}</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {instructor.categories.map((cat) => (
                    <span
                      key={cat}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                      )}
                    >
                      Cat. {cat}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[10px] gap-2 min-w-0">
                    <div className="flex items-center gap-1 text-gray-600 min-w-0">
                      <Clock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{instructor.experience} anos</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 min-w-0">
                      <Award className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{instructor.students} alunos</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-semibold text-xs py-2 rounded-lg hover:shadow-lg transition-all min-h-[40px]"
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
          className="text-center mt-6 sm:mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-600 font-bold text-sm px-6 sm:px-8 py-3 rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all shadow-lg min-h-[44px]"
          >
            Ver Todos os Instrutores
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
