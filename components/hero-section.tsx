"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { AppLink } from "@/components/app-link"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Shield, MessageCircle, Search } from "lucide-react"
import { HeaderContent } from "@/components/header-content"

const HERO_SLIDES = [
  {
    id: 1,
    title: "Encontre instrutores",
    subtitle: "verificados",
    description: "Explore nosso marketplace com instrutores certificados em sua região.",
    badge: "MARKETPLACE",
    badgeColor: "from-teal-400 to-teal-500",
    cta: "Explorar Marketplace",
    ctaLink: "/instrutores",
    icon: Search,
  },
  {
    id: 2,
    title: "Peça orçamento e",
    subtitle: "acompanhe o status",
    description: "Solicite orçamentos e rastreie em tempo real pela Via Betel.",
    badge: "RASTREAMENTO",
    badgeColor: "from-emerald-400 to-emerald-500",
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
    badgeColor: "from-emerald-400 to-teal-500",
    cta: "Abrir Chat",
    ctaLink: "/chat",
    icon: MessageCircle,
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
      className="relative h-[469px] sm:h-[492px] lg:h-[516px] flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 70%, #0d9488 100%)",
        WebkitBackgroundClip: "padding-box",
        MozBackgroundClip: "padding-box",
        backgroundClip: "padding-box",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background texture sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/grid.svg')",
          backgroundRepeat: "repeat",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Organic shape na base */}
      <div className="absolute bottom-0 left-0 right-0 h-[75px] sm:h-[90px] overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          style={{
            transform: "scaleY(-1)",
            WebkitTransform: "scaleY(-1)",
            MozTransform: "scaleY(-1)",
            msTransform: "scaleY(-1)",
          }}
        >
          <path
            d="M0,0 C150,80 350,80 600,60 C850,40 1050,80 1200,0 L1200,120 L0,120 Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      {/* Glow shapes decorativos */}
      <div
        className="absolute top-20 left-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl"
        style={{
          animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          WebkitAnimation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-[320px] h-[320px] bg-teal-400/10 rounded-full blur-3xl"
        style={{
          animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "1s",
          WebkitAnimation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          WebkitAnimationDelay: "1s",
        }}
      />

      <div
        className="relative z-50 w-full bg-emerald-900/85 border-b border-white/10"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <HeaderContent variant="hero" />
        </div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 flex-1 flex items-center max-w-7xl w-full mx-auto py-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center w-full">
          {/* Conteúdo esquerdo com carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white space-y-2 sm:space-y-3 max-w-xl"
            >
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-white shadow-lg bg-gradient-to-r ${slide.badgeColor}`}
              >
                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {slide.badge}
              </div>

              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold leading-tight mb-0.5">{slide.title}</h1>
                <h2
                  className="text-base sm:text-lg lg:text-xl font-bold leading-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {slide.subtitle}!
                </h2>
              </div>

              <p className="text-[10px] sm:text-xs text-emerald-100 leading-relaxed">{slide.description}</p>

              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-emerald-900 font-bold shadow-2xl shadow-teal-500/50 border-0 px-3 py-1.5 text-[10px] sm:text-xs rounded-lg hover:scale-105 transition-all duration-300"
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <AppLink href={slide.ctaLink}>{slide.cta}</AppLink>
              </Button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="hidden lg:flex justify-end shrink-0"
            >
              <div className="relative w-[120px] h-[160px]">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden"
                  style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <div className="absolute top-2 left-2 right-2">
                    <div
                      className={`text-3xl font-black bg-gradient-to-r ${slide.badgeColor} bg-clip-text text-transparent leading-none`}
                      style={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {slide.id}
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                    <div className="text-xs font-bold text-teal-900 leading-tight">{slide.badge}</div>
                    <div
                      className="text-[9px] font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                      style={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Betel 2025
                    </div>
                  </div>

                  <div className="absolute bottom-16 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30" />
                </div>

                <div className={`absolute inset-0 bg-gradient-to-r ${slide.badgeColor} opacity-20 blur-2xl -z-10`} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
          <button
            onClick={handlePrevSlide}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
            style={{
              WebkitTapHighlightColor: "transparent",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            aria-label="Slide anterior"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") handlePrevSlide()
            }}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          <div className="flex gap-1.5" role="tablist" aria-label="Slides do carousel">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-6 bg-gradient-to-r from-teal-400 to-teal-500 shadow-lg shadow-teal-500/50"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
                aria-label={`Ir para slide ${idx + 1}`}
                aria-current={idx === currentSlide ? "true" : "false"}
                role="tab"
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
            style={{
              WebkitTapHighlightColor: "transparent",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            aria-label="Próximo slide"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") handleNextSlide()
            }}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Sentinel para IntersectionObserver */}
      <div ref={sentinelRef} className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none" />
    </motion.section>
  )
}
