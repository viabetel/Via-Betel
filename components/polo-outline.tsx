"use client"

import type { CSSProperties } from "react"

interface PoloOutlineProps {
  className?: string
  size?: number | string
  animate?: boolean
}

export function PoloOutline({ className, size = 400, animate = false }: PoloOutlineProps) {
  const pathLength = animate ? 2000 : undefined

  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: "auto" } as CSSProperties}
    >
      <style>
        {animate &&
          `
          @keyframes drawPath {
            to {
              stroke-dashoffset: 0;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-draw {
              animation: none !important;
              stroke-dasharray: none !important;
              stroke-dashoffset: 0 !important;
            }
          }
          .animate-draw {
            stroke-dasharray: ${pathLength};
            stroke-dashoffset: ${pathLength};
            animation: drawPath 1.2s ease-out forwards;
          }
        `}
      </style>

      {/* Silhueta externa (carroceria) */}
      <path
        d="M 210,320 
           Q 230,305 250,290 
           Q 245,310 245,335 
           L 250,290 
           Q 280,270 360,250 
           Q 390,225 420,200 
           L 560,190 
           Q 585,210 610,240 
           L 615,285 
           Q 610,305 590,320 
           L 280,340 
           Q 240,330 210,320 Z"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
      />

      {/* Vidros */}
      <path
        d="M 385,255 
           Q 410,235 435,215 
           L 545,210 
           Q 565,230 585,250 
           Q 580,265 560,275 
           L 420,280 
           Q 400,268 385,255 Z"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "0.3s" } : undefined}
      />

      {/* Linha do capô */}
      <path
        d="M 330,275 L 410,245"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "0.6s" } : undefined}
      />

      {/* Roda traseira */}
      <circle
        cx="350"
        cy="345"
        r="42"
        stroke="#FFFFFF"
        strokeWidth={4}
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "0.7s" } : undefined}
      />

      {/* Roda dianteira */}
      <circle
        cx="520"
        cy="335"
        r="48"
        stroke="#FFFFFF"
        strokeWidth={4}
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "0.8s" } : undefined}
      />

      {/* Arco roda traseira */}
      <path
        d="M 310,345 Q 350,325 390,340"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "0.9s" } : undefined}
      />

      {/* Arco roda dianteira */}
      <path
        d="M 470,330 Q 520,315 570,325"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={animate ? { animationDelay: "1.0s" } : undefined}
      />
    </svg>
  )
}
