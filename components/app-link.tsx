"use client"

import type React from "react"

import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

interface AppLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "prefetch"> {
  hard?: boolean
  onClick?: () => void
}

/**
 * AppLink - Componente de link ÚNICO para Via Betel
 *
 * ⚠️ IMPORTANTE: NÃO use <Link> diretamente de next/link.
 * ⚠️ SEMPRE use este componente AppLink.
 *
 * - prefetch SEMPRE false (ZERO pré-carregamento)
 * - hard={true}: Faz navegação HARD com window.location (SEM overlay)
 * - hard={false}: Usa Next.js Link (SPA) mas SEM prefetch
 *
 * Padrão: hard=false (navegação SPA sem prefetch)
 * Para header/menus principais: hard=true (navegação HARD tradicional)
 */
export function AppLink({ hard = false, href, children, onClick, ...props }: AppLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick()

    if (hard) {
      e.preventDefault()

      // Salvar estado atual em localStorage (marketplace filters, chat thread, scroll position)
      const currentState = {
        scrollY: window.scrollY,
        timestamp: Date.now(),
        from: window.location.pathname,
      }
      localStorage.setItem("viabetel_nav_state", JSON.stringify(currentState))

      // Navegação imediata sem overlay
      window.location.assign(href as string)
    }
  }

  return (
    <>
      <Link href={href} prefetch={false} onClick={handleClick} {...props}>
        {children}
      </Link>
    </>
  )
}

export default AppLink
