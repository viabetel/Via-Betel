"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Calendar,
  Car,
  Award,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FileCheck,
  Wallet,
  ShieldCheck,
  Clock,
} from "lucide-react"

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<"aluno" | "instrutor" | "autoescola">("aluno")

  const profileSteps = {
    aluno: [
      {
        icon: Users,
        title: "Escolha seu Instrutor",
        description:
          "Navegue por nosso catálogo de instrutores certificados e escolha aquele que melhor se encaixa no seu perfil, localização e necessidades específicas.",
        color: "emerald" as const,
      },
      {
        icon: Calendar,
        title: "Agende suas Aulas",
        description:
          "Escolha os horários mais convenientes para você. Oferecemos flexibilidade total com turmas personalizadas que se adaptam à sua rotina.",
        color: "amber" as const,
      },
      {
        icon: Car,
        title: "Aprenda na Prática",
        description:
          "Tenha aulas práticas de qualidade com veículos modernos e instrutores experientes. Aprenda de forma eficiente, segura e com metodologia comprovada.",
        color: "emerald" as const,
      },
      {
        icon: Award,
        title: "Conquiste sua CNH",
        description:
          "Com nossa formação completa e certificada, você estará totalmente preparado para conquistar sua habilitação com confiança e segurança.",
        color: "amber" as const,
      },
    ],
    instrutor: [
      {
        icon: FileCheck,
        title: "Cadastre-se na Plataforma",
        description:
          "Crie seu perfil profissional completo com suas certificações, experiência, especialidades e disponibilidade de horários para receber alunos.",
        color: "emerald" as const,
      },
      {
        icon: Users,
        title: "Receba Solicitações",
        description:
          "Alunos interessados entrarão em contato com você através da plataforma. Gerencie suas turmas de forma fácil, organizada e com total controle.",
        color: "amber" as const,
      },
      {
        icon: BookOpen,
        title: "Ministre Aulas",
        description:
          "Ensine com excelência usando nossa metodologia comprovada, materiais de apoio exclusivos e ferramentas que facilitam o processo de ensino.",
        color: "emerald" as const,
      },
      {
        icon: Wallet,
        title: "Receba seus Pagamentos",
        description:
          "Sistema transparente e seguro de pagamentos com relatórios detalhados de suas aulas ministradas e ganhos mensais, tudo em um só lugar.",
        color: "amber" as const,
      },
    ],
    autoescola: [
      {
        icon: Building2,
        title: "Cadastre sua Auto Escola",
        description:
          "Registre sua instituição na plataforma com todos os documentos necessários, certificações e informações sobre sua estrutura e diferenciais.",
        color: "emerald" as const,
      },
      {
        icon: Users,
        title: "Adicione seus Instrutores",
        description:
          "Cadastre toda sua equipe de instrutores qualificados e gerencie suas disponibilidades, especializações e desempenho em um só lugar.",
        color: "amber" as const,
      },
      {
        icon: Calendar,
        title: "Gerencie Turmas",
        description:
          "Organize horários, aulas práticas e teóricas, e acompanhe o progresso de todos os alunos através de um painel de controle completo e intuitivo.",
        color: "emerald" as const,
      },
      {
        icon: Award,
        title: "Expanda seu Negócio",
        description:
          "Alcance mais alunos através da plataforma digital, aumente a visibilidade da sua auto escola na região e impulsione seus resultados.",
        color: "amber" as const,
      },
    ],
  }

  const steps = profileSteps[selectedProfile]

  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[64vh] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 overflow-hidden flex items-center w-full max-w-full">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-5 left-5 sm:top-10 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-full blur-2xl sm:blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-amber-400 rounded-full blur-2xl sm:blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10 w-full max-w-full py-8 sm:py-10 lg:py-12">
        <motion.div
          className="text-center mb-5 sm:mb-6 lg:mb-7"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-2.5 text-balance px-2"
            style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)" }}
          >
            Como funciona a <span className="text-amber-400">Via Betel</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-3xl mx-auto mb-3 sm:mb-4 lg:mb-5 leading-relaxed text-pretty px-3">
            Um processo simples, eficiente e totalmente digital para você conquistar sua habilitação com excelência e
            segurança
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-5 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={() => {
                setSelectedProfile("aluno")
                setActiveStep(0)
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 min-h-[44px] ${
                selectedProfile === "aluno"
                  ? "bg-white text-emerald-700 shadow-lg scale-105"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1 sm:mr-2" />
              Sou Aluno
            </motion.button>
            <motion.button
              onClick={() => {
                setSelectedProfile("instrutor")
                setActiveStep(0)
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 min-h-[44px] ${
                selectedProfile === "instrutor"
                  ? "bg-white text-emerald-700 shadow-lg scale-105"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1 sm:mr-2" />
              Sou Instrutor
            </motion.button>
            <motion.button
              onClick={() => {
                setSelectedProfile("autoescola")
                setActiveStep(0)
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 min-h-[44px] ${
                selectedProfile === "autoescola"
                  ? "bg-white text-emerald-700 shadow-lg scale-105"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1 sm:mr-2" />
              Sou Auto Escola
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProfile}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 lg:gap-2 mb-5 sm:mb-6 lg:mb-7 w-full max-w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index

              return (
                <motion.div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-300 min-w-0 ${
                    isActive ? "scale-105" : "scale-100 hover:scale-102"
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => setActiveStep(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className={`bg-white rounded-lg p-2 sm:p-2.5 shadow-xl transition-all duration-300 h-full ${
                      isActive ? "ring-4 ring-amber-400 shadow-2xl" : "ring-1 ring-gray-200"
                    }`}
                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`absolute -top-1 -right-1 w-5 h-5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg transition-all duration-300 ${
                        step.color === "emerald" ? "bg-emerald-600" : "bg-amber-500"
                      }`}
                      animate={isActive ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {index + 1}
                    </motion.div>

                    <motion.div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2 transition-all duration-300 ${
                        isActive ? (step.color === "emerald" ? "bg-emerald-100" : "bg-amber-100") : "bg-gray-100"
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 }}
                    >
                      <Icon
                        className={`w-4 h-4 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                          isActive
                            ? step.color === "emerald"
                              ? "text-emerald-600"
                              : "text-amber-600"
                            : "text-gray-600"
                        }`}
                      />
                    </motion.div>

                    <h3
                      className={`text-[11px] sm:text-xs font-bold mb-0.5 sm:mb-1 transition-all duration-300 leading-tight text-balance ${
                        isActive ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-[9px] sm:text-[10px] leading-relaxed transition-all duration-300 text-pretty ${isActive ? "text-gray-600" : "text-gray-500"}`}
                    >
                      {step.description}
                    </p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="mt-1 sm:mt-1.5 flex items-center gap-1 text-emerald-600 font-medium text-[9px]"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="w-2.5 h-2.5" />
                          Passo atual
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                      <motion.div
                        className="w-3 h-3 rotate-45 bg-white border-r-2 border-t-2 border-amber-400"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedProfile}-stats`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 lg:gap-4 max-w-5xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {selectedProfile === "aluno" && (
              <>
                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Instrutores Certificados</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Profissionais qualificados e experientes</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Taxa de Aprovação</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Metodologia comprovada e eficaz</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 sm:col-span-2 lg:col-span-1 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">15.000+</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Alunos Formados</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Excelência reconhecida pelos resultados</p>
                </motion.div>
              </>
            )}

            {selectedProfile === "instrutor" && (
              <>
                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Certificação</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Profissional Validada</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Credibilidade e reconhecimento</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Flexibilidade</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Total de Horários</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Gerencie sua agenda com autonomia</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 sm:col-span-2 lg:col-span-1 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-amber-400/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Pagamentos</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Transparentes e Seguros</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Receba seus ganhos em dia</p>
                </motion.div>
              </>
            )}

            {selectedProfile === "autoescola" && (
              <>
                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Gestão</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Completa e Integrada</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Controle total da sua instituição</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Equipe</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Organizada e Eficiente</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Gerencie todos os instrutores</p>
                </motion.div>

                <motion.div
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:bg-white/15 sm:col-span-2 lg:col-span-1 min-w-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 bg-amber-400/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">Crescimento</div>
                  <div className="text-emerald-50 text-xs lg:text-sm font-medium">Digital Acelerado</div>
                  <p className="text-emerald-100/80 text-[10px] mt-1">Alcance mais alunos na região</p>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
