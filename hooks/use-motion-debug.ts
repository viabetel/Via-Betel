"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export function useMotionDebug() {
  const searchParams = useSearchParams()
  const [motionState, setMotionState] = useState<"auto" | "forced-on" | "forced-off">("auto")
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener("change", listener)

    // Check query params
    const motionParam = searchParams?.get("motion")
    if (motionParam === "1") {
      setMotionState("forced-on")
    } else if (motionParam === "0") {
      setMotionState("forced-off")
    } else {
      setMotionState("auto")
    }

    return () => mediaQuery.removeEventListener("change", listener)
  }, [searchParams])

  const shouldDisableMotion = motionState === "forced-off" || (motionState === "auto" && prefersReduced)

  return {
    shouldDisableMotion,
    motionState,
    prefersReduced,
    isDebugMode: motionState !== "auto",
  }
}
