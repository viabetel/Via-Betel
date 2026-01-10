"use client"

import { X, Star, MapPin, Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BadgeChip } from "@/components/ui/badge-chip"
import { AppLink } from "@/components/app-link"
import { motion, AnimatePresence } from "framer-motion"
import { SHADOWS } from "@/lib/ui/tokens"
import type { Thread } from "@/lib/chat/chat-store"
import { instructors } from "@/data/instructors-data"

interface ChatProfileDrawerProps {
  open: boolean
  onClose: () => void
  thread: Thread
}

export function ChatProfileDrawer({ open, onClose, thread }: ChatProfileDrawerProps) {
  // Buscar dados do instrutor (mock)
  const instructor = instructors.find((i) => i.id === thread.otherUserId)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 overflow-y-auto"
            style={{ boxShadow: SHADOWS.xl }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-gray-900">Perfil</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Avatar e nome */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto mb-3">
                  {thread.otherUserAvatar ? (
                    <img
                      src={thread.otherUserAvatar || "/placeholder.svg"}
                      alt={thread.otherUserName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-3xl">
                      {thread.otherUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{thread.otherUserName}</h4>
                <div className="flex justify-center mt-2">
                  <BadgeChip variant={thread.otherUserRole === "INSTRUCTOR" ? "primary" : "success"}>
                    {thread.otherUserRole === "INSTRUCTOR"
                      ? "Instrutor"
                      : thread.otherUserRole === "SUPPORT"
                        ? "Suporte"
                        : "Aluno"}
                  </BadgeChip>
                </div>
              </div>

              {/* Informações do instrutor (se existir) */}
              {instructor && (
                <>
                  <div className="space-y-3">
                    {/* Avaliação */}
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-gray-900">{instructor.rating}</span>
                      <span className="text-gray-600">• {instructor.studentsApproved} alunos aprovados</span>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {instructor.location}
                    </div>

                    {/* Experiência */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      {instructor.experience}
                    </div>
                  </div>

                  {/* Especialidades */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Especialidades</h5>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((spec) => (
                        <BadgeChip key={spec} variant="neutral">
                          {spec}
                        </BadgeChip>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  {instructor.bio && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Sobre</h5>
                      <p className="text-sm text-gray-600">{instructor.bio}</p>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="space-y-2 pt-4 border-t">
                    <AppLink href={`/instrutores/${instructor.id}`} className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver perfil completo
                      </Button>
                    </AppLink>

                    <AppLink href={`/orcamento?instrutor=${instructor.id}`} className="block">
                      <Button className="w-full text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                        Pedir orçamento
                      </Button>
                    </AppLink>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
