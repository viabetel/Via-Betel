"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap, Trophy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { INSTRUCTOR_PLANS, formatPrice } from "@/lib/subscription-plans"
import Link from "next/link"

export default function ParaInstrutoresClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Conecte-se com <span className="text-amber-300">Alunos Qualificados</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
              Plataforma completa para instrutores de direção. Receba leads, gerencie propostas e cresça seu negócio.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: Star,
              title: "Leads Qualificados",
              description: "Receba solicitações de alunos interessados na sua região e categoria.",
            },
            {
              icon: Zap,
              title: "Gestão Simplificada",
              description: "Responda propostas, gerencie horários e feche negócios pela plataforma.",
            },
            {
              icon: Trophy,
              title: "Destaque-se",
              description: "Impulsione seu perfil e apareça no topo das buscas na sua cidade.",
            },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Plans */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Escolha seu Plano</h2>
          <p className="text-lg text-gray-600">Cancele quando quiser. Sem taxas ocultas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.values(INSTRUCTOR_PLANS).map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all
                ${plan.popular ? "border-4 border-amber-400 scale-105" : "border-2 border-gray-200"}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Mais Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`
                  w-full h-12 font-bold
                  ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  }
                `}
              >
                <Link href={`/instrutor/subscribe?plan=${plan.id}`}>
                  Assinar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ / CTA */}
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center border-2 border-emerald-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Pronto para crescer?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Junte-se a centenas de instrutores que já estão crescendo com a Via Betel. Comece hoje e receba seu primeiro
            lead em 24 horas.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold"
          >
            <Link href="/instrutor/subscribe?plan=price_destaque_monthly">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
