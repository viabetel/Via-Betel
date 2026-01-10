"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import Link from "next/link"

export default function OrcamentoClient() {
  const [formData, setFormData] = useState({
    city: "",
    neighborhood: "",
    category: "",
    availability1: "",
    availability2: "",
    availability3: "",
    objective: "",
    notes: "",
    studentName: "",
    studentPhone: "", // Renomeado de studentWhatsApp para studentPhone
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/quote/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        alert("Erro ao enviar solicitação. Tente novamente.")
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar orçamento:", error)
      alert("Erro ao enviar solicitação.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Orçamento Enviado!</h2>
          <p className="text-gray-600 mb-6">
            Recebemos sua solicitação. Em breve, instrutores qualificados receberão seu pedido e a Via Betel entrará em
            contato com as melhores propostas.
          </p>
          <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
            <Link href="/">Voltar à Home</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solicitar Orçamento</h1>
          <p className="text-gray-600 mb-8">
            Preencha as informações abaixo. A Via Betel conectará você aos melhores instrutores da sua região.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder="Juiz de Fora"
              />
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro (opcional)</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder="Centro"
              />
            </div>

            {/* Categoria CNH */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria CNH desejada *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="">Selecione</option>
                <option value="A">Categoria A (Motos)</option>
                <option value="B">Categoria B (Carros)</option>
                <option value="AB">Categoria AB</option>
                <option value="C">Categoria C (Caminhões)</option>
                <option value="D">Categoria D (Ônibus)</option>
                <option value="E">Categoria E (Carretas)</option>
              </select>
            </div>

            {/* Disponibilidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Disponibilidade (1ª opção) *</label>
              <input
                type="text"
                required
                value={formData.availability1}
                onChange={(e) => setFormData({ ...formData, availability1: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder="Segunda 08:00-12:00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Disponibilidade (2ª opção - opcional)
              </label>
              <input
                type="text"
                value={formData.availability2}
                onChange={(e) => setFormData({ ...formData, availability2: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder="Quarta 14:00-18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Disponibilidade (3ª opção - opcional)
              </label>
              <input
                type="text"
                value={formData.availability3}
                onChange={(e) => setFormData({ ...formData, availability3: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                placeholder="Sexta 10:00-12:00"
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Objetivo (opcional)</label>
              <select
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="">Selecione</option>
                <option value="Primeira Habilitação">Primeira Habilitação</option>
                <option value="Baliza">Baliza</option>
                <option value="Prova Prática">Prova Prática</option>
                <option value="Medo de Dirigir">Medo de Dirigir</option>
                <option value="Reciclagem">Reciclagem</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Observações (opcional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                placeholder="Descreva suas necessidades ou preferências..."
              />
            </div>

            {/* Informações de contato (opcional) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seus dados (opcional para contato direto)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                    placeholder="(32) 98888-8888"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
              <h4 className="font-bold text-emerald-900 mb-2">Como funciona</h4>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Você envia sua solicitação</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>A Via Betel notifica instrutores qualificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Você recebe propostas filtradas pela Via Betel</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Seu contato NÃO é exposto aos instrutores automaticamente</span>
                </li>
              </ul>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Solicitar Orçamento"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
