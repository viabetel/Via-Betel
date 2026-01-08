"use client"

import { useState } from "react"
import { Check, Calendar, Car, Award, Users, GraduationCap, Building2, BookOpen, FileCheck, Wallet } from "lucide-react"

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<"aluno" | "instrutor" | "autoescola">("aluno")

  const profileSteps = {
    aluno: [
      {
        icon: Users,
        title: "Escolha seu Instrutor",
        description:
          "Navegue por nosso catálogo de instrutores certificados e escolha aquele que melhor se encaixa no seu perfil e região.",
        color: "emerald" as const,
      },
      {
        icon: Calendar,
        title: "Agende suas Aulas",
        description:
          "Escolha os horários mais convenientes para você. Oferecemos flexibilidade total com turmas personalizadas.",
        color: "amber" as const,
      },
      {
        icon: Car,
        title: "Aprenda na Prática",
        description:
          "Tenha aulas práticas de qualidade com veículos modernos e instrutores experientes. Aprenda de forma eficiente e segura.",
        color: "emerald" as const,
      },
      {
        icon: Award,
        title: "Conquiste sua CNH",
        description:
          "Com nossa formação completa e certificada, você estará totalmente preparado para conquistar sua habilitação.",
        color: "amber" as const,
      },
    ],
    instrutor: [
      {
        icon: FileCheck,
        title: "Cadastre-se na Plataforma",
        description: "Crie seu perfil completo com suas certificações, experiência e disponibilidade de horários.",
        color: "emerald" as const,
      },
      {
        icon: Users,
        title: "Receba Solicitações",
        description:
          "Alunos interessados entrarão em contato com você. Gerencie suas turmas de forma fácil e organizada.",
        color: "amber" as const,
      },
      {
        icon: BookOpen,
        title: "Ministre Aulas",
        description: "Ensine com excelência usando nossa metodologia comprovada e materiais de apoio disponibilizados.",
        color: "emerald" as const,
      },
      {
        icon: Wallet,
        title: "Receba seus Pagamentos",
        description: "Sistema transparente de pagamentos com relatórios detalhados de suas aulas e ganhos mensais.",
        color: "amber" as const,
      },
    ],
    autoescola: [
      {
        icon: Building2,
        title: "Cadastre sua Auto Escola",
        description: "Registre sua instituição na plataforma com todos os documentos e certificações necessárias.",
        color: "emerald" as const,
      },
      {
        icon: Users,
        title: "Adicione seus Instrutores",
        description: "Cadastre toda sua equipe de instrutores e gerencie suas disponibilidades em um só lugar.",
        color: "amber" as const,
      },
      {
        icon: Calendar,
        title: "Gerencie Turmas",
        description:
          "Organize horários, aulas e acompanhe o progresso de todos os alunos através de um painel completo.",
        color: "emerald" as const,
      },
      {
        icon: Award,
        title: "Expanda seu Negócio",
        description: "Alcance mais alunos através da plataforma e aumente a visibilidade da sua auto escola na região.",
        color: "amber" as const,
      },
    ],
  }

  const steps = profileSteps[selectedProfile]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 overflow-hidden flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full py-12">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Como funciona a <span className="text-amber-400">Via Betel</span>
          </h2>
          <p className="text-xs text-emerald-50 max-w-2xl mx-auto mb-3">
            Um processo simples e eficiente para você conquistar sua habilitação com excelência
          </p>

          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => {
                setSelectedProfile("aluno")
                setActiveStep(0)
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedProfile === "aluno"
                  ? "bg-white text-emerald-700 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <GraduationCap className="w-3 h-3 inline-block mr-1" />
              Sou Aluno
            </button>
            <button
              onClick={() => {
                setSelectedProfile("instrutor")
                setActiveStep(0)
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedProfile === "instrutor"
                  ? "bg-white text-emerald-700 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Users className="w-3 h-3 inline-block mr-1" />
              Sou Instrutor
            </button>
            <button
              onClick={() => {
                setSelectedProfile("autoescola")
                setActiveStep(0)
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedProfile === "autoescola"
                  ? "bg-white text-emerald-700 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Building2 className="w-3 h-3 inline-block mr-1" />
              Sou Auto Escola
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index

            return (
              <div
                key={index}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isActive ? "scale-105" : "scale-100 hover:scale-102"
                }`}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`bg-white rounded-xl p-3 shadow-xl transition-all duration-300 ${
                    isActive ? "ring-4 ring-amber-400 shadow-2xl" : "ring-1 ring-gray-200"
                  }`}
                >
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300 ${
                      step.color === "emerald" ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive ? (step.color === "emerald" ? "bg-emerald-100" : "bg-amber-100") : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? (step.color === "emerald" ? "text-emerald-600" : "text-amber-600") : "text-gray-600"
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-xs font-bold mb-1 transition-all duration-300 ${
                      isActive ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className={`text-xs transition-all duration-300 ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                    {step.description}
                  </p>

                  {isActive && (
                    <div className="mt-1 flex items-center gap-1 text-emerald-600 font-medium text-xs">
                      <Check className="w-3 h-3" />
                      Passo atual
                    </div>
                  )}
                </div>

                {/* Arrow connector (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                    <div className="w-4 h-4 rotate-45 bg-white border-r-2 border-t-2 border-amber-400" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {selectedProfile === "aluno" && (
            <>
              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">50+</div>
                <div className="text-emerald-100 text-xs">Instrutores Certificados</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white mb-1">98%</div>
                <div className="text-emerald-100 text-xs">Taxa de Aprovação</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">15.000+</div>
                <div className="text-emerald-100 text-xs">Alunos Formados</div>
              </div>
            </>
          )}

          {selectedProfile === "instrutor" && (
            <>
              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Cadastre-se</div>
                <div className="text-emerald-100 text-xs">Na Plataforma</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Receba Solicitações</div>
                <div className="text-emerald-100 text-xs">De Alunos</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Ministre Aulas</div>
                <div className="text-emerald-100 text-xs">Com Excelência</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Receba Pagamentos</div>
                <div className="text-emerald-100 text-xs">Transparente</div>
              </div>
            </>
          )}

          {selectedProfile === "autoescola" && (
            <>
              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Cadastre-se</div>
                <div className="text-emerald-100 text-xs">Como Auto Escola</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Adicione Instrutores</div>
                <div className="text-emerald-100 text-xs">Sua Equipe</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Gerencie Turmas</div>
                <div className="text-emerald-100 text-xs">Com Facilidade</div>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 mx-auto mb-1 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Expanda Negócio</div>
                <div className="text-emerald-100 text-xs">Alcance Mais Alunos</div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
