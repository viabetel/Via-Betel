"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Calendar, Mic, ArrowRight, Download, Play, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const studiesData = [
  { title: "Perfil do Condutor Brasileiro 2025", category: "Comportamento", downloads: 1240 },
  { title: "Impacto da Tecnologia na Educação Viária", category: "Tecnologia", downloads: 987 },
  { title: "Análise de Acidentes Categoria B", category: "Segurança", downloads: 1450 },
  { title: "Tendências Mobilidade Urbana", category: "Mobilidade", downloads: 820 },
  { title: "Eficácia Métodos de Ensino Prático", category: "Educação", downloads: 1120 },
  { title: "Estatísticas CNH Digital Brasil", category: "Tecnologia", downloads: 2100 },
]

const eventsData = [
  { title: "Workshop: Técnicas Avançadas Estacionamento", date: "15 Mar 2025", type: "Presencial", city: "São Paulo" },
  { title: "Webinar: Segurança Viária Urbana", date: "22 Mar 2025", type: "Online", city: "Nacional" },
  { title: "Congresso Nacional de Instrutores", date: "05 Abr 2025", type: "Presencial", city: "Brasília" },
  { title: "Palestra: Novas Regras CTB 2025", date: "18 Abr 2025", type: "Online", city: "Nacional" },
  { title: "Encontro Regional Instrutores RJ", date: "10 Mai 2025", type: "Presencial", city: "Rio de Janeiro" },
  { title: "Workshop: Direção Defensiva Avançada", date: "25 Mai 2025", type: "Presencial", city: "Belo Horizonte" },
]

const podcastData = [
  { title: "Ep. 42: Histórias de Aprovação Emocionantes", duration: "45 min", guest: "Instrutor Carlos Silva" },
  { title: "Ep. 41: Tecnologia e Mobilidade do Futuro", duration: "38 min", guest: "Dra. Ana Rodrigues" },
  { title: "Ep. 40: Superando o Medo de Dirigir", duration: "52 min", guest: "Psicóloga Marina Costa" },
  { title: "Ep. 39: Segurança para Motociclistas", duration: "41 min", guest: "Instrutor José Santos" },
  { title: "Ep. 38: Educação Viária nas Escolas", duration: "35 min", guest: "Prof. Roberto Lima" },
  { title: "Ep. 37: Dicas para Primeira Habilitação", duration: "48 min", guest: "Instrutora Paula Mendes" },
]

const officialContentStudies = [
  {
    title: "Código de Trânsito Brasileiro - Lei 9.503/1997",
    description: "Lei completa que regulamenta o trânsito no Brasil",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm",
    badge: "Oficial",
  },
  {
    title: "Resoluções CONTRAN",
    description: "Normas e regulamentações do Conselho Nacional de Trânsito",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/conteudo-contran/resolucoes",
    badge: "Oficial",
  },
  {
    title: "Estatísticas de Trânsito - SENATRAN",
    description: "Dados oficiais sobre acidentes e habilitação no Brasil",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/conteudo-senatran",
    badge: "Oficial",
  },
]

const officialContentEvents = [
  {
    title: "Semana Nacional de Trânsito",
    description: "Campanha anual do governo federal sobre educação viária",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/semana-nacional-de-transito",
    badge: "Oficial",
  },
  {
    title: "Portal DENATRAN - Notícias",
    description: "Atualizações e eventos oficiais sobre trânsito",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito",
    badge: "Oficial",
  },
]

const officialContentPodcast = [
  {
    title: "Portal da Mobilidade Urbana",
    description: "Informações sobre mobilidade sustentável e segurança viária",
    url: "https://www.gov.br/cidades/pt-br/assuntos/mobilidade-urbana",
    badge: "Oficial",
  },
  {
    title: "Observatório Nacional de Segurança Viária",
    description: "Dados e pesquisas sobre segurança no trânsito brasileiro",
    url: "https://www.gov.br/observatoriodetransito/pt-br",
    badge: "Oficial",
  },
]

