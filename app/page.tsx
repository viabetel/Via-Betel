"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MaterialsSection } from "@/components/materials-section"
import { ResourcesSection } from "@/components/resources-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorksSection />
      <MaterialsSection />
      <ResourcesSection />
      <Footer />
    </main>
  )
}
