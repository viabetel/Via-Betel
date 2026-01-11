"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { InstructorProfile } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Step1BasicInfo from "./steps/step1-basic-info"
import Step2Documents from "./steps/step2-documents"
import StatusAnalyzing from "./states/status-analyzing"
import StatusApproved from "./states/status-approved"
import StatusRejected from "./states/status-rejected"

export default function OnboardingClient({
  initialProfile,
}: {
  initialProfile: InstructorProfile | null
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [profile, setProfile] = useState(initialProfile)

  // Se não tem perfil ou está incompleto, mostrar wizard
  if (!profile || profile.status === "INCOMPLETO") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
            <div className="flex gap-2">
              <Badge variant={currentStep === 1 ? "default" : "secondary"}>Passo 1</Badge>
              <Badge variant={currentStep === 2 ? "default" : "secondary"}>Passo 2</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              <div className={`flex-1 h-1 rounded-full ${currentStep >= 1 ? "bg-emerald-600" : "bg-gray-200"}`} />
              <div className={`flex-1 h-1 rounded-full ${currentStep >= 2 ? "bg-emerald-600" : "bg-gray-200"}`} />
            </div>
          </div>

          {/* Conteúdo do Step */}
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Step1BasicInfo
                  profile={profile}
                  onContinue={(updatedProfile) => {
                    setProfile(updatedProfile)
                    setCurrentStep(2)
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Step2Documents
                  profile={profile}
                  onBack={() => setCurrentStep(1)}
                  onSubmit={(updatedProfile) => {
                    setProfile(updatedProfile)
                    router.refresh()
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Se está em análise
  if (profile.status === "EM_ANALISE") {
    return <StatusAnalyzing profile={profile} />
  }

  // Se foi aprovado
  if (profile.status === "APROVADO") {
    return <StatusApproved profile={profile} />
  }

  // Se foi reprovado
  if (profile.status === "REPROVADO") {
    return <StatusRejected profile={profile} onRetry={() => setCurrentStep(2)} />
  }

  return null
}
