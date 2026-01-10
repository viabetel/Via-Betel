"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentPropsWithoutRef } from "react"

interface AppLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "prefetch"> {
  variant?: "nav" | "default"
  onClick?: () => void
}

/**
 * AppLink - Componente de link customizado para Via Betel
 *
 * - variant="nav": Desabilita prefetch (links de header/menu) para evitar "teleporte"
 * - variant="default": Mantém prefetch true (links internos de conteúdo)
 * - Usa Next.js Link (SPA) com feedback visual via TopLoadingBar e skeletons
 */
export function AppLink({ variant = "default", href, children, onClick, ...props }: AppLinkProps) {
  const router = useRouter()
  const prefetch = variant === "nav" ? false : true

  return (
    <Link href={href} prefetch={prefetch} onClick={onClick} {...props}>
      {children}
    </Link>
  )
}
