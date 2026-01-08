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
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-[560px] flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary-darkest)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-secondary-dark)] text-[var(--color-brand-text-light)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Reduced size of decorative blobs for better performance on mobile */}
      <div className="absolute top-10 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-[var(--color-brand-accent)]/30 rounded-full blur-2xl lg:blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-56 h-56 lg:w-80 lg:h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-2xl lg:blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-[var(--color-brand-accent-light)]/10 rounded-full blur-2xl lg:blur-3xl animate-pulse delay-500" />

      {/* Adjusted responsive padding and max-width */}
      <div className="container relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl w-full">
        <div className="mx-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl text-center space-y-5 sm:space-y-6 lg:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            // Adjusted padding for mobile
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-accent)]/20 to-[var(--color-brand-primary)]/20 backdrop-blur-sm border border-[var(--color-brand-accent-light)]/30 rounded-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 shadow-lg shadow-[var(--color-brand-accent)]/20"
          >
            <span className="text-xs sm:text-sm lg:text-base font-medium text-[var(--color-brand-text-muted)]">
              Plataforma líder em CNH
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            // Using clamp() for fluid typography and text-balance for better line break
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance leading-tight"
            style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)" }}
          >
            Encontre seu instrutor{" "}
            <span className="bg-gradient-to-r from-[var(--color-brand-accent-light)] via-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] bg-clip-text text-transparent drop-shadow-lg">
              ideal
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            // Added max-w-prose and text-pretty for better readability
            className="mx-auto max-w-prose text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[var(--color-brand-text-muted)] text-pretty px-2"
          >
            Conectamos você aos melhores instrutores certificados do Brasil. Aprenda a dirigir com confiança e
            segurança.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            // Buttons in column on mobile, side by side on tablet+
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center items-stretch sm:items-center px-2 sm:px-0"
          >
            <Button
              size="lg"
              onClick={handleWhatsAppClick}
              // Height minimum of 48px for accessibility touch on mobile
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] hover:from-[var(--color-brand-accent-dark)] hover:to-[var(--color-brand-accent-darker)] text-[var(--color-brand-text-light)] font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg shadow-xl shadow-[var(--color-brand-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-brand-accent)]/40 transition-all hover:scale-105 min-h-[48px] border border-[var(--color-brand-accent-light)]/50 active:scale-95"
            >
              Chamar no WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              // Height minimum of 48px and better responsiveness
              className="w-full sm:w-auto border-2 border-[var(--color-brand-accent-light)] bg-transparent text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-accent)]/20 hover:border-[var(--color-brand-accent-light)] font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg transition-all hover:scale-105 min-h-[48px] active:scale-95"
            >
              <a href="/aluno">Quero orçamento rápido</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            // Responsive grid with smaller gap on mobile
            className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-10 pt-8 sm:pt-10 lg:pt-12 max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto px-2"
          >
            {[
              { value: "Em expansão", label: "Na sua região" },
              { value: "Conectando", label: "Alunos e instrutores" },
              { value: "Qualidade", label: "Certificada" },
            ].map((stat, index) => (
              <div key={index} className="text-center min-w-0">
                <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-[var(--color-brand-accent-light)] to-[var(--color-brand-text-light)] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-[var(--color-brand-text-muted)]/80 mt-1 lg:mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
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
