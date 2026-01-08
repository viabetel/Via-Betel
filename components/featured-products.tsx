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
    ctaLink: "/cadastro?tipo=instrutor",
  },
  {
    id: "student-benefits",
    title: "Para Alunos",
    description:
      "Encontre o instrutor perfeito para você com horários flexíveis que se adaptam à sua rotina. Tenha acompanhamento personalizado em cada etapa, acesso a material didático completo e conte com metodologias comprovadas para sua aprovação garantida no menor tempo possível.",
    icon: Users,
    ctaText: "COMEÇAR AGORA",
    ctaLink: "/cadastro?tipo=aluno",
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
      className="py-6 md:py-8 lg:py-10 pb-0 relative overflow-hidden bg-white"
      id="featured-products"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <Reveal>
          <motion.div
            className="text-left mb-5 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl text-neutral-900 mb-2">
              Por que escolher a <span className="italic font-light">Via Betel</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 max-w-2xl">
              Conectamos instrutores qualificados a alunos dedicados, criando a melhor experiência de aprendizado.
            </p>
          </motion.div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-4 md:gap-5 max-w-3xl mx-auto"
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
                  <div className="group relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="flex flex-col md:flex-row h-full min-h-[192px]">
                      <div className="flex flex-col items-center justify-center p-5 md:p-6 bg-gradient-to-br from-green-600 to-green-800 md:w-2/5">
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
                        </div>

                        <Link href={card.ctaLink} className="w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-2.5 px-5 rounded-lg font-bold text-xs md:text-sm bg-amber-500 text-white shadow-lg hover:shadow-xl hover:bg-amber-600 transition-all duration-300"
                          >
                            {card.ctaText}
                          </motion.button>
                        </Link>
                      </div>

                      <div className="flex flex-col justify-center p-5 md:p-6 md:w-3/5 bg-gradient-to-br from-slate-800 to-slate-900">
                        <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{card.description}</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-amber-500/0 to-green-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </Reveal>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="relative h-32 mt-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </motion.section>
  )
}
