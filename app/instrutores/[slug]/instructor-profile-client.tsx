"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Award, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlanModal } from "@/components/plan-modal"
import { extractCategories, generateSlug, type Instructor } from "@/lib/instructor-utils"

export default function InstructorProfileClient({ instructor }: { instructor: Instructor }) {
  const categories = extractCategories(instructor.role)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Back button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 max-w-7xl py-4">
            <Link
              href="/instrutores"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para busca
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={instructor.photo || "/placeholder.svg"}
                      alt={instructor.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{instructor.name}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                          <span>
                            {instructor.neighborhood}, {instructor.city}/{instructor.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-gray-900">{instructor.rating}</span>
                          </div>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-600">{instructor.experience}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">{instructor.price}</div>
                        <div className="text-sm text-gray-600">por aula</div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg"
                        >
                          Categoria {cat}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Award className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{instructor.studentsApproved}</div>
                          <div className="text-sm text-gray-600">Alunos Aprovados</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{instructor.experience.split(" ")[0]}</div>
                          <div className="text-sm text-gray-600">Anos de Experiência</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre</h2>
                  <p className="text-gray-600 leading-relaxed">{instructor.bio}</p>
                </motion.div>

                {/* Specialties */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Especialidades</h2>
                  <div className="flex flex-wrap gap-3">
                    {instructor.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg border-2 border-emerald-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Sidebar - CTAs */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 sticky top-4 space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Comece suas aulas</h3>

                  {/* Button for Plan Modal */}
                  <Button
                    onClick={() => setIsPlanModalOpen(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 text-lg"
                  >
                    Escolher Plano
                  </Button>

                  {/* Link to WhatsApp */}
                  <a href="https://wa.me/5532988093506" target="_blank" rel="noopener noreferrer" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-6 text-lg bg-transparent"
                    >
                      Falar com a Via Betel
                    </Button>
                  </a>

                  {/* Instructor Details */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valor por aula</span>
                      <span className="font-bold text-emerald-600 text-lg">{instructor.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avaliação</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{instructor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Localização</span>
                      <span className="font-medium">
                        {instructor.city}/{instructor.state}
                      </span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-xs text-amber-900 font-medium">
                      Todos os pagamentos são processados pela Via Betel. Sua segurança é nossa prioridade.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Modal */}
        <PlanModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          instructorSlug={generateSlug(instructor.name, instructor.city)}
          instructorName={instructor.name}
        />
      </div>
    </>
  )
}
