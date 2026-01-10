"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Award, Clock, ArrowLeft, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { extractCategories, generateSlug, type Instructor } from "@/lib/instructor-utils"
import { useState } from "react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function InstructorProfileClient({ instructor }: { instructor: Instructor }) {
  const categories = extractCategories(instructor.role)
  const slug = generateSlug(instructor.name, instructor.city)
  const [showFullBio, setShowFullBio] = useState(false)
  const [showAllSpecialties, setShowAllSpecialties] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Back button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl py-2 sm:py-4">
          <Link
            href="/instrutores"
            className="inline-flex items-center gap-1 sm:gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-xs sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Voltar
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl py-4 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3">
                <img
                  src={instructor.photo || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-48 sm:h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-3 sm:p-6 sm:w-2/3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <div className="w-full sm:w-auto">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{instructor.name}</h1>
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-600 mb-1 sm:mb-2 text-xs sm:text-base">
                      <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">
                        {instructor.neighborhood}, {instructor.city}/{instructor.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900 text-xs sm:text-base">{instructor.rating}</span>
                      </div>
                      <span className="text-gray-600 text-xs sm:text-base">•</span>
                      <span className="text-gray-600 text-xs sm:text-sm">{instructor.experience}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{instructor.price}</div>
                    <div className="text-xs sm:text-sm text-gray-600">por aula</div>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-md sm:rounded-lg text-[10px] sm:text-base"
                    >
                      Categoria {cat}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4 border-t">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-lg">{instructor.studentsApproved}</div>
                      <div className="text-[10px] sm:text-sm text-gray-600">Aprovados</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-lg">
                        {instructor.experience.split(" ")[0]}
                      </div>
                      <div className="text-[10px] sm:text-sm text-gray-600">Anos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTAs - Mobile First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 space-y-2 sm:space-y-4"
          >
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Comece suas aulas</h3>

            <Link href={`/orcamento?instrutor=${slug}`} className="block">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 sm:py-6 text-sm sm:text-lg">
                Pedir Orçamento
              </Button>
            </Link>

            <a href="https://wa.me/5532988093506" rel="noopener noreferrer" className="block">
              <Button
                variant="outline"
                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-4 sm:py-6 text-sm sm:text-lg bg-transparent"
              >
                Falar com a Via Betel
              </Button>
            </a>

            <div className="pt-2 sm:pt-4 border-t space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Valor por aula</span>
                <span className="font-bold text-emerald-600 text-base sm:text-lg">{instructor.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Avaliação</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm sm:text-base">{instructor.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Localização</span>
                <span className="font-medium text-xs sm:text-sm">
                  {instructor.city}/{instructor.state}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 sm:p-4 mt-2 sm:mt-4">
              <h4 className="font-bold text-amber-900 mb-1 sm:mb-2 text-xs sm:text-base">Como funciona</h4>
              <p className="text-[10px] sm:text-xs text-amber-900">
                A Via Betel intermedia todo o processo. Você envia sua solicitação e recebe propostas filtradas. Seu
                contato não é exposto automaticamente aos instrutores.
              </p>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Sobre</h2>
            <p
              className={`text-xs sm:text-base text-gray-600 leading-relaxed ${
                !showFullBio ? "line-clamp-3 sm:line-clamp-none" : ""
              }`}
            >
              {instructor.bio}
            </p>
            {instructor.bio.length > 150 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="sm:hidden mt-2 text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
              >
                {showFullBio ? "Ver menos" : "Ver mais"}
                <ChevronDown className={`w-3 h-3 transition-transform ${showFullBio ? "rotate-180" : ""}`} />
              </button>
            )}
          </motion.div>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Especialidades</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              {(showAllSpecialties ? instructor.specialties : instructor.specialties.slice(0, 6)).map((spec) => (
                <span
                  key={spec}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-emerald-50 text-emerald-700 font-medium rounded-md sm:rounded-lg border-2 border-emerald-200 text-[10px] sm:text-base"
                >
                  {spec}
                </span>
              ))}
            </div>
            {instructor.specialties.length > 6 && (
              <button
                onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                className="sm:hidden mt-2 text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
              >
                {showAllSpecialties ? "Ver menos" : `Ver mais (${instructor.specialties.length - 6})`}
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllSpecialties ? "rotate-180" : ""}`} />
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
