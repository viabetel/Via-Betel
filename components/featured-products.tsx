"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "./reveal"
import { GraduationCap, Users, Headphones } from "lucide-react"
import { useRef } from "react"
import Link from "next/link"

const benefitCards = [
  {
    id: "instructor-benefits",
    title: "Para Instrutores",
    description:
      "Conecte-se com alunos em todo o país e expanda sua agenda de forma inteligente. Receba pagamentos garantidos, gerencie horários facilmente e conte com suporte completo para focar no que importa: ensinar com excelência e construir sua reputação profissional.",
    icon: GraduationCap,
    ctaText: "RECEBER ALUNOS",
    ctaLink: "/instrutor", // Corrigido de /cadastro?tipo=instrutor para /instrutor
  },
  {
    id: "student-benefits",
    title: "Para Alunos",
    description:
      "Encontre o instrutor perfeito para você com horários flexíveis que se adaptam à sua rotina. Tenha acompanhamento personalizado em cada etapa, acesso a material didático completo e conte com metodologias comprovadas para sua aprovação garantida no menor tempo possível.",
    icon: Users,
    ctaText: "COMEÇAR AGORA",
    ctaLink: "/aluno", // Corrigido de /cadastro?tipo=aluno para /aluno
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

  return (
    <motion.section
      ref={sectionRef}
      className="py-8 sm:py-10 md:py-12 lg:py-16 pb-0 relative overflow-hidden bg-white"
      id="featured-products"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl w-full relative z-10">
        <Reveal>
          <motion.div
            className="text-left mb-6 sm:mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-xl sm:text-2xl lg:text-3xl text-neutral-900 mb-2 sm:mb-3"
              style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)" }}
            >
              Por que escolher a <span className="italic font-light">Via Betel</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl text-pretty">
              Conectamos instrutores qualificados a alunos dedicados, criando a melhor experiência de aprendizado.
            </p>
          </motion.div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6"
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
                  <div className="group relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-700/30">
                    <div className="flex flex-col md:flex-row h-full min-h-[200px] sm:min-h-[180px]">
                      <div className="flex flex-col items-center justify-center p-5 sm:p-6 md:p-7 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 md:w-[35%] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                          <IconComponent
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 text-white drop-shadow-lg"
                            strokeWidth={1.5}
                          />
                        </div>

                        <Link href={card.ctaLink} className="w-full relative z-10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-3 px-4 sm:px-5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-amber-500/50 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 min-h-[44px]"
                          >
                            {card.ctaText}
                          </motion.button>
                        </Link>
                      </div>

                      <div className="flex flex-col justify-center p-5 sm:p-6 md:p-7 md:w-[65%] bg-gradient-to-br from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-sm relative min-w-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-50" />

                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-amber-400 transition-colors duration-300 relative z-10">
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed relative z-10 text-pretty">
                          {card.description}
                        </p>
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

      <div className="relative h-16 sm:h-20 md:h-24 mt-6 sm:mt-8">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
      </div>
    </motion.section>
  )
}
