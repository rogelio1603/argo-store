"use client"

import { Header } from "@/components/Header"
import { HeroCarousel } from "@/components/HeroCarousel"
import { ProductsSection } from "@/components/ProductsSection"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"

export default function Home() {
  return (
    <CategoryProvider initialCategory="all">
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroCarousel />
          <ProductsSection />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  )
}
