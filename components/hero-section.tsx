"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useMotionDebug } from "@/hooks/use-motion-debug"
import { useRef, useState, useEffect } from "react"
import { HeaderContent } from "@/components/header-content"
import { Check, Shield, Heart, ChevronLeft, ChevronRight } from "lucide-react"

const CAROUSEL_SLIDES = [
  {
    title: "Como funciona",
    description: "Encontre, compare e contrate instrutores verificados em 3 passos simples",
    items: [
      "Busque instrutores por categoria e localização",
      "Compare preços, avaliações e especialidades",
      "Converse pelo chat protegido da Via Betel",
    ],
    icon: Check,
  },
  {
    title: "Confiança e Segurança",
    description: "Sua privacidade é nossa prioridade máxima",
    items: [
      "Todos instrutores verificados pelo DETRAN",
      "Contato intermediado - sem exposição de dados",
      "Suporte interno para resolver qualquer problema",
    ],
    icon: Shield,
  },
  {
    title: "Ferramentas Inteligentes",
    description: "Encontre o instrutor perfeito com recursos premium",
    items: [
      "Favoritos e Comparação lado a lado",
      "Salve buscas e receba notificações",
      "Filtros avançados: preço, avaliação, especialidade",
    ],
    icon: Heart,
  },
]

export function HeroSection() {
  const { shouldDisableMotion } = useMotionDebug()
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLElement>(null)
  const heroEndRef = useRef<HTMLDivElement>(null)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [isPaused])

  const logoY = useTransform(scrollY, [0, 500], [0, -80])
  const logoScale = useTransform(scrollY, [0, 400], [1, 0.85])
  const titleY = useTransform(scrollY, [0, 500], [0, -60])
  const titleScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const subtitleY = useTransform(scrollY, [0, 500], [0, -40])
  const buttonsY = useTransform(scrollY, [0, 500], [0, -20])
  const statsY = useTransform(scrollY, [0, 500], [0, 30])
  const badgeY = useTransform(scrollY, [0, 500], [0, -100])
  const parallaxY = useTransform(scrollY, [0, 500], [0, -28])
  const parallaxYInverse = useTransform(parallaxY, (v) => -v * 0.7)

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

  const slide = CAROUSEL_SLIDES[currentSlide]
  const Icon = slide.icon

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-[75vh] sm:min-h-[90vh] lg:min-h-[560px] flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary-darkest)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-secondary-dark)] text-[var(--color-brand-text-light)] overflow-hidden"
    >
      <div className="fixed top-0 left-0 right-0 z-[100] w-full">
        <div
          className="bg-gradient-to-r from-emerald-800/95 via-emerald-700/95 to-teal-700/95 backdrop-blur-md shadow-lg border-b border-white/10"
          style={{
            transition: "all 0.4s ease-in-out",
          }}
        >
          <div className="container mx-auto max-w-7xl w-full">
            <HeaderContent variant="hero" />
          </div>
        </div>
      </div>

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
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="mx-auto max-w-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{slide.title}</h3>
                    <p className="text-sm md:text-base text-emerald-100">{slide.description}</p>
                  </div>
                </div>
                <ul className="space-y-3 text-left">
                  {slide.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-emerald-400/20 rounded-full">
                        <Check className="w-4 h-4 text-emerald-300" />
                      </div>
                      <span className="text-sm md:text-base text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex gap-2">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? "w-8 bg-emerald-400" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Ir para slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : buttonsY,
            }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-0"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-brand-accent)] to-[var(--color-brand-accent-dark)] hover:from-[var(--color-brand-accent-dark)] hover:to-[var(--color-brand-accent)] text-[var(--color-brand-text-light)] font-semibold shadow-2xl shadow-[var(--color-brand-accent)]/50 border-0 px-6 sm:px-8 py-4 sm:py-5 lg:px-10 lg:py-6 text-sm sm:text-base lg:text-lg rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Link href="/instrutores">Encontrar Instrutor</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[var(--color-brand-text-light)] border-2 border-white/30 hover:border-white/50 backdrop-blur-sm font-semibold px-6 sm:px-8 py-4 sm:py-5 lg:px-10 lg:py-6 text-sm sm:text-base lg:text-lg rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Link href="#como-funciona">Como Funciona</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            style={{
              y: shouldDisableMotion ? 0 : statsY,
            }}
            className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-8 mt-6 sm:mt-8 lg:mt-12 max-w-3xl mx-auto"
          >
            {[
              { value: "500+", label: "Instrutores" },
              { value: "10k+", label: "Alunos" },
              { value: "4.9★", label: "Avaliação" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-brand-accent-light)]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[var(--color-brand-text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div ref={heroEndRef} className="absolute bottom-0 left-0 w-full h-1" />
    </motion.section>
  )
}
