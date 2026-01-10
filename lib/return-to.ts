/**
 * Utilitários para gerenciar redirecionamento pós-login com preservação de contexto
 * Segurança: apenas caminhos internos (mesma origem) são permitidos
 */

const RETURN_TO_KEY = "via_betel_return_to"
const MARKETPLACE_STATE_KEY = "via_betel_marketplace_state"
const SCROLL_POSITION_KEY = "via_betel_scroll_position"

/**
 * Valida se uma URL é segura (mesma origem, sem open-redirect)
 */
export function isValidReturnTo(returnTo: string, currentOrigin: string): boolean {
  if (!returnTo) return false

  try {
    // Se começa com /, é caminho relativo seguro
    if (returnTo.startsWith("/")) {
      // Bloquear // (protocol-relative URLs)
      if (returnTo.startsWith("//")) return false
      return true
    }

    // Se é URL completa, verificar origem
    const url = new URL(returnTo)
    const currentUrl = new URL(currentOrigin)

    // Permitir apenas mesma origem
    return url.origin === currentUrl.origin
  } catch {
    return false
  }
}

/**
 * Codifica returnTo para uso em query params
 */
export function encodeReturnTo(path: string): string {
  return encodeURIComponent(path)
}

/**
 * Decodifica returnTo de query params
 */
export function decodeReturnTo(encoded: string): string {
  try {
    return decodeURIComponent(encoded)
  } catch {
    return "/"
  }
}

/**
 * Salva a URL atual para retorno posterior
 */
export function saveReturnTo(currentPath: string): void {
  if (typeof window === "undefined") return

  try {
    // Salvar em localStorage como fallback
    localStorage.setItem(RETURN_TO_KEY, currentPath)
  } catch (error) {
    console.warn("[v0] Erro ao salvar returnTo:", error)
  }
}

/**
 * Recupera returnTo salvo
 */
export function getReturnTo(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(RETURN_TO_KEY)
  } catch {
    return null
  }
}

/**
 * Remove returnTo salvo após uso
 */
export function clearReturnTo(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(RETURN_TO_KEY)
  } catch {
    // Silent fail
  }
}

/**
 * Salva estado do marketplace (filtros, ordenação, paginação, viewMode)
 */
export interface MarketplaceState {
  searchText?: string
  selectedCategory?: string
  sortBy?: string
  maxPrice?: number
  minRating?: number
  onlyJF?: boolean
  selectedSpecialties?: string[]
  page?: number
  viewMode?: "grid" | "list"
  scrollY?: number
}

export function saveMarketplaceState(state: MarketplaceState): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(MARKETPLACE_STATE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn("[v0] Erro ao salvar estado do marketplace:", error)
  }
}

export function getMarketplaceState(): MarketplaceState | null {
  if (typeof window === "undefined") return null

  try {
    const saved = localStorage.getItem(MARKETPLACE_STATE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function clearMarketplaceState(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(MARKETPLACE_STATE_KEY)
  } catch {
    // Silent fail
  }
}

/**
 * Salva posição de scroll
 */
export function saveScrollPosition(path: string, scrollY: number): void {
  if (typeof window === "undefined") return

  try {
    const positions = JSON.parse(sessionStorage.getItem(SCROLL_POSITION_KEY) || "{}")
    positions[path] = scrollY
    sessionStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(positions))
  } catch {
    // Silent fail
  }
}

/**
 * Recupera posição de scroll
 */
export function getScrollPosition(path: string): number | null {
  if (typeof window === "undefined") return null

  try {
    const positions = JSON.parse(sessionStorage.getItem(SCROLL_POSITION_KEY) || "{}")
    return positions[path] ?? null
  } catch {
    return null
  }
}

/**
 * Constrói URL de login com returnTo
 */
export function buildLoginUrl(currentPath: string, queryParams?: URLSearchParams): string {
  const params = new URLSearchParams()
  params.set("returnTo", encodeReturnTo(currentPath))

  // Preservar query params adicionais
  if (queryParams) {
    queryParams.forEach((value, key) => {
      if (key !== "returnTo") {
        params.set(key, value)
      }
    })
  }

  return `/auth/login?${params.toString()}`
}

/**
 * Resolve URL final de redirecionamento após login
 */
export function resolveReturnTo(queryReturnTo: string | null, origin: string, defaultPath = "/"): string {
  // 1. Tentar query param
  if (queryReturnTo && isValidReturnTo(queryReturnTo, origin)) {
    return queryReturnTo
  }

  // 2. Tentar localStorage
  const savedReturnTo = getReturnTo()
  if (savedReturnTo && isValidReturnTo(savedReturnTo, origin)) {
    clearReturnTo() // Limpar após uso
    return savedReturnTo
  }

  // 3. Fallback para default
  return defaultPath
}
