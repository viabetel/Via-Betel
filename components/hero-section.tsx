"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Olá! Vim do Instagram da Via Betel. Quero aulas de direção. Pode me orientar sobre valores e disponibilidade?",
    )
    window.open(`https://wa.me/5532988093506?text=${message}`, "_blank")
  }

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 lg:w-96 lg:h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 px-4 py-20 md:py-32 lg:py-40 max-w-7xl">
        <div className="mx-auto max-w-4xl lg:max-w-5xl text-center space-y-8 lg:space-y-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 lg:px-5 py-2 lg:py-2.5"
          >
            <span className="text-sm lg:text-base font-medium">Plataforma líder em CNH</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            Encontre seu instrutor{" "}
            <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">ideal</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl lg:max-w-3xl text-lg text-emerald-100 md:text-xl lg:text-2xl leading-relaxed"
          >
            Conectamos você aos melhores instrutores certificados do Brasil. Aprenda a dirigir com confiança e
            segurança.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 lg:gap-5 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 font-semibold px-8 lg:px-10 py-6 lg:py-7 text-lg lg:text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 min-h-[44px]"
            >
              Chamar no WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold px-8 lg:px-10 py-6 lg:py-7 text-lg lg:text-xl transition-all hover:scale-105 min-h-[44px]"
            >
              <a href="/aluno">Quero orçamento rápido</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 lg:gap-12 pt-12 lg:pt-16 max-w-2xl lg:max-w-3xl mx-auto"
          >
            {[
              { value: "Em expansão", label: "Na sua região" },
              { value: "Conectando", label: "Alunos e instrutores" },
              { value: "Qualidade", label: "Certificada" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm lg:text-base text-emerald-200 mt-1 lg:mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
