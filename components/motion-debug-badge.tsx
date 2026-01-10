"use client"

import { useMotionDebug } from "@/hooks/use-motion-debug"
import { useEffect, useState } from "react"

export function MotionDebugBadge() {
  const { shouldDisableMotion, motionState, prefersReduced, isDebugMode } = useMotionDebug()
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(
      process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" && window.location.hostname.includes("v0.app")),
    )
  }, [])

  if (!isDev && !isDebugMode) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none">
      <div
        className={`px-3 py-2 rounded-lg shadow-2xl text-xs font-mono font-bold backdrop-blur-md border-2 ${
          shouldDisableMotion
            ? "bg-red-500/90 text-white border-red-600"
            : "bg-emerald-500/90 text-white border-emerald-600"
        }`}
      >
        {motionState === "forced-on" && "MOTION ON (forced)"}
        {motionState === "forced-off" && "MOTION OFF (forced)"}
        {motionState === "auto" && shouldDisableMotion && "MOTION OFF (reduced)"}
        {motionState === "auto" && !shouldDisableMotion && "MOTION ON (auto)"}
      </div>
      {prefersReduced && motionState === "auto" && (
        <div className="mt-1 px-2 py-1 bg-amber-500/90 text-white rounded text-[10px] text-center border border-amber-600">
          System prefers reduced motion
        </div>
      )}
    </div>
  )
}
