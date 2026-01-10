"use client"

import { useEffect, useState } from "react"

export function useMotionDebug() {
  const [motionState, setMotionState] = useState<"auto" | "forced-on" | "forced-off">("auto")
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener("change", listener)

    const params = new URLSearchParams(window.location.search)
    const motionParam = params.get("motion")

    if (motionParam === "1") {
      setMotionState("forced-on")
    } else if (motionParam === "0") {
      setMotionState("forced-off")
    } else {
      setMotionState("auto")
    }

    return () => mediaQuery.removeEventListener("change", listener)
  }, []) // Removida dependência de searchParams

  const shouldDisableMotion = motionState === "forced-off" || (motionState === "auto" && prefersReduced)

  return {
    shouldDisableMotion,
    motionState,
    prefersReduced,
    isDebugMode: motionState !== "auto",
  }
}
