"use client"

import { AppLink } from "@/components/app-link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  const items = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    if (segments.length === 0) {
      return []
    }

    // Always add Home
    breadcrumbs.push({ label: "Home", href: "/" })

    // /instrutores
    if (segments[0] === "instrutores") {
      breadcrumbs.push({ label: "Instrutores", href: "/instrutores" })

      // /instrutores/[slug]
      if (segments[1]) {
        const instructorName = segments[1]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        breadcrumbs.push({ label: instructorName, href: `/instrutores/${segments[1]}` })
      }
    }

    // /chat
    if (segments[0] === "chat") {
      breadcrumbs.push({ label: "Chat", href: "/chat" })
      if (segments[1]) {
        breadcrumbs.push({ label: "Conversa", href: `/chat/${segments[1]}` })
      }
    }

    // /minhas-solicitacoes
    if (segments[0] === "minhas-solicitacoes") {
      breadcrumbs.push({ label: "Minhas Solicitações", href: "/minhas-solicitacoes" })
      if (segments[1]) {
        breadcrumbs.push({ label: "Detalhes", href: `/minhas-solicitacoes/${segments[1]}` })
      }
    }

    return breadcrumbs
  }, [pathname])

  if (items.length <= 1) {
    return null
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-2 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.href} className="flex items-center gap-2">
                {index === 0 ? (
                  <AppLink
                    href={item.href}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </AppLink>
                ) : isLast ? (
                  <span className="text-gray-700 font-medium truncate max-w-[200px]">{item.label}</span>
                ) : (
                  <AppLink
                    href={item.href}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors truncate max-w-[200px]"
                  >
                    {item.label}
                  </AppLink>
                )}
                {!isLast && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
