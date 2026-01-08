"use client"

import { motion } from "framer-motion"
import { Users, GraduationCap, Award, TrendingUp } from "lucide-react"
import { Reveal } from "./reveal"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
  {
    id: 1,
    icon: Users,
    value: 15000,
    suffix: "+",
    label: "Alunos Formados",
    description: "Milhares de vidas transformadas",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    icon: GraduationCap,
    value: 250,
    suffix: "+",
    label: "Instrutores Certificados",
    description: "Profissionais qualificados",
    color: "from-green-500 to-green-600",
  },
  {
    id: 3,
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Taxa de Aprovação",
    description: "Excelência comprovada",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: 4,
    icon: TrendingUp,
    value: 5,
    suffix: " anos",
    label: "No Mercado",
    description: "Experiência consolidada",
    color: "from-purple-500 to-purple-600",
  },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const duration = 2000

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-7 md:mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Resultados que <span className="text-amber-500">inspiram</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Números que comprovam nossa dedicação em transformar vidas através da educação no trânsito
            </motion.p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon

            return (
              <Reveal key={stat.id} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="group relative bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <div
                    className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tabular-nums">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
