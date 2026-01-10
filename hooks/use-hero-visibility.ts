"use client"

import type React from "react"

import { useEffect, useState } from "react"

/**
 * Hook que detecta quando o usuário está visualizando o Hero.
 * Usa IntersectionObserver para monitorar um sentinel no final do Hero.
 *
 * @returns isInHero - true se o usuário ainda está dentro do hero, false caso contrário
 */
export function useHeroVisibility(heroEndRef: React.RefObject<HTMLElement>) {
  const [isInHero, setIsInHero] = useState(true)

  useEffect(() => {
    const sentinel = heroEndRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Se o sentinel está visível (entrando na viewport), ainda estamos no hero
          // Se o sentinel saiu da viewport (scrollou além dele), saímos do hero
          setIsInHero(entry.isIntersecting)
        })
      },
      {
        threshold: 0,
        rootMargin: "-100px 0px 0px 0px", // Trigger 100px antes do sentinel
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [heroEndRef])

  return { isInHero }
}
