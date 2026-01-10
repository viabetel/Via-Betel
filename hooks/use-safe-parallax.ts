"use client"

import { useEffect, useState, useRef } from "react"
import { useScroll, useTransform, useSpring, type MotionValue } from "framer-motion"
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion"

export function useSafeParallax(offset = 12) {
  const [isDesktop, setIsDesktop] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  const smoothY = useSpring(rawY, { stiffness: 100, damping: 30 })

  const safeY: MotionValue<number> = useTransform(() => 0)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  return { ref, y: prefersReducedMotion || !isDesktop ? safeY : smoothY, isActive: !prefersReducedMotion && isDesktop }
}
