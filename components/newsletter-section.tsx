"use client"
import { motion } from "framer-motion"
import { Instagram, Mail } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"
import { AnimatedText } from "./animated-text"

export function NewsletterSection() {
  const contactChannels = [
    {
      icon: Instagram,
      label: "Instagram",
      value: "@viabetel",
      link: "https://instagram.com/viabetel",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Mail,
      label: "E-mail",
      value: "contato@viabetel.com",
      link: "mailto:contato@viabetel.com",
      color: "from-green-700 to-green-800",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-custom">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <BlurPanel className="p-8 lg:p-10 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-md grain-texture border border-green-200">
              <div className="text-center mb-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                  <AnimatedText text="Conecte-se " delay={0.2} />
                  <span className="italic font-light text-green-700">
                    <AnimatedText text="conosco." delay={0.5} />
                  </span>
                </h2>
                <p className="text-lg text-neutral-700">
                  Entre em contato através dos nossos canais digitais e tire suas dúvidas sobre a Via Betel.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-7 max-w-2xl mx-auto">
                {contactChannels.map((channel, index) => (
                  <motion.a
                    key={channel.label}
                    href={channel.link}
                    target={channel.label === "Instagram" ? "_blank" : undefined}
                    rel={channel.label === "Instagram" ? "noopener noreferrer" : undefined}
                    className="group block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white backdrop-blur-sm border border-green-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-green-400">
                      <div
                        className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}
                      >
                        <channel.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{channel.label}</h3>
                      <p className="text-sm text-neutral-600 break-words">{channel.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <p className="text-xs text-neutral-600 text-center mt-8">
                Estamos à disposição para ajudá-lo em sua jornada para conquistar a CNH.
              </p>
            </BlurPanel>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
