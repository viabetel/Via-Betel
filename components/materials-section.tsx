"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"
import { instructors } from "@/data/instructors-data"
import Image from "next/image"

const CarImageIcon = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <Image
      src="/images/carro-sem-fundo.png"
      alt="Carro Categoria B"
      width={800}
      height={600}
      className="w-full h-auto object-contain opacity-90"
    />
  </div>
)

const BikeImageIcon = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <Image
      src="/images/moto-sem-fundo.png"
      alt="Moto Categoria A"
      width={800}
      height={600}
      className="w-full h-auto object-contain opacity-90"
    />
  </div>
)

const TruckImageIcon = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <Image
      src="/images/caminhao-sem-fundo.png"
      alt="Caminhão Categoria C"
      width={800}
      height={600}
      className="w-full h-auto object-contain opacity-90"
    />
  </div>
)

const BusImageIcon = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <Image
      src="/images/onibus-sem-fundo.png"
      alt="Ônibus Categoria D"
      width={800}
      height={600}
      className="w-full h-auto object-contain opacity-90"
    />
  </div>
)

const cnhCategories = [
  {
    id: "categoria-b",
    name: "Categoria B",
    description: "Para veículos de passeio - carros comuns e utilitários leves",
    icon: CarImageIcon, // Carro PNG na categoria B
    tint: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
    details: {
      vehicles: "Carros, vans e utilitários até 3.500kg",
      passengers: "Até 8 passageiros",
      minAge: "18 anos",
      requirements: "Alfabetizado e aprovado em exames médico e psicológico",
    },
  },
  {
    id: "categoria-a",
    name: "Categoria A",
    description: "Para motos, motonetas, ciclomotores e triciclos motorizados",
    icon: BikeImageIcon, // Moto PNG na categoria A
    tint: "bg-amber-50",
    gradient: "from-amber-500 to-amber-600",
    details: {
      vehicles: "Motos, motonetas e triciclos",
      passengers: "Conforme especificação do fabricante",
      minAge: "18 anos",
      requirements: "Alfabetizado e aprovado em exames médico e psicológico",
    },
  },
  {
    id: "categoria-c",
    name: "Categoria C",
    description: "Para veículos de carga - caminhões e tratores",
    icon: TruckImageIcon,
    tint: "bg-green-50",
    gradient: "from-green-500 to-green-600",
    details: {
      vehicles: "Caminhões, tratores e veículos acima de 3.500kg",
      passengers: "Conforme especificação",
      minAge: "21 anos",
      requirements: "Ter CNH B por no mínimo 1 ano",
    },
  },
  {
    id: "categoria-d",
    name: "Categoria D",
    description: "Para transporte de passageiros - ônibus e vans",
    icon: BusImageIcon, // Substituído BusIcon SVG por BusImageIcon PNG
    tint: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
    details: {
      vehicles: "Ônibus, vans e micro-ônibus com mais de 8 passageiros",
      passengers: "Acima de 8 passageiros",
      minAge: "21 anos",
      requirements: "Ter CNH B ou C por no mínimo 2 anos",
    },
  },
]

