"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "./reveal"
import { GraduationCap, Users, Headphones, ChevronDown } from "lucide-react"
import { useRef, useState } from "react"
import Link from "next/link"

const benefitCards = [
  {
    id: "instructor-benefits",
    title: "Para Instrutores",
    description:
      "Conecte-se com alunos em todo o país e expanda sua agenda de forma inteligente. Receba pagamentos garantidos, gerencie horários facilmente e conte com suporte completo para focar no que importa: ensinar com excelência e construir sua reputação profissional.",
    icon: GraduationCap,
    ctaText: "RECEBER ALUNOS",
    ctaLink: "/instrutor",
  },
  {
    id: "student-benefits",
    title: "Para Alunos",
    description:
      "Encontre o instrutor perfeito para você com horários flexíveis que se adaptam à sua rotina. Tenha acompanhamento personalizado em cada etapa, acesso a material didático completo e conte com metodologias comprovadas para sua aprovação garantida no menor tempo possível.",
    icon: Users,
    ctaText: "COMEÇAR AGORA",
    ctaLink: "/aluno",
  },
  {
    id: "support",
    title: "Suporte Total",
    description:
      "Nossa equipe está disponível para ajudar você em cada passo da jornada. Com atendimento rápido via chat, WhatsApp e telefone, resolução eficiente de problemas e acompanhamento contínuo, garantimos que você tenha a melhor experiência possível na plataforma Via Betel.",
    icon: Headphones,
    ctaText: "FALAR COM SUPORTE",
    ctaLink: "#contato",
  },
]

export function FeaturedProducts() {
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  const card1Y = useTransform(scrollYProgress, [0.2, 0.5], [20, -10])
  const card2Y = useTransform(scrollYProgress, [0.2, 0.5], [30, -15])
  const card3Y = useTransform(scrollYProgress, [0.2, 0.5], [40, -20])

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }))
  }

  return (
    <motion.section
      ref={sectionRef}
      className="py-6 sm:py-12 md:py-14 lg:py-16 pb-0 relative overflow-hidden bg-white"
      id="featured-products"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-3 sm:px-6 max-w-7xl w-full relative z-10">
        <Reveal>
          <motion.div
            className="text-left mb-2 sm:mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-sm sm:text-2xl lg:text-3xl text-neutral-900 mb-0.5 sm:mb-3"
              style={{ fontSize: "clamp(0.875rem, 3vw, 2rem)" }}
            >
              Por que escolher a <span className="italic font-light">Via Betel</span>
            </h2>
            <p className="text-[10px] sm:text-base text-neutral-600 max-w-2xl text-pretty leading-tight sm:leading-normal">
              Conectamos instrutores qualificados a alunos dedicados, criando a melhor experiência de aprendizado.
            </p>
          </motion.div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-1.5 sm:gap-5 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {benefitCards.map((card, index) => {
            const IconComponent = card.icon
            const cardYTransform = index === 0 ? card1Y : index === 1 ? card2Y : card3Y
            const isExpanded = expandedCards[card.id]

            return (
              <motion.div
                key={card.id}
                style={{ y: cardYTransform }}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    },
                  },
                }}
              >
                <Reveal delay={index * 0.1}>
                  <div className="group relative h-full rounded-lg sm:rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-700/30">
                    <div className="flex flex-col md:flex-row h-full min-h-[100px] sm:min-h-[180px]">
                      <div className="flex items-center justify-between p-2 sm:p-6 md:p-7 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 md:w-[35%] md:flex-col relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="group-hover:scale-110 transition-transform duration-300 relative z-10">
                          <IconComponent
                            className="w-6 h-6 sm:w-14 sm:h-14 md:w-12 md:h-12 text-white drop-shadow-lg"
                            strokeWidth={1.5}
                          />
                        </div>

                        <Link href={card.ctaLink} className="relative z-10 w-auto md:w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="py-1.5 px-3 sm:py-3 sm:px-5 rounded-md sm:rounded-xl font-bold text-[10px] sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-amber-500/50 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 min-h-[36px] sm:min-h-[44px] w-full md:w-auto"
                          >
                            {card.ctaText}
                          </motion.button>
                        </Link>
                      </div>

                      <div className="flex flex-col justify-center p-2 sm:p-6 md:p-7 md:w-[65%] bg-gradient-to-br from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-sm relative min-w-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-50" />

                        <h3 className="text-xs sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-3 group-hover:text-amber-400 transition-colors duration-300 relative z-10">
                          {card.title}
                        </h3>

                        <div className="relative z-10">
                          <p
                            className={`text-[10px] sm:text-base text-emerald-50/90 leading-snug sm:leading-relaxed text-pretty ${
                              !isExpanded ? "line-clamp-2 sm:line-clamp-none" : ""
                            }`}
                          >
                            {card.description}
                          </p>
                          <button
                            onClick={() => toggleCard(card.id)}
                            className="sm:hidden mt-1 text-[9px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-medium"
                          >
                            {isExpanded ? "Ver menos" : "Ver mais"}
                            <ChevronDown
                              className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-amber-500/0 to-emerald-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

                    <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/30 rounded-2xl transition-all duration-500 pointer-events-none" />
                  </div>
                </Reveal>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="relative h-0 mt-0">
        <div className="absolute inset-0 bg-white" />
      </div>
    </motion.section>
  )
}
