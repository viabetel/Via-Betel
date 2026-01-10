"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ComponentPropsWithoutRef } from "react"

interface AppLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "prefetch"> {
  hardNavigation?: boolean
  onClick?: () => void
}

/**
 * AppLink - Componente de link customizado para Via Betel
 *
 * - Por padrão, DESABILITA prefetch em todos os links
 * - Se hardNavigation={true}, usa window.location.href para forçar reload completo
 * - Exibe overlay de loading ao clicar (UX fluida)
 */
export function AppLink({ hardNavigation = false, href, children, onClick, ...props }: AppLinkProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    onClick?.()

    if (hardNavigation && typeof href === "string") {
      e.preventDefault()
      setIsNavigating(true)

      // Show loading overlay briefly before navigation
      setTimeout(() => {
        window.location.href = href
      }, 100)
    }
  }

  // Hard navigation mode: render as <a> tag
  if (hardNavigation && typeof href === "string") {
    return (
      <>
        <a href={href} onClick={handleClick} {...(props as any)}>
          {children}
        </a>
        {isNavigating && (
          <div className="fixed inset-0 z-[99999] bg-emerald-900/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-emerald-900">Carregando...</p>
            </div>
          </div>
        )}
      </>
    )
  }

  // Default: use Next.js Link with prefetch disabled
  return (
    <Link href={href} prefetch={false} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
