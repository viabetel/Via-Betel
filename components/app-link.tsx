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
 * - prefetch ATIVADO por padrão (feedback imediato, navegação suave)
 * - hard={true}: Força navegação HARD com window.location (casos específicos apenas)
 * - hard={false}: Usa Next.js Link com prefetch ativo (padrão recomendado)
 *
 * Padrão: hard=false + prefetch=true (navegação SPA otimizada com feedback)
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
      <Link href={href} prefetch={true} onClick={handleClick} {...props}>
        {children}
      </Link>
    </>
  )
}

export default AppLink
