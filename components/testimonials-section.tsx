"use client"
import { motion, useScroll } from "framer-motion"
import { Star, MapPin, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { Reveal } from "./reveal"
import { useRef, useState } from "react"
import Image from "next/image"

const instructors = [
  {
    id: 1,
    name: "João Oliveira",
    role: "Instrutor Categorias B/C/D",
    image: "/male-instructor-driving-car-professional.jpg",
    rating: 5.0,
    location: "Tijuca, Rio de Janeiro/RJ",
    pricePerHour: 130,
    approvedStudents: 890,
    experience: "22 anos de experiência",
  },
  {
    id: 2,
    name: "Lucas Almeida",
    role: "Instrutor Categoria D",
    image: "/male-instructor-driving-bus-professional.jpg",
    rating: 5.0,
    location: "Boa Viagem, Recife/PE",
    pricePerHour: 140,
    approvedStudents: 750,
    experience: "20 anos de experiência",
  },
  {
    id: 3,
    name: "Bruno Ribeiro",
    role: "Instrutor Categorias B/C",
    image: "/male-instructor-in-truck-professional.jpg",
    rating: 5.0,
    location: "Cambuí, Campinas/SP",
    pricePerHour: 150,
    approvedStudents: 1020,
    experience: "25 anos de experiência",
  },
  {
    id: 4,
    name: "Mariana Santos",
    role: "Instrutora Categoria A/B",
    image: "/female-instructor-motorcycle-professional.jpg",
    rating: 5.0,
    location: "Copacabana, Rio de Janeiro/RJ",
    pricePerHour: 120,
    approvedStudents: 680,
    experience: "18 anos de experiência",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 126
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScrollButtons, 300)
    }
  }

  return (
    <section ref={sectionRef} className="relative py-6 md:py-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-38 h-38 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-38 h-38 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 mb-2"
            >
              Conheça Nossos{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                Instrutores
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs md:text-sm text-neutral-600 max-w-2xl mx-auto"
            >
              Profissionais qualificados e experientes prontos para ajudá-lo a conquistar sua habilitação
            </motion.p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-1.5 hover:bg-emerald-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-1.5 hover:bg-emerald-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          {/* Instructors Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {instructors.map((instructor, index) => (
              <Reveal key={instructor.id} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative flex-shrink-0 w-[200px] snap-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200">
                    {/* Image with Rating Badge */}
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-100">
                      <Image
                        src={instructor.image || "/placeholder.svg"}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-white rounded-full px-2 py-0.5 shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-neutral-900">{instructor.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-neutral-900 mb-0.5">{instructor.name}</h3>
                      <p className="text-[10px] text-neutral-600 mb-2">{instructor.role}</p>

                      <div className="flex items-center gap-1 text-emerald-600 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px]">{instructor.location}</span>
                      </div>

                      {/* Price and Students */}
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                        <div>
                          <p className="text-xs font-bold text-emerald-600">R$ {instructor.pricePerHour}</p>
                          <p className="text-[8px] text-neutral-500">por hora</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-neutral-900">{instructor.approvedStudents}</p>
                          <p className="text-[8px] text-neutral-500">aprovados</p>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Award className="w-3 h-3" />
                        <span className="text-[9px] font-medium">{instructor.experience}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ver Todos os Instrutores
            </motion.button>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
