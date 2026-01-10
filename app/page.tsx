"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MaterialsSection } from "@/components/materials-section"
import { RegionalInstructorsSection } from "@/components/regional-instructors-section"
import { ResourcesSection } from "@/components/resources-section"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const handleHeroVisibility = (e: CustomEvent) => {
      setIsHeroVisible(e.detail.isHeroVisible)
    }

    window.addEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)

    return () => {
      window.removeEventListener("heroVisibilityChange", handleHeroVisibility as EventListener)
    }
  }, [])

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Via Betel - Instrutores de Condução",
    alternateName: "Via Betel",
    description:
      "Plataforma que conecta alunos e instrutores de direção qualificados em Juiz de Fora e Minas Gerais. Aulas práticas, reforço CNH, treino para prova prática em todas as categorias (A, B, C, D, E)",
    url: "https://viabetel.com",
    logo: "https://viabetel.com/images/viabetel-logo.png",
    image: "https://viabetel.com/images/viabetel-og-image.jpg",
    telephone: "+55-32-98809-3506",
    email: "contatoviabetel@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Juiz de Fora",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Juiz de Fora",
      },
      {
        "@type": "State",
        name: "Minas Gerais",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-32-98809-3506",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
    sameAs: ["https://instagram.com/viabetel"],
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://viabetel.com/#business",
    name: "Via Betel - Instrutores de Condução",
    image: "https://viabetel.com/images/viabetel-logo.png",
    url: "https://viabetel.com",
    telephone: "+55-32-98809-3506",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Juiz de Fora",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-21.7642",
      longitude: "-43.3503",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
  }

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Aulas de Direção",
    provider: {
      "@type": "EducationalOrganization",
      name: "Via Betel",
    },
    areaServed: {
      "@type": "State",
      name: "Minas Gerais",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Instrução de Direção",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aulas de Direção Categoria A - Moto",
            description: "Aulas práticas de direção para habilitação categoria A com instrutores certificados",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aulas de Direção Categoria B - Carro",
            description: "Aulas práticas de direção para habilitação categoria B com veículos modernos",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aulas de Direção Categoria C - Caminhão",
            description: "Aulas práticas para habilitação categoria C com instrutores especializados",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aulas de Direção Categoria D - Ônibus",
            description: "Aulas práticas para habilitação categoria D com veículos de grande porte",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aulas de Direção Categoria E - Carreta",
            description: "Aulas práticas para habilitação categoria E com veículos articulados",
          },
        },
      ],
    },
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como funciona a Via Betel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Via Betel conecta alunos que desejam tirar CNH com instrutores qualificados. Você escolhe o instrutor, agenda suas aulas e aprende a dirigir com segurança e qualidade.",
        },
      },
      {
        "@type": "Question",
        name: "Quais categorias de CNH estão disponíveis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oferecemos aulas para todas as categorias: A (moto), B (carro), C (caminhão), D (ônibus) e E (carreta). Cada categoria possui instrutores especializados.",
        },
      },
      {
        "@type": "Question",
        name: "Os instrutores são certificados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim, todos os instrutores da Via Betel são certificados pelo DETRAN e possuem ampla experiência em educação de trânsito.",
        },
      },
      {
        "@type": "Question",
        name: "Como agendar uma aula?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É simples! Navegue pelo catálogo de instrutores, escolha o que melhor se encaixa no seu perfil e localização, e entre em contato diretamente para agendar suas aulas.",
        },
      },
      {
        "@type": "Question",
        name: "A Via Betel atende em quais cidades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Atualmente atendemos em diversas cidades de Minas Gerais, incluindo Belo Horizonte, Contagem, Betim e região metropolitana.",
        },
      },
    ],
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://viabetel.com",
      },
    ],
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Via Betel - Instrutores de Condução",
    url: "https://viabetel.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://viabetel.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <FeaturedProducts />
        <div id="categorias">
          <MaterialsSection />
        </div>
        <div id="como-funciona">
          <HowItWorksSection />
        </div>
        <RegionalInstructorsSection />
        <ResourcesSection />
        <Footer />
      </main>
    </>
  )
}
