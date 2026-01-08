import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://viabetel.com"),
  title: {
    default: "Via Betel - Auto Escola Digital | Instrutores de Direção Qualificados",
    template: "%s | Via Betel",
  },
  description:
    "Encontre instrutores de direção qualificados perto de você. Via Betel conecta alunos e instrutores para aulas práticas de direção em todas as categorias (A, B, C, D, E). Agende suas aulas hoje!",
  keywords: [
    "auto escola",
    "aulas de direção",
    "instrutores de direção",
    "carteira de motorista",
    "CNH",
    "habilitação",
    "primeira habilitação",
    "aulas práticas",
    "direção defensiva",
    "categoria A",
    "categoria B",
    "categoria C",
    "categoria D",
    "categoria E",
    "instrutor particular",
    "aulas de carro",
    "aulas de moto",
    "Via Betel",
  ],
  authors: [{ name: "Via Betel" }],
  creator: "Via Betel",
  publisher: "Via Betel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.app",
  applicationName: "Via Betel",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.jpg",
  },
  alternates: {
    canonical: "https://viabetel.com/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://viabetel.com/",
    siteName: "Via Betel",
    title: "Via Betel - Auto Escola Digital | Instrutores de Direção Qualificados",
    description:
      "Encontre instrutores de direção qualificados perto de você. Conectamos alunos e instrutores para aulas práticas em todas as categorias.",
    images: [
      {
        url: "/images/viabetel-logo.png",
        width: 1200,
        height: 630,
        alt: "Via Betel - Auto Escola Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Via Betel - Auto Escola Digital | Instrutores de Direção",
    description: "Encontre instrutores qualificados perto de você. Agende suas aulas de direção hoje!",
    images: ["/images/viabetel-logo.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden antialiased">{children}</body>
    </html>
  )
}
