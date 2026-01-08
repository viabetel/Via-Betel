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
    default: "Via Betel - Auto Escola Digital | Instrutores de Direção Qualificados em MG",
    template: "%s | Via Betel Auto Escola",
  },
  description:
    "Encontre instrutores de direção qualificados perto de você em Minas Gerais. Via Betel conecta alunos e instrutores certificados para aulas práticas de direção em todas as categorias (A, B, C, D, E). Agende suas aulas hoje e conquiste sua CNH com segurança!",
  keywords: [
    "auto escola",
    "auto escola digital",
    "auto escola online",
    "aulas de direção",
    "aulas de carro",
    "aulas de moto",
    "instrutor de direção",
    "instrutores certificados",
    "instrutor particular",
    "professor de direção",
    "carteira de motorista",
    "CNH",
    "habilitação",
    "primeira habilitação",
    "tirar CNH",
    "tirar carteira de motorista",
    "renovar CNH",
    "aulas práticas",
    "aulas práticas de direção",
    "direção defensiva",
    "direção segura",
    "curso de direção",
    "aprender a dirigir",
    "como tirar CNH",
    "categoria A",
    "categoria B",
    "categoria C",
    "categoria D",
    "categoria E",
    "CNH categoria A",
    "CNH categoria B",
    "habilitação categoria A",
    "habilitação categoria B",
    "aula de moto",
    "aula de carro manual",
    "aula de carro automático",
    "Via Betel",
    "auto escola Minas Gerais",
    "auto escola MG",
    "auto escola Belo Horizonte",
    "auto escola Contagem",
    "instrutor Belo Horizonte",
    "instrutor Contagem",
    "aulas de direção BH",
    "aulas de direção Minas Gerais",
    "plataforma auto escola",
    "app auto escola",
    "melhor auto escola",
    "auto escola perto de mim",
    "instrutor perto de mim",
    "agendar aula de direção",
    "marcar aula prática",
    "preço aula de direção",
    "valor aula particular",
    "DETRAN MG",
    "DENATRAN",
    "código de trânsito",
    "legislação de trânsito",
    "segurança viária",
    "educação no trânsito",
    "mobilidade urbana",
    "trânsito seguro",
  ],
  authors: [{ name: "Via Betel Auto Escola Digital" }],
  creator: "Via Betel",
  publisher: "Via Betel Auto Escola Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "Next.js",
  applicationName: "Via Betel Auto Escola",
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
    siteName: "Via Betel Auto Escola Digital",
    title: "Via Betel - Instrutores de Direção Qualificados | Auto Escola Digital em MG",
    description:
      "Encontre os melhores instrutores de direção certificados perto de você. Conectamos alunos e professores para aulas práticas em todas as categorias. Conquiste sua CNH com segurança na Via Betel!",
    images: [
      {
        url: "/images/viabetel-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Via Betel - Auto Escola Digital | Instrutores Certificados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Via Betel - Instrutores de Direção Qualificados | Auto Escola Digital",
    description:
      "Encontre instrutores certificados perto de você. Agende suas aulas de direção hoje e tire sua CNH com segurança!",
    images: ["/images/viabetel-og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  other: {
    "geo.region": "BR-MG",
    "geo.placename": "Minas Gerais",
    "og:locale:alternate": "pt_BR",
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
