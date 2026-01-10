// Design System Via Betel - Tokens Centralizados
// =============================================
// Este arquivo contém TODOS os tokens de design extraídos da Home
// para garantir consistência visual em TODO o produto.

export const tokens = {
  // CORES - Sistema de Cores Via Betel
  colors: {
    // Emerald (cor principal da marca)
    emerald: {
      50: "#ecfdf5",
      100: "#d1fae5",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    // Teal (cor secundária)
    teal: {
      50: "#f0fdfa",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
    },
    // Amber (acento)
    amber: {
      50: "#fffbeb",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    // Neutros
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    white: "#ffffff",
    black: "#000000",
  },

  // GRADIENTES - Gradientes Padrão
  gradients: {
    primary: "from-emerald-600 via-emerald-700 to-teal-700",
    primaryHover: "from-emerald-700 via-emerald-800 to-teal-800",
    accent: "from-amber-500 to-amber-600",
    accentHover: "from-amber-600 to-amber-700",
    hero: "from-emerald-900 via-emerald-800 to-emerald-950",
    surface: "from-emerald-50 via-white to-teal-50",
    card: "from-emerald-50 via-teal-50 to-cyan-50",
  },

  // ESPAÇAMENTOS - Sistema de Espaçamento
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },

  // BORDER RADIUS - Arredondamento de Cantos
  radius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // SOMBRAS - Sistema de Sombras
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    emerald: "0 10px 30px -5px rgba(16, 185, 129, 0.3)",
    emeraldHover: "0 20px 40px -5px rgba(16, 185, 129, 0.5)",
  },

  // TIPOGRAFIA - Tamanhos de Fonte
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  // LINE HEIGHT
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // TRANSIÇÕES - Durações e Easing
  transitions: {
    fast: "150ms",
    base: "300ms",
    slow: "500ms",
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // BREAKPOINTS - Responsividade
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const

// Utilitário para criar classes Tailwind consistentes
export const tw = {
  // Card Premium (estilo da Home)
  card: {
    base: "rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-emerald-100 hover:border-emerald-300",
    hover: "group-hover:scale-[1.02] transition-transform duration-300",
    gradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
  },

  // Botões
  button: {
    primary:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300",
    secondary: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-300",
    accent:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg transition-all duration-300",
  },

  // Menus Expansivos (dropdown/accordion/drawer)
  menu: {
    container:
      "bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-xl shadow-2xl py-3 min-w-[220px] z-[9999] border-2 border-emerald-300/50 backdrop-blur-sm",
    item: "block px-4 py-2.5 text-emerald-900 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-sm transition-all font-medium rounded-md mx-2",
    separator: "border-t border-emerald-200 my-1",
  },

  // Chips/Badges
  chip: {
    base: "inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 shadow-lg",
    text: "text-sm font-medium text-emerald-900",
  },

  // Section Header
  sectionHeader: {
    title: "text-2xl lg:text-3xl text-neutral-900 font-semibold mb-3",
    subtitle: "text-base text-neutral-600 max-w-2xl text-pretty leading-normal",
  },

  // Input/Form
  input: {
    base: "w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all",
  },
} as const

export type Tokens = typeof tokens
export type TW = typeof tw

export const COLORS = {
  brand: {
    emerald: tokens.colors.emerald[600],
    teal: tokens.colors.teal[600],
    amber: tokens.colors.amber[600],
    gradient: "linear-gradient(to right, rgb(5, 150, 105), rgb(13, 148, 136))",
  },
  gradients: {
    primary: "linear-gradient(to right, rgb(5, 150, 105), rgb(13, 148, 136))",
    primaryHover: "linear-gradient(to right, rgb(4, 120, 87), rgb(15, 118, 110))",
    accent: "linear-gradient(to right, rgb(245, 158, 11), rgb(217, 119, 6))",
    hero: "linear-gradient(to right, rgb(6, 78, 59), rgb(4, 120, 87), rgb(6, 95, 70))",
  },
  neutral: tokens.colors.neutral,
  white: tokens.colors.white,
  black: tokens.colors.black,
} as const

export const SHADOWS = tokens.shadows
