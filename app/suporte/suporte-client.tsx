"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Mail, HelpCircle, ChevronDown, Search, Instagram, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { HeaderContent } from "@/components/header-content"
import { Footer } from "@/components/footer"

const faqs = [
  {
    category: "Alunos",
    questions: [
      {
        q: "Como encontro um instrutor na minha região?",
        a: "Use nossa busca no Marketplace filtrando por cidade, categoria CNH e avaliação. Você pode ver o perfil completo de cada instrutor antes de entrar em contato.",
      },
      {
        q: "Como funciona o agendamento de aulas?",
        a: "Após encontrar um instrutor, você pode enviar uma solicitação através do perfil dele. O instrutor receberá sua mensagem e entrará em contato para combinar horários.",
      },
      {
        q: "Posso ter aulas com mais de um instrutor?",
        a: "Sim! Você pode conversar com quantos instrutores quiser e escolher o que melhor se adequa ao seu perfil e horários.",
      },
      {
        q: "Como funciona o pagamento?",
        a: "O pagamento é combinado diretamente com o instrutor. Via Betel é apenas a plataforma de conexão, você negocia valores e formas de pagamento diretamente.",
      },
    ],
  },
  {
    category: "Instrutores",
    questions: [
      {
        q: "Como me cadastro como instrutor?",
        a: 'Acesse a página "Para Instrutores", preencha o formulário com seus dados e certificações. Nossa equipe analisará seu perfil em até 48h.',
      },
      {
        q: "Quanto custa anunciar na Via Betel?",
        a: "O cadastro básico é GRATUITO. Você recebe solicitações de alunos sem nenhum custo inicial. Temos planos premium com destaque no marketplace.",
      },
      {
        q: "Como recebo solicitações de alunos?",
        a: 'Alunos interessados enviam mensagens através do seu perfil. Você recebe notificações por email e pode gerenciar tudo na área "Minhas Solicitações".',
      },
      {
        q: "Posso atualizar minha disponibilidade?",
        a: 'Sim! Acesse "Minha Conta > Disponibilidade" e atualize seus horários sempre que precisar. Isso ajuda os alunos a encontrarem o melhor horário.',
      },
    ],
  },
  {
    category: "Geral",
    questions: [
      {
        q: "Via Betel é uma auto escola?",
        a: "Não, somos uma plataforma que CONECTA alunos e instrutores credenciados. Facilitamos o contato direto sem intermediários.",
      },
      {
        q: "Os instrutores são certificados?",
        a: "Sim! Todos os instrutores passam por verificação de documentação (CNH, certificados do DETRAN) antes de serem aprovados na plataforma.",
      },
      {
        q: "Atende em quais cidades?",
        a: "Iniciamos em Juiz de Fora e região, mas estamos expandindo para todo o estado de Minas Gerais. Use a busca para ver instrutores na sua cidade.",
      },
    ],
  },
]

export default function SuporteClient() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "suporte",
          dados: formData,
        }),
      })

      setIsSuccess(true)
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" })
    } catch (error) {
      console.error("[v0] Erro ao enviar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50">
      <HeaderContent />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Estamos aqui para ajudar! Encontre respostas rápidas ou entre em contato conosco.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
            <Link href="/chat" className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Chat Protegido</h3>
                <p className="text-sm text-muted-foreground">Converse diretamente com instrutores de forma segura</p>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
            <a
              href="https://instagram.com/viabetel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Instagram</h3>
                <p className="text-sm text-muted-foreground">Siga @viabetel para novidades e dicas</p>
              </div>
            </a>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
            <a href="mailto:contato@viabetel.com" className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">contato@viabetel.com</p>
              </div>
            </a>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Perguntas Frequentes</h2>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar dúvidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-8">
            {filteredFaqs.map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-bold mb-4 text-emerald-700">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((faq, idx) => {
                    const key = `${category.category}-${idx}`
                    const isOpen = openFaq === key

                    return (
                      <Card key={key} className="overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : key)}
                          className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium">{faq.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-muted-foreground"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma resposta encontrada para "{searchTerm}". Tente outro termo ou entre em contato conosco abaixo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="max-w-3xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Não encontrou sua resposta?</h2>

          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Mensagem enviada!</h3>
              <p className="text-muted-foreground mb-4">Retornaremos em até 24 horas úteis no email informado.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Enviar outra mensagem
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <Input
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assunto</label>
                <Input
                  required
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  placeholder="Resumo da sua dúvida"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <Textarea
                  required
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  placeholder="Descreva sua dúvida com detalhes..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar mensagem
                  </>
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  )
}
