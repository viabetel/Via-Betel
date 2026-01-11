"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { AppLink } from "@/components/app-link"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Shield, MessageCircle, Search, MapPin, Car, Briefcase } from "lucide-react"

const HERO_SLIDES = [
  {
    id: 1,
    title: "Encontre instrutores",
    subtitle: "verificados",
    description: "Explore nosso marketplace com instrutores certificados em sua região.",
    badge: "MARKETPLACE",
    cta: "Explorar Marketplace",
    ctaLink: "/marketplace",
    icon: Search,
  },
  {
    id: 2,
    title: "Peça orçamento e",
    subtitle: "acompanhe o status",
    description: "Solicite orçamentos e rastreie em tempo real pela Via Betel.",
    badge: "RASTREAMENTO",
    cta: "Minhas Solicitações",
    ctaLink: "/conta/solicitacoes",
    icon: Shield,
  },
  {
    id: 3,
    title: "Converse com segurança",
    subtitle: "no chat Via Betel",
    description: "Todos os contatos são intermediados pela plataforma.",
    badge: "SEGURANÇA",
    cta: "Abrir Chat",
    ctaLink: "/chat",
    icon: MessageCircle,
  },
  {
    id: 4,
    title: "Seja um instrutor",
    subtitle: "verificado na Via Betel",
    description: "Expanda seus negócios e alcance mais alunos através da nossa plataforma.",
    badge: "CADASTRO",
    cta: "Cadastrar como Instrutor",
    ctaLink: "/inscricao?userType=instructor&returnTo=/instrutor/ativar",
    icon: Briefcase,
  },
]

function ViaBetelRoadsSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 180 L40 60" stroke="rgba(255,255,255,0.15)" strokeWidth="24" strokeLinecap="round" />
      <path d="M100 180 L160 60" stroke="rgba(255,255,255,0.15)" strokeWidth="24" strokeLinecap="round" />
      <path
        d="M85 150 L55 85"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 12"
      />
      <path
        d="M115 150 L145 85"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 12"
      />
    </svg>
  )
}

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
        const heroIsVisible = entry.isIntersecting
        window.dispatchEvent(
          new CustomEvent("heroVisibilityChange", {
            detail: { isHeroVisible: heroIsVisible },
          }),
        )
      },
      {
        threshold: 0,
        rootMargin: "-150px 0px 0px 0px",
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
    <section
      ref={heroRef}
      className="relative h-[520px] sm:h-[540px] lg:h-[580px] flex flex-col overflow-hidden pt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={sentinelRef} className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none" />

      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              #22c55e 0%, 
              #16a34a 25%, 
              #15803d 50%, 
              #166534 75%, 
              #14532d 100%
            )`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 20% 20%, 
              rgba(74, 222, 128, 0.4) 0%, 
              transparent 60%
            )`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 80% 80%, 
              rgba(20, 184, 166, 0.3) 0%, 
              transparent 50%
            )`,
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ViaBetelRoadsSVG className="absolute -left-10 top-1/4 w-[300px] h-[300px] opacity-40" />
        <ViaBetelRoadsSVG className="absolute -right-20 bottom-10 w-[400px] h-[400px] opacity-30 rotate-12" />

        <motion.div
          className="absolute top-24 right-[20%] text-amber-400"
          animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <MapPin className="w-10 h-10 drop-shadow-lg" fill="currentColor" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-[15%] text-white/30"
          animate={prefersReducedMotion ? {} : { x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Car className="w-16 h-16" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-10 w-4 h-4 rounded-full bg-amber-400/60"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[30%] w-3 h-3 rounded-full bg-white/40"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-5 h-5 rounded-full bg-teal-300/50"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
      </div>

      {/* Road pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.5) 40px,
            rgba(255,255,255,0.5) 60px,
            transparent 60px,
            transparent 100px
          )`,
        }}
      />

      {/* Main content */}
      <div className="container relative z-10 px-4 sm:px-6 flex-1 flex items-center max-w-7xl w-full mx-auto py-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-white space-y-4 max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-white/95 text-emerald-700">
                <Icon className="w-3.5 h-3.5" />
                {slide.badge}
              </div>

              <div>
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-1"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                >
                  {slide.title}
                </h1>
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-amber-300"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                >
                  {slide.subtitle}!
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md">{slide.description}</p>

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

              <div className="flex gap-6 pt-4">
                {[
                  { value: "500+", label: "Instrutores", color: "text-white" },
                  { value: "10k+", label: "Alunos", color: "text-white" },
                  { value: "4.9", label: "Avaliação", color: "text-amber-300" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className={`text-2xl font-bold ${stat.color}`}
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${currentSlide}`}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="hidden lg:flex justify-end shrink-0"
            >
              <div className="relative w-[200px] h-[240px]">
                <div
                  className="absolute inset-0 rounded-3xl -z-10"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #f59e0b)",
                    filter: "blur(30px)",
                    opacity: 0.4,
                  }}
                />

                <div
                  className="absolute inset-0 bg-white/95 rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <div className="absolute top-4 left-4">
                    <div
                      className="text-6xl font-black leading-none"
                      style={{
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #f59e0b 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {slide.id}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #22c55e, #14b8a6, #f59e0b)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        key={currentSlide}
                      />
                    </div>
                    <div className="text-sm font-bold text-emerald-700 leading-tight pt-1">{slide.badge}</div>
                    <div className="text-xs font-medium text-emerald-600/70 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Via Betel 2025
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3">
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30"
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
                aria-current={idx === currentSlide ? "true" : undefined}
                role="tab"
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Wave decoration */}
      <svg
        viewBox="0 0 1440 60"
        className="absolute bottom-0 left-0 right-0 w-full h-auto"
        preserveAspectRatio="none"
        fill="white"
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
      </svg>
    </section>
  )
}
