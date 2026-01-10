"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useMotionDebug } from "@/hooks/use-motion-debug"

export function HeroSection() {
  const { shouldDisableMotion } = useMotionDebug()
  const { scrollY } = useScroll()

  // Logo parallax intenso + scale sutil
  const logoY = useTransform(scrollY, [0, 500], [0, -80])
  const logoScale = useTransform(scrollY, [0, 400], [1, 0.85])

  // Título parallax médio rápido
  const titleY = useTransform(scrollY, [0, 500], [0, -60])
  const titleScale = useTransform(scrollY, [0, 400], [1, 0.95])

  // Subtítulo parallax médio lento
  const subtitleY = useTransform(scrollY, [0, 500], [0, -40])

  // Botões parallax leve (sempre visíveis e clicáveis)
  const buttonsY = useTransform(scrollY, [0, 500], [0, -20])

  // Stats parallax inverso (sobe enquanto scrolla)
  const statsY = useTransform(scrollY, [0, 500], [0, 30])

  // Badge parallax super rápido
  const badgeY = useTransform(scrollY, [0, 500], [0, -100])

  // Background blobs parallax original
  const parallaxY = useTransform(scrollY, [0, 500], [0, -28])
  const parallaxYInverse = useTransform(parallaxY, (v) => -v * 0.7)

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Olá! Vim do site da Via Betel. Quero aulas de direção. Pode me orientar sobre valores e disponibilidade?",
    )
    window.open(`https://wa.me/5532988093506?text=${message}`, "_blank")
  }

  const containerVariants = shouldDisableMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      }

  const itemVariants = shouldDisableMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }

  return (
    <motion.section className="relative min-h-[75vh] sm:min-h-[90vh] lg:min-h-[560px] flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary-darkest)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-secondary-dark)] text-[var(--color-brand-text-light)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <motion.div
        style={{ y: shouldDisableMotion ? 0 : parallaxY }}
        className="absolute top-10 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-[var(--color-brand-accent)]/30 rounded-full blur-2xl lg:blur-3xl"
      />
      <motion.div
        style={{ y: shouldDisableMotion ? 0 : parallaxYInverse }}
        className="absolute bottom-10 right-10 w-56 h-56 lg:w-80 lg:h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-2xl lg:blur-3xl"
      />

      <div className="container relative z-10 px-6 sm:px-6 py-8 sm:py-16 md:py-20 lg:py-24 max-w-7xl w-full">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-full text-center space-y-3 sm:space-y-5 lg:space-y-8"
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : logoY,
              scale: shouldDisableMotion ? 1 : logoScale,
            }}
            className="flex justify-center mb-2 sm:mb-4"
          >
            <div className="relative w-32 h-12 sm:w-48 sm:h-16 md:w-56 md:h-20 lg:w-64 lg:h-24">
              <Image
                src="/images/viabetel-logo.png"
                alt="Via Betel - Auto Escola"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : badgeY,
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-accent)]/20 to-[var(--color-brand-primary)]/20 backdrop-blur-sm border border-[var(--color-brand-accent-light)]/30 rounded-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 shadow-lg shadow-[var(--color-brand-accent)]/20"
          >
            <span className="text-xs sm:text-sm lg:text-base font-medium text-[var(--color-brand-text-muted)]">
              Plataforma líder em CNH
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : titleY,
              scale: shouldDisableMotion ? 1 : titleScale,
            }}
            className="text-[1.625rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.25] sm:leading-tight px-0 max-w-full"
          >
            <span className="block text-balance">Encontre seu instrutor </span>
            <span className="bg-gradient-to-r from-[var(--color-brand-accent-light)] via-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] bg-clip-text text-transparent drop-shadow-lg">
              ideal
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : subtitleY,
            }}
            className="mx-auto max-w-full sm:max-w-2xl text-[0.8125rem] sm:text-base md:text-lg lg:text-xl leading-relaxed text-[var(--color-brand-text-muted)] px-0"
          >
            <span className="block text-pretty">
              Conectamos você aos melhores instrutores certificados do Brasil. Aprenda a dirigir com confiança e
              segurança.
            </span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : buttonsY,
            }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center items-stretch sm:items-center px-0 max-w-full"
          >
            <motion.div
              whileHover={shouldDisableMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldDisableMotion ? {} : { scale: 0.98 }}
            >
              <Button
                size="lg"
                asChild
                className="group relative w-full sm:w-auto bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] hover:from-[var(--color-brand-accent-dark)] hover:to-[var(--color-brand-accent-darker)] text-[var(--color-brand-text-light)] font-semibold px-4 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-[0.8125rem] sm:text-base lg:text-lg shadow-xl shadow-[var(--color-brand-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-brand-accent)]/50 transition-all duration-300 min-h-[48px] border border-[var(--color-brand-accent-light)]/50 overflow-hidden"
              >
                <Link href="/instrutores" className="relative z-10">
                  <span className="relative">Ver Catálogo de Instrutores</span>
                  {!shouldDisableMotion && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  )}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={shouldDisableMotion ? {} : { scale: 1.02 }}
              whileTap={shouldDisableMotion ? {} : { scale: 0.98 }}
            >
              <Button
                size="lg"
                asChild
                variant="outline"
                className="w-full sm:w-auto border-2 border-[var(--color-brand-accent-light)] bg-transparent text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-accent)]/20 hover:border-[var(--color-brand-accent-light)] font-semibold px-4 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-[0.8125rem] sm:text-base lg:text-lg transition-all min-h-[48px]"
              >
                <Link href="/orcamento">Quero Orçamento Rápido</Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={shouldDisableMotion ? {} : { scale: 1.02 }}
              whileTap={shouldDisableMotion ? {} : { scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={handleWhatsAppClick}
                variant="ghost"
                className="w-full sm:w-auto text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-accent)]/10 font-medium px-4 py-3 text-[0.8125rem] sm:text-base transition-all"
              >
                Suporte WhatsApp
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : statsY,
            }}
            className="grid grid-cols-3 gap-1.5 sm:gap-6 lg:gap-10 pt-4 sm:pt-10 lg:pt-12 max-w-full mx-auto px-1 sm:px-0"
          >
            {[
              { value: "Em expansão", label: "Na sua região" },
              { value: "Conectando", label: "Alunos e instrutores" },
              { value: "Qualidade", label: "Certificada" },
            ].map((stat, index) => (
              <div key={index} className="text-center min-w-0 px-0.5">
                <div className="text-[0.6875rem] sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-[var(--color-brand-accent-light)] to-[var(--color-brand-text-light)] bg-clip-text text-transparent leading-tight">
                  {stat.value}
                </div>
                <div className="text-[0.5rem] sm:text-xs lg:text-sm text-[var(--color-brand-text-muted)]/80 mt-0.5 lg:mt-2 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