const governmentSources = [
  {
    name: "DENATRAN",
    fullName: "Departamento Nacional de Trânsito",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito",
    logo: "/credenciais/denatran.png",
    hasRealLogo: true,
  },
  {
    name: "SENATRAN",
    fullName: "Secretaria Nacional de Trânsito",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/conteudo-senatran",
    logo: "/credenciais/senatran.png",
    hasRealLogo: true,
  },
  {
    name: "CONTRAN",
    fullName: "Conselho Nacional de Trânsito",
    url: "https://www.gov.br/infraestrutura/pt-br/assuntos/transito/conteudo-contran",
    logo: null,
    hasRealLogo: false,
  },
  {
    name: "DETRAN-MG",
    fullName: "Departamento de Trânsito de Minas Gerais",
    url: "https://www.detran.mg.gov.br/",
    logo: null,
    hasRealLogo: false,
  },
]

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
    highlights: ["Episódios semanais", "Especialistas", "Histórias reais"],
  },
]

export function ResourcesSection() {
  const [activeResource, setActiveResource] = useState("studies")
  const active = resources.find((r) => r.id === activeResource) || resources[0]

  const renderDynamicContent = () => {
    if (activeResource === "studies") {
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Estudos Disponíveis:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {studiesData.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-200 hover:border-emerald-400 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {study.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      <span className="bg-emerald-100 px-2 py-0.5 rounded">{study.category}</span>
                      <span>{study.downloads} downloads</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Conteúdos oficiais recomendados:</p>
            <div className="space-y-2">
              {officialContentStudies.map((content, idx) => (
                <a
                  key={idx}
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-xs font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {content.title}
                        </h5>
                        <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          {content.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600">{content.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activeResource === "events") {
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Próximos Eventos:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {eventsData.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-amber-200 hover:border-amber-400 transition-all group cursor-pointer"
              >
                <h5 className="text-xs font-semibold text-gray-900 mb-1.5 group-hover:text-amber-600 transition-colors">
                  {event.title}
                </h5>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{event.date}</span>
                  <span className="bg-amber-100 px-2 py-0.5 rounded">{event.type}</span>
                  <span>{event.city}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Conteúdos oficiais recomendados:</p>
            <div className="space-y-2">
              {officialContentEvents.map((content, idx) => (
                <a
                  key={idx}
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-xs font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {content.title}
                        </h5>
                        <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          {content.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600">{content.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activeResource === "podcast") {
      return (
        <div className="space-y-3">
          <div className="relative h-48 rounded-xl overflow-hidden mb-3">
            <img
              src="/images/pexels-george-milton-6954192.jpg"
              alt="Podcast Direção Segura"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="w-4 h-4" />
                <span className="text-xs font-bold">PODCAST DIREÇÃO SEGURA</span>
              </div>
              <p className="text-[10px] text-white/90">
                Conversas inspiradoras sobre mobilidade, segurança e histórias reais
              </p>
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-800 mb-2">Últimos Episódios:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {podcastData.map((episode, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-violet-200 hover:border-violet-400 transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <Play className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      {episode.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      <span>{episode.duration}</span>
                      <span>•</span>
                      <span className="text-violet-700">{episode.guest}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Conteúdos oficiais recomendados:</p>
            <div className="space-y-2">
              {officialContentPodcast.map((content, idx) => (
                <a
                  key={idx}
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-200 hover:border-violet-500 hover:bg-violet-50/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-xs font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                          {content.title}
                        </h5>
                        <span className="bg-violet-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          {content.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600">{content.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <section className="relative py-8 sm:py-10 md:py-12 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 w-full max-w-full">
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-emerald-300 rounded-full blur-2xl sm:blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-teal-300 rounded-full blur-2xl sm:blur-3xl" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5 sm:mb-6 md:mb-7"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-2 sm:px-3 py-1 sm:py-0.5 mb-2 sm:mb-3"
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold">Recursos Via Betel</span>
          </motion.div>

          <h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 text-balance px-2"
            style={{ fontSize: "clamp(1.125rem, 4vw, 2rem)" }}
          >
            Conteúdos que{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Transformam
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto text-pretty px-2">
            Acesse materiais exclusivos, eventos e conteúdos que vão além da sala de aula
          </p>
        </motion.div>

        {/* Resource Cards - Tab Style */}
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 px-2"
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
                    "group relative px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-xl font-semibold text-[11px] sm:text-xs transition-all duration-300 min-h-[40px] flex items-center gap-1.5",
                    isActive
                      ? `bg-gradient-to-r ${resource.gradient} text-white shadow-xl`
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform flex-shrink-0",
                      isActive && "scale-110",
                    )}
                  />
                  <span className="whitespace-nowrap">{resource.title}</span>

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl bg-gradient-to-br ${active.bgGradient} p-4 sm:p-5 md:p-6 shadow-xl border border-gray-200 w-full max-w-full min-w-0`}
            >
              {renderDynamicContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
