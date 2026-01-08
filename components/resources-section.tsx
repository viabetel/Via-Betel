"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Calendar, Mic, ArrowRight, Download, Play } from "lucide-react"
import { cn } from "@/lib/utils"

const resources = [
  {
    id: "studies",
    icon: BookOpen,
    title: "ESTUDOS DE MERCADO",
    subtitle: "Insights Exclusivos",
    description:
      "Análises profundas e dados exclusivos sobre tendências e segmentos da educação no trânsito brasileiro",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-50 to-teal-50",
    buttonText: "BAIXAR ESTUDOS",
    buttonIcon: Download,
    buttonHref: "#recursos",
    highlights: ["Pesquisas inéditas", "Dados estatísticos", "Tendências 2025"],
  },
  {
    id: "events",
    icon: Calendar,
    title: "EVENTOS",
    subtitle: "Conecte-se",
    description: "Participe de eventos, workshops e palestras sobre educação no trânsito, segurança viária e inovações",
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    bgGradient: "from-amber-50 to-orange-50",
    buttonText: "VER AGENDA",
    buttonIcon: ArrowRight,
    buttonHref: "#eventos",
    highlights: ["Workshops presenciais", "Webinars online", "Networking"],
  },
  {
    id: "podcast",
    icon: Mic,
    title: "PODCAST",
    subtitle: "Direção Segura",
    description:
      "Conversas inspiradoras sobre mobilidade urbana, educação no trânsito e histórias de sucesso dos nossos instrutores",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-50 to-purple-50",
    buttonText: "OUVIR AGORA",
    buttonIcon: Play,
    buttonHref: "#podcast",
    highlights: ["Episódios semanais", "Especialistas", "Histórias reais"],
  },
]

export function ResourcesSection() {
  const [activeResource, setActiveResource] = useState("studies")
  const active = resources.find((r) => r.id === activeResource) || resources[0]

  return (
    <section className="relative py-9 md:py-15 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1.5 mb-3"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs text-emerald-700 font-semibold">Recursos Via Betel</span>
          </motion.div>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-balance">
            Conteúdos que{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Transformam
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto text-pretty">
            Acesse materiais exclusivos, eventos e conteúdos que vão além da sala de aula
          </p>
        </motion.div>

        {/* Resource Cards - Tab Style */}
        <div className="max-w-5xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-5"
          >
            {resources.map((resource) => {
              const Icon = resource.icon
              const isActive = activeResource === resource.id

              return (
                <motion.button
                  key={resource.id}
                  onClick={() => setActiveResource(resource.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "group relative px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300",
                    isActive
                      ? `bg-gradient-to-r ${resource.gradient} text-white shadow-xl`
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={cn("w-3.5 h-3.5 transition-transform", isActive && "scale-110")} />
                    <span>{resource.title}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Active Resource Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeResource}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={cn(
                "relative rounded-2xl p-5 md:p-6 shadow-2xl overflow-hidden",
                `bg-gradient-to-br ${active.bgGradient}`,
              )}
            >
              {/* Decorative gradient overlay */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl bg-gradient-to-br",
                  active.gradient,
                )}
              />

              <div className="relative z-10 grid md:grid-cols-2 gap-5 items-center">
                {/* Left: Icon and Content */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <motion.div
                    className={cn("inline-flex p-2.5 rounded-xl mb-3 bg-gradient-to-br", active.gradient, "shadow-xl")}
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <active.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>

                  <div className="mb-1.5">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {active.subtitle}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{active.title}</h3>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{active.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {active.highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 font-medium"
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", active.gradient)} />
                        {highlight}
                      </motion.div>
                    ))}
                  </div>

                  <motion.a
                    href={active.buttonHref}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow-2xl transition-all text-sm",
                      `bg-gradient-to-r ${active.gradient} hover:shadow-3xl`,
                    )}
                  >
                    <active.buttonIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {active.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
                  </motion.a>
                </motion.div>

                {/* Right: Visual Element */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex items-center justify-center"
                >
                  <div className="relative w-48 h-48">
                    {/* Animated circles */}
                    <motion.div
                      className={cn("absolute inset-0 rounded-full bg-gradient-to-br", active.gradient, "opacity-20")}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className={cn("absolute inset-6 rounded-full bg-gradient-to-tr", active.gradient, "opacity-30")}
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [360, 180, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className={cn("absolute inset-12 rounded-full bg-gradient-to-bl", active.gradient, "opacity-40")}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <active.icon className="w-20 h-20 text-gray-700 drop-shadow-2xl" strokeWidth={1.5} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6"
          >
            <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200 text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                25+
              </div>
              <div className="text-gray-600 font-medium text-sm">Estudos Publicados</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200 text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                150+
              </div>
              <div className="text-gray-600 font-medium text-sm">Eventos Realizados</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200 text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
                80+
              </div>
              <div className="text-gray-600 font-medium text-sm">Episódios de Podcast</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
