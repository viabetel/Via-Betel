"use client"

import { useState, useEffect, useCallback } from "react"

export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((query: string): boolean => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches
    }
    return false
  }, [])

  const [matches, setMatches] = useState<boolean>(() => getMatches(query))

  useEffect(() => {
    const media = window.matchMedia(query)
    const currentMatches = media.matches
    setMatches(currentMatches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)")
}
