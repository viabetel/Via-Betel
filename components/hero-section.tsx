"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { AppLink } from "@/components/app-link"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Shield, MessageCircle, Search } from "lucide-react"
import { HeaderContent } from "@/components/header-content"
import Image from "next/image"

const HERO_SLIDES = [
  {
    id: 1,
    title: "Encontre instrutores",
    subtitle: "verificados",
    description: "Explore nosso marketplace com instrutores certificados em sua região.",
    badge: "MARKETPLACE",
    badgeColor: "from-white/90 to-white/80",
    badgeTextColor: "text-emerald-700",
    cta: "Explorar Marketplace",
    ctaLink: "/instrutores",
    icon: Search,
    bgImage: "/professional-driving-instructor-teaching-student-i.jpg",
  },
  {
    id: 2,
    title: "Peça orçamento e",
    subtitle: "acompanhe o status",
    description: "Solicite orçamentos e rastreie em tempo real pela Via Betel.",
    badge: "RASTREAMENTO",
    badgeColor: "from-white/90 to-white/80",
    badgeTextColor: "text-emerald-700",
    cta: "Minhas Solicitações",
    ctaLink: "/conta/solicitacoes",
    icon: Shield,
    bgImage: "/happy-student-receiving-car-keys-from-driving-inst.jpg",
  },
  {
    id: 3,
    title: "Converse com segurança",
    subtitle: "no chat Via Betel",
    description: "Todos os contatos são intermediados pela plataforma.",
    badge: "SEGURANÇA",
    badgeColor: "from-white/90 to-white/80",
    badgeTextColor: "text-emerald-700",
    cta: "Abrir Chat",
    ctaLink: "/chat",
    icon: MessageCircle,
    bgImage: "/young-driver-smiling-confident-inside-modern-car-d.jpg",
  },
]

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const heroIsVisible = entry.isIntersecting || entry.intersectionRatio > 0

        window.dispatchEvent(
          new CustomEvent("heroVisibilityChange", {
            detail: { isHeroVisible: heroIsVisible },
          }),
        )
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "0px",
      },
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [isPaused, prefersReducedMotion])

  const slide = HERO_SLIDES[currentSlide]
  const Icon = slide.icon

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 15000)
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 15000)
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 15000)
  }

  return (
    <motion.section
      ref={heroRef}
      className="relative h-[500px] sm:h-[520px] lg:h-[560px] flex flex-col overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.bgImage || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.92) 0%, rgba(52, 211, 153, 0.88) 30%, rgba(20, 184, 166, 0.85) 60%, rgba(45, 212, 191, 0.82) 100%)",
        }}
      />

      {/* Padrão geométrico sutil sobreposto */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow shapes decorativos mais vibrantes */}
      <div
        className="absolute top-10 left-5 w-[250px] h-[250px] bg-white/20 rounded-full blur-3xl"
        style={{
          animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-teal-300/20 rounded-full blur-3xl"
        style={{
          animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "1.5s",
        }}
      />

      {/* Header integrado com fundo mais claro */}
      <div
        className="relative z-50 w-full bg-emerald-500/40 border-b border-white/20"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <HeaderContent variant="hero" />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container relative z-10 px-4 sm:px-6 flex-1 flex items-center max-w-7xl w-full mx-auto py-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center w-full">
          {/* Conteúdo esquerdo com carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-white space-y-4 max-w-xl"
            >
              {/* Badge com fundo branco para contraste */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r ${slide.badgeColor} ${slide.badgeTextColor}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {slide.badge}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-1 drop-shadow-lg">
                  {slide.title}
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-amber-300 drop-shadow-lg">
                  {slide.subtitle}!
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md drop-shadow-md">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-white hover:bg-white/90 text-emerald-700 font-bold shadow-xl hover:shadow-2xl border-0 px-6 hover:scale-105 transition-all duration-300"
                >
                  <AppLink href={slide.ctaLink}>{slide.cta}</AppLink>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-6 hover:scale-105 transition-all duration-300"
                >
                  <AppLink href="/como-funciona">Como funciona</AppLink>
                </Button>
              </div>

              {/* Stats rápidos */}
              <div className="flex gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">500+</div>
                  <div className="text-xs text-white/80">Instrutores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">10k+</div>
                  <div className="text-xs text-white/80">Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300 drop-shadow-lg">4.9</div>
                  <div className="text-xs text-white/80">Avaliação</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Card lateral direito - mais robusto */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${currentSlide}`}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, x: 50 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:flex justify-end shrink-0"
            >
              <div className="relative w-[180px] h-[220px]">
                {/* Card principal */}
                <div
                  className="absolute inset-0 bg-white/95 rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {/* Número do slide */}
                  <div className="absolute top-4 left-4">
                    <div className="text-5xl font-black bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent leading-none">
                      {slide.id}
                    </div>
                  </div>

                  {/* Ícone decorativo */}
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Conteúdo inferior */}
                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full" />
                    <div className="text-sm font-bold text-emerald-700 leading-tight pt-2">{slide.badge}</div>
                    <div className="text-xs font-semibold text-emerald-600/70">Via Betel 2025</div>
                  </div>
                </div>

                {/* Glow atrás do card */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-30 blur-2xl -z-10 scale-110" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles do carousel */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3">
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all hover:scale-110 border border-white/30"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Slides do carousel">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-8 bg-white shadow-lg" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
                aria-current={idx === currentSlide ? "true" : "false"}
                role="tab"
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all hover:scale-110 border border-white/30"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Onda decorativa na base */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px]">
          <path d="M0,0 C300,100 900,20 1200,80 L1200,120 L0,120 Z" fill="white" />
        </svg>
      </div>

      {/* Sentinel para IntersectionObserver */}
      <div ref={sentinelRef} className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none" />
    </motion.section>
  )
}
