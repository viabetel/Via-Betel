"use client"
import { motion } from "framer-motion"
import type React from "react"
import Link from "next/link"
import { analytics } from "@/lib/analytics"

import { Instagram, Youtube, Phone, Mail, Clock, MapPin, Shield, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/viabetel" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@viabetel" },
    { name: "TikTok", icon: MessageCircle, href: "https://tiktok.com/@viabetel" },
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

  const handleWhatsAppClick = () => {
    analytics.clickWhatsApp("footer")
  }

  return (
    <footer className="bg-neutral-900 border-t border-green-800/20 mt-24">
      <div className="container-custom py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
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
                <a
                  href="https://wa.me/5532988093506"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-neutral-400 hover:text-green-400 transition-colors text-sm group"
                  onClick={handleWhatsAppClick}
                >
                  <Phone
                    size={16}
                    className="text-green-400 group-hover:scale-110 transition-transform flex-shrink-0"
                  />
                  <span>(32) 98809-3506</span>
                </a>
                <a
                  href="mailto:contato@viabetel.com"
                  className="flex items-center space-x-2 text-neutral-400 hover:text-green-400 transition-colors text-sm"
                >
                  <Mail size={16} className="text-green-400 flex-shrink-0" />
                  <span>contato@viabetel.com</span>
                </a>
                <div className="flex items-center space-x-2 text-neutral-400 text-sm">
                  <Clock size={16} className="text-green-400 flex-shrink-0" />
                  <span>Seg-Sex: 8h às 18h</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colunas 2-5 - Links */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
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
                        <a
                          href={link.href}
                          className="text-neutral-400 hover:text-green-400 transition-colors duration-200 text-sm block"
                        >
                          {link.name}
                        </a>
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

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/5532988093506"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Phone size={16} />
                  <span>Fale no WhatsApp</span>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="border-t border-green-800/20 pt-8 pb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg font-semibold text-neutral-200 mb-2">Receba dicas de direção e novidades</h4>
            <p className="text-sm text-neutral-400 mb-4">
              Fique por dentro das melhores dicas e promoções da Via Betel
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-green-800/30 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-green-600 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-medium rounded-lg transition-colors text-sm"
              >
                Inscrever
              </button>
            </form>
          </div>
        </motion.div>

        {/* Mini CTAs */}
        <motion.div
          className="grid grid-cols-1 gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Aluno CTA */}
          <Link
            href="/aluno"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 px-6 rounded-lg transition-all duration-200 text-center group"
          >
            <p className="text-sm text-amber-100 mb-1">É aluno?</p>
            <p className="font-semibold group-hover:scale-105 inline-block transition-transform">Buscar aulas</p>
          </Link>
        </motion.div>

        <motion.div
          className="border-t border-green-800/20 pt-8 pb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h4 className="text-sm font-semibold text-amber-400 mb-2">Regulamentado e certificado por</h4>
            <p className="text-xs text-neutral-500">Plataforma em conformidade com órgãos reguladores</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {governmentBadges.map((badge, index) => (
              <motion.a
                key={badge.name}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 hover:bg-white/10 border border-green-800/20 hover:border-amber-500/50 rounded-lg p-4 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <Image
                      src={badge.logo || "/placeholder.svg"}
                      alt={`Logo ${badge.name}`}
                      width={64}
                      height={64}
                      className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-neutral-200 text-sm group-hover:text-amber-400 transition-colors">
                      {badge.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">{badge.description}</p>
                  </div>
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
          className="pt-6 border-t border-green-800/20 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-neutral-500 text-center md:text-left">
            <p>&copy; {currentYear} Via Betel. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
            <Link href="#privacidade" className="hover:text-green-400 transition-colors">
              Privacidade
            </Link>
            <span>•</span>
            <Link href="#termos" className="hover:text-green-400 transition-colors">
              Termos
            </Link>
            <span>•</span>
            <Link href="#cookies" className="hover:text-green-400 transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
