"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "./reveal"
import { GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react"
import { useRef } from "react"
import { AppLink } from "@/components/app-link"

const benefitCards = [
  {
    id: "instructor-benefits",
    title: "Para Instrutores",
    subtitle: "Expanda seu negócio",
    description:
      "Conecte-se com alunos qualificados, receba pagamentos garantidos através da plataforma e gerencie sua agenda de forma inteligente. Construa sua reputação e cresça com segurança.",
    icon: GraduationCap,
    badge: "PROFISSIONAIS",
    ctaText: "Começar a receber alunos",
    ctaLink: "/instrutor",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    id: "student-benefits",
    title: "Para Alunos",
    subtitle: "Aprenda com os melhores",
    description:
      "Escolha instrutores verificados com horários flexíveis que se adaptam à sua rotina. Tenha acompanhamento personalizado, material didático completo e metodologia comprovada para sua aprovação.",
    icon: Users,
    badge: "MARKETPLACE",
    ctaText: "Encontrar instrutor ideal",
    ctaLink: "/aluno",
    gradient: "from-emerald-600 to-teal-700",
    iconBg: "bg-gradient-to-br from-emerald-600 to-teal-700",
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

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      id="featured-products"
      style={{
        opacity,
        y,
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl w-full relative z-10">
        <Reveal>
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold tracking-wider text-amber-600 uppercase">Por que escolher</span>
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              A melhor plataforma para
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                instrutores e alunos
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conectamos instrutores certificados a alunos dedicados, criando experiências de aprendizado seguras,
              personalizadas e de alta qualidade.
            </p>
          </motion.div>
        </Reveal>

        <motion.div
          className="flex flex-col gap-6 sm:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {benefitCards.map((card, index) => {
            const IconComponent = card.icon

            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    },
                  },
                }}
              >
                <Reveal delay={index * 0.15}>
                  <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border-2 border-gray-100 hover:border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="flex flex-col md:flex-row">
                      {/* Bloco esquerdo: ícone + CTA */}
                      <div className="relative md:w-[35%] lg:w-[30%] bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 flex flex-col items-center justify-center gap-6 border-r-2 border-gray-100 overflow-hidden">
                        {/* Decoração */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Badge pequeno */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md">
                            {card.badge}
                          </span>
                        </div>

                        {/* Ícone grande */}
                        <div
                          className={`relative z-10 ${card.iconBg} rounded-3xl p-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}
                        >
                          <IconComponent className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                        </div>

                        {/* CTA */}
                        <AppLink href={card.ctaLink} variant="nav" className="relative z-10 w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r ${card.gradient} text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2 group`}
                          >
                            {card.ctaText}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </AppLink>
                      </div>

                      {/* Bloco direito: conteúdo textual */}
                      <div className="relative md:w-[65%] lg:w-[70%] p-8 sm:p-10 flex flex-col justify-center bg-white">
                        {/* Decoração radial */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/[0.02] via-transparent to-transparent" />

                        <div className="relative z-10">
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                            {card.title}
                          </h3>
                          <p className="text-sm font-semibold text-emerald-600 mb-4 tracking-wide uppercase">
                            {card.subtitle}
                          </p>
                          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                            {card.description}
                          </p>
                        </div>

                        {/* Borda dourada sutil no hover */}
                        <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/20 rounded-2xl transition-all duration-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Overlay gradiente no hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" />
                  </div>
                </Reveal>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
