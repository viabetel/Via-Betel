"use client"
import { motion } from "framer-motion"
import type React from "react"
import { AppLink } from "@/components/app-link"

import { Instagram, Youtube, Mail, Clock, MapPin, Shield, HelpCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/viabetel/"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")

  const footerLinks = {
    "Para Alunos": [
      { name: "Buscar aulas", href: "/aluno" },
      { name: "Como funciona", href: "#how-it-works" },
      { name: "Categorias CNH", href: "#categorias" },
    ],
    Recursos: [
      { name: "Blog / Dicas", href: "#recursos" },
      { name: "Materiais de estudo", href: "#recursos" },
    ],
    "Legal e Contato": [
      { name: "Termos de uso", href: "#termos" },
      { name: "Política de privacidade", href: "#privacidade" },
      { name: "Trabalhe conosco", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: INSTAGRAM_URL },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@viabetel" },
  ]

  const governmentBadges = [
    {
      name: "DENATRAN",
      href: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/denatran",
      description: "Departamento Nacional de Trânsito",
      logo: "/images/emblema-denatran.jpg",
    },
    {
      name: "DETRAN-MG",
      href: "https://www.detran.mg.gov.br/",
      description: "Departamento de Trânsito de Minas Gerais",
      logo: "/images/emblema-detran-mg.jpg",
    },
    {
      name: "SENATRAN",
      href: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/senatran",
      description: "Secretaria Nacional de Trânsito",
      logo: "/images/emblema-senatran.jpg",
    },
    {
      name: "CONTRAN",
      href: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/conteudo-contran",
      description: "Conselho Nacional de Trânsito",
      logo: "/images/emblema-contran.jpg",
    },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="bg-neutral-900 border-t border-green-800/20 mt-16 sm:mt-20 md:mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16 max-w-7xl w-full">
        {/* Main Footer Content */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
          {/* Coluna 1 - Via Betel */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <Image
                  src="/images/viabetel-logo.png"
                  alt="Via Betel Logo"
                  width={180}
                  height={54}
                  className="h-9 w-auto"
                />
              </div>
              <p className="text-neutral-400 mb-4 leading-relaxed text-sm">Conectando alunos e instrutores.</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-neutral-400 text-sm">
                  <MapPin size={16} className="text-green-400 flex-shrink-0" />
                  <span>Juiz de Fora e região (DDD 32)</span>
                </div>
                <AppLink
                  href="mailto:contato@viabetel.com"
                  className="flex items-center space-x-2 text-neutral-400 hover:text-green-400 transition-colors text-sm"
                >
                  <Mail size={16} className="text-green-400 flex-shrink-0" />
                  <span>contato@viabetel.com</span>
                </AppLink>
                <AppLink
                  href="/suporte"
                  className="flex items-center space-x-2 text-neutral-400 hover:text-green-400 transition-colors text-sm"
                >
                  <HelpCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span>Central de Ajuda</span>
                </AppLink>
                <div className="flex items-center space-x-2 text-neutral-400 text-sm">
                  <Clock size={16} className="text-green-400 flex-shrink-0" />
                  <span>Seg-Sex: 8h às 18h</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colunas 2-5 - Links */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-amber-400 mb-3 text-sm">{category}</h4>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <AppLink
                          href={link.href}
                          className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-sm block"
                        >
                          {link.name}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coluna 6 - Social / Confiança */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Social Media */}
              <div>
                <h4 className="font-semibold text-amber-400 mb-3 text-sm">Redes Sociais</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-green-600 hover:text-white transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white/5 rounded-lg p-4 border border-green-800/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield size={18} className="text-green-400" />
                  <span className="text-sm font-semibold text-neutral-200">Segurança Garantida</span>
                </div>
                <p className="text-xs text-neutral-400">Pagamentos e dados protegidos</p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AppLink
                  href="/suporte"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <HelpCircle size={16} />
                    <span>Central de Ajuda</span>
                  </div>
                </AppLink>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="hidden sm:grid grid-cols-3 gap-3 sm:gap-6 lg:gap-10 pt-6 sm:pt-10 lg:pt-12 max-w-full mx-auto px-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { value: "Em expansão", label: "Na sua região" },
            { value: "Conectando", label: "Alunos e instrutores" },
            { value: "Qualidade", label: "Certificada" },
          ].map((stat, index) => (
            <div key={index} className="text-center min-w-0">
              <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-[var(--color-brand-accent-light)] to-[var(--color-brand-text-light)] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-xs lg:text-sm text-[var(--color-brand-text-muted)]/80 mt-0.5 lg:mt-2 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="hidden sm:block border-t border-green-800/20 pt-6 sm:pt-8 pb-4 sm:pb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-base sm:text-lg font-semibold text-neutral-200 mb-2">
              Receba dicas de direção e novidades
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 mb-4">
              Fique por dentro das melhores dicas e promoções da Via Betel
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 bg-white/5 border border-green-800/30 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-green-600 transition-colors min-h-[44px]"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-medium rounded-lg transition-colors text-sm min-h-[44px]"
              >
                Inscrever
              </button>
            </form>
          </div>
        </motion.div>

        {/* Mini CTAs */}
        <motion.div
          className="hidden sm:grid grid-cols-1 gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Aluno CTA */}
          <AppLink
            href="/aluno"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-lg transition-all duration-200 text-center group"
          >
            <p className="text-sm text-amber-100 mb-1">É aluno?</p>
            <p className="font-semibold group-hover:scale-105 inline-block transition-transform">Buscar aulas</p>
          </AppLink>
        </motion.div>

        {/* Government Badges */}
        <motion.div
          className="hidden sm:block border-t border-green-800/20 pt-6 sm:pt-8 pb-4 sm:pb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-amber-400 mb-2">Regulamentado e certificado por</h4>
            <p className="text-[10px] sm:text-xs text-neutral-500">Plataforma em conformidade com órgãos reguladores</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {governmentBadges.map((badge, index) => (
              <motion.a
                key={badge.name}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-neutral-800/50 hover:bg-neutral-800 border border-green-800/20 hover:border-amber-500/50 rounded-lg p-4 sm:p-6 transition-all duration-300 flex items-center justify-center min-w-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <Image
                    src={badge.logo || "/placeholder.svg"}
                    alt={`Logo ${badge.name}`}
                    width={80}
                    height={80}
                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-neutral-500">
              Via Betel opera em conformidade com a legislação brasileira de trânsito e normas do CONTRAN
            </p>
          </div>
        </motion.div>

        {/* Bottom Copyright Bar */}
        <motion.div
          className="pt-4 sm:pt-6 border-t border-green-800/20 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-xs sm:text-sm text-neutral-500 text-center md:text-left">
            <p>&copy; {currentYear} Via Betel. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-500">
            <AppLink href="#privacidade" className="hover:text-green-400 transition-colors">
              Privacidade
            </AppLink>
            <span>•</span>
            <AppLink href="#termos" className="hover:text-green-400 transition-colors">
              Termos
            </AppLink>
            <span>•</span>
            <AppLink href="#cookies" className="hover:text-green-400 transition-colors">
              Cookies
            </AppLink>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
