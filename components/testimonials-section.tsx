"use client"

import { cn } from "@/lib/utils"

import { motion, useScroll, useTransform } from "framer-motion"
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react"
import { Reveal } from "./reveal"
import { useRef } from "react"

const testimonials = [
  {
    id: 1,
    name: "Carlos Mendes",
    role: "Novo Motorista Categoria B",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "A Via Betel mudou minha vida! Consegui minha habilitação em tempo recorde com instrutores muito pacientes e profissionais. O método de ensino é excelente e me senti preparado para o exame desde o início.",
  },
  {
    id: 2,
    name: "Mariana Silva",
    role: "Motorista Profissional Categoria D",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Sempre quis ser motorista de ônibus e a Via Betel tornou esse sonho realidade. Os instrutores têm vasta experiência e me ensinaram não só para passar no exame, mas para ser uma profissional de verdade. Hoje trabalho em uma grande empresa de transporte!",
  },
  {
    id: 3,
    name: "João Pedro Santos",
    role: "Instrutor Parceiro",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Como instrutor, a plataforma da Via Betel facilitou muito minha vida. Consigo gerenciar meus alunos, horários e receber pagamentos de forma simples e segura. A equipe de suporte está sempre disponível quando preciso. Recomendo!",
  },
]

const stats = [
  {
    icon: Users,
    value: "15.000+",
    label: "Alunos Aprovados",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Award,
    value: "95%",
    label: "Taxa de Aprovação",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    value: "4.9/5",
    label: "Avaliação Média",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className={cn("inline-flex p-3 rounded-xl mb-4", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{stat.value}</h3>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full blur-xl opacity-30" />
                <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
                  <Quote className="w-5 h-5" />
                  <span className="text-sm font-semibold">Histórias de Sucesso</span>
                </div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
            >
              Transformando Vidas,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                Uma Carteira por Vez
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
            >
              Conheça as histórias reais de quem conquistou independência e novas oportunidades profissionais
            </motion.p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="w-12 h-12 text-emerald-600 opacity-20" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-neutral-700 leading-relaxed mb-8 text-base flex-grow">{testimonial.text}</p>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-base">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Comece Sua Jornada Agora
            </motion.button>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