export function MaterialsSection() {
  const [activeCategory, setActiveCategory] = useState("categoria-b")
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: backgroundRef,
    offset: ["start end", "end start"],
  })

  const yImage = useTransform(imageScrollProgress, [0, 1], [-150, 150])
  const yBackground = useTransform(bgScrollProgress, [0, 1], [-80, 80])
  const yText = useTransform(sectionScrollProgress, [0, 1], [-50, 50])
  const scale = useTransform(sectionScrollProgress, [0, 0.5, 1], [0.8, 1, 0.95])
  const opacity = useTransform(sectionScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3])

  const instructorCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      "categoria-b": 0,
      "categoria-a": 0,
      "categoria-c": 0,
      "categoria-d": 0,
    }

    instructors.forEach((instructor) => {
      const role = instructor.role?.toLowerCase() || ""
      if (role.includes("categoria b") || role.includes("b/")) counts["categoria-b"]++
      if (role.includes("categoria a") || role.includes("a/")) counts["categoria-a"]++
      if (role.includes("categoria c") || role.includes("c/")) counts["categoria-c"]++
      if (role.includes("categoria d") || role.includes("d/")) counts["categoria-d"]++
    })

    return counts
  }, [])

  const activeCategoryData = cnhCategories.find((c) => c.id === activeCategory) || cnhCategories[0]
  const activeInstructorCount = instructorCountByCategory[activeCategory] || 0

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
      <span>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.03,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <section ref={sectionRef} className="relative min-h-[78vh] overflow-hidden w-full max-w-full" id="materials">
      <motion.div
        ref={backgroundRef}
        style={{ y: yBackground }}
        className="absolute inset-0 opacity-5 pointer-events-none"
      >
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      <div className="flex flex-col md:flex-row min-h-[78vh]">
        <div className="relative w-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-22 sm:py-30 flex items-center">
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <motion.div style={{ y: yText, opacity }} className="text-white">
                  <Reveal>
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.h2
                          key={activeCategory}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="font-bold mb-3 text-2xl sm:text-3xl md:text-4xl"
                        >
                          <AnimatedText text={activeCategoryData.name} delay={0.2} />
                        </motion.h2>
                      </AnimatePresence>
                      <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-5">
                        {activeCategoryData.description}
                      </p>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeCategory}-count`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block mb-5 px-4 py-2 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400/40"
                        >
                          <p className="text-white text-xs sm:text-sm font-semibold">
                            {activeInstructorCount} instrutor{activeInstructorCount !== 1 ? "es" : ""} disponíve
                            {activeInstructorCount !== 1 ? "is" : "l"}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeCategory}-details`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 mb-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-3">
                              <p className="text-xs text-amber-300 mb-1 font-semibold">Veículos</p>
                              <p className="text-sm text-white font-medium leading-tight">
                                {activeCategoryData.details.vehicles}
                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-amber-500/20 to-amber-400/10 backdrop-blur-sm border border-amber-400/30 rounded-xl p-3">
                              <p className="text-xs text-amber-300 mb-1 font-semibold">Idade Mínima</p>
                              <p className="text-sm text-white font-medium">{activeCategoryData.details.minAge}</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-emerald-400/20 to-amber-400/10 backdrop-blur-sm border border-emerald-300/30 rounded-xl p-3">
                            <p className="text-xs text-amber-300 mb-1 font-semibold">Requisitos</p>
                            <p className="text-sm text-white font-medium leading-tight">
                              {activeCategoryData.details.requirements}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCategory}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-row gap-2.5 mt-5 mb-6"
                        >
                          <motion.a
                            href="/aluno"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-emerald-700 hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-lg"
                          >
                            Quero Aprender
                          </motion.a>
                          <motion.a
                            href="/instrutor"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300 shadow-lg"
                          >
                            Quero Ensinar
                          </motion.a>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-4">
                        <Reveal delay={0.1}>
                          <div className="flex gap-2 pb-2">
                            {cnhCategories.map((category) => (
                              <motion.button
                                key={category.id}
                                className={cn(
                                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all duration-300 backdrop-blur-md",
                                  activeCategory === category.id
                                    ? "bg-white text-emerald-700 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30",
                                )}
                                onClick={() => setActiveCategory(category.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {category.name}
                              </motion.button>
                            ))}
                          </div>
                        </Reveal>
                      </div>
                    </div>
                  </Reveal>
                </motion.div>

                <motion.div
                  ref={imageRef}
                  style={{ y: yImage, scale }}
                  className="relative min-h-[37vh] md:min-h-[46vh] flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      className="relative w-full max-w-xl aspect-square"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {activeCategoryData.icon && <activeCategoryData.icon />}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
