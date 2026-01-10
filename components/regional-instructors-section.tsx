"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Award, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { instructors as allInstructors } from "@/data/instructors-data"
import { generateSlug, extractCategories } from "@/lib/instructor-utils"

const instructors = allInstructors.slice(0, 5).map((inst) => ({
  name: inst.name,
  photo: inst.photo,
  city: `${inst.neighborhood}, ${inst.city}`,
  categories: extractCategories(inst.role),
  rating: Number.parseFloat(inst.rating),
  experience: Number.parseInt(inst.experience),
  students: inst.studentsApproved,
  slug: generateSlug(inst.name, inst.city),
}))

export function RegionalInstructorsSection() {
  return (
    <section className="relative py-6 sm:py-12 md:py-14 lg:py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 sm:left-20 w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-emerald-400 rounded-full blur-2xl md:blur-3xl" />
        <div className="absolute bottom-10 right-10 sm:right-20 w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-teal-400 rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 sm:mb-8 md:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-2 sm:px-4 py-1 sm:py-2 mb-2 sm:mb-4 shadow-lg"
          >
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-[10px] sm:text-sm text-emerald-700 font-semibold whitespace-nowrap">
              Instrutores Perto de Você
            </span>
          </motion.div>

          <h2
            className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-3 text-balance px-4"
            style={{ fontSize: "clamp(1rem, 3.5vw, 2rem)" }}
          >
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              Na Sua Região
            </span>
          </h2>
          <p className="text-[10px] sm:text-base text-gray-600 max-w-2xl mx-auto text-pretty px-4">
            Conheça instrutores qualificados e avaliados por alunos reais na sua cidade
          </p>
        </motion.div>

        <div className="relative -mx-4 sm:mx-0">
          <div
            className="flex gap-1.5 sm:gap-4 overflow-x-auto pb-3 px-4 sm:px-0 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {instructors.map((instructor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[28%] min-w-[95px] sm:w-64 snap-start"
              >
                {/* Photo */}
                <div className="relative h-12 sm:h-28 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                  <img
                    src={instructor.photo || "/placeholder.svg"}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 bg-white/95 backdrop-blur-sm rounded-full px-1 py-0.5 sm:px-2 sm:py-1 flex items-center gap-0.5 shadow-md">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <span className="text-[8px] sm:text-xs font-bold text-gray-900">{instructor.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-1 sm:p-2.5">
                  <h3 className="font-bold text-gray-900 text-[8px] sm:text-xs mb-0.5 sm:mb-1 group-hover:text-emerald-600 transition-colors truncate">
                    {instructor.name}
                  </h3>

                  <div className="flex items-center gap-0.5 text-[7px] sm:text-[10px] text-gray-600 mb-0.5 sm:mb-2">
                    <MapPin className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{instructor.city}</span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-0.5 mb-0.5 sm:mb-2">
                    {instructor.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className={cn(
                          "px-0.5 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[10px] font-bold flex-shrink-0",
                          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                        )}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:block pt-1 sm:pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[8px] sm:text-[10px] gap-1">
                      <div className="flex items-center gap-0.5 text-gray-600">
                        <Clock className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-600 flex-shrink-0" />
                        <span>{instructor.experience}a</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-gray-600">
                        <Award className="w-2 h-2 sm:w-3 sm:h-3 text-amber-600 flex-shrink-0" />
                        <span>{instructor.students}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/instrutores/${instructor.slug}`} className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-1 sm:mt-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-semibold text-[7px] sm:text-[10px] py-1 sm:py-2 rounded-md hover:shadow-lg transition-all min-h-[28px] sm:min-h-[40px]"
                    >
                      Ver
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-50 pointer-events-none" />
        </div>

        {/* "Ver Todos" Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-4 sm:mt-8"
        >
          <Link href="/instrutores">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-600 font-bold text-xs sm:text-sm px-4 sm:px-8 py-2 sm:py-3 rounded-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-all shadow-lg min-h-[40px] sm:min-h-[44px]"
            >
              Ver Todos os Instrutores
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
