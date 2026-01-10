"use client"

import { Shield, X } from "lucide-react"
import { useState } from "react"

export function SafetyTipBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-2.5 flex items-center gap-2.5">
      <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
        <Shield className="w-4 h-4 text-white" />
      </div>
      <p className="flex-1 text-xs text-white">
        <strong>Juntos criamos um ambiente mais seguro.</strong>{" "}
        <span className="opacity-90">Use o chat Via Betel para negociar.</span>
      </p>
      <button onClick={() => setIsVisible(false)} className="p-1 text-white/70 hover:text-white flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
