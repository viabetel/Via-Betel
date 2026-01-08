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
  title: "Via Betel — Conectando instrutores e alunos",
  description:
    "Sua jornada para a habilitação começa aqui. Encontre instrutores qualificados ou conecte-se com alunos.",
  generator: "v0.app",
  alternates: {
    canonical: "https://viabetel.com/",
  },
  openGraph: {
    siteName: "Via Betel",
    title: "Conectando instrutores e alunos | Via Betel",
    description:
      "Sua jornada para a habilitação começa aqui. Encontre instrutores qualificados ou conecte-se com alunos.",
    type: "website",
    url: "https://viabetel.com/",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conectando instrutores e alunos | Via Betel",
    description: "Sua jornada para a habilitação começa aqui.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden antialiased">{children}</body>
    </html>
  )
}
