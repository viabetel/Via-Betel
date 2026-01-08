"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MaterialsSection } from "@/components/materials-section"
import { RegionalInstructorsSection } from "@/components/regional-instructors-section"
import { ResourcesSection } from "@/components/resources-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Via Betel",
    description:
      "Plataforma que conecta alunos e instrutores de direção qualificados para aulas práticas de todas as categorias",
    url: "https://viabetel.com",
    logo: "https://viabetel.com/images/viabetel-logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-32-98809-3506",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: ["https://instagram.com/viabetel"],
    offers: {
      "@type": "Offer",
      category: "Aulas de Direção",
      description: "Aulas práticas de direção com instrutores qualificados",
    },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <FeaturedProducts />
        <HowItWorksSection />
        <MaterialsSection />
        <RegionalInstructorsSection />
        <ResourcesSection />
        <Footer />
      </main>
    </>
  )
}
