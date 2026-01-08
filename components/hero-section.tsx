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
    <section className="relative min-h-[480px] lg:min-h-[560px] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="absolute top-20 left-20 w-72 h-72 lg:w-80 lg:h-80 bg-amber-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 lg:w-96 lg:h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-32 max-w-7xl">
        <div className="mx-auto max-w-4xl lg:max-w-5xl text-center space-y-6 lg:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-4 lg:px-5 py-2 lg:py-2.5 shadow-lg shadow-amber-500/20"
          >
            <span className="text-sm lg:text-base font-medium text-amber-100">Plataforma líder em CNH</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Encontre seu instrutor{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100 bg-clip-text text-transparent drop-shadow-lg">
              ideal
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl lg:max-w-3xl text-base text-emerald-100 md:text-lg lg:text-xl leading-relaxed"
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
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 lg:px-10 py-5 lg:py-6 text-base lg:text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all hover:scale-105 min-h-[44px] border border-amber-400/50"
            >
              Chamar no WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-2 border-amber-400 bg-transparent text-amber-100 hover:bg-amber-500/20 hover:border-amber-300 font-semibold px-8 lg:px-10 py-5 lg:py-6 text-base lg:text-lg transition-all hover:scale-105 min-h-[44px]"
            >
              <a href="/aluno">Quero orçamento rápido</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 lg:gap-10 pt-10 lg:pt-12 max-w-2xl lg:max-w-3xl mx-auto"
          >
            {[
              { value: "Em expansão", label: "Na sua região" },
              { value: "Conectando", label: "Alunos e instrutores" },
              { value: "Qualidade", label: "Certificada" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-amber-200 to-white bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-amber-100/80 mt-1 lg:mt-2">{stat.label}</div>
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
