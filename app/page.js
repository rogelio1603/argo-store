import { Header } from "@/components/Header"
import { HeroCarousel } from "@/components/HeroCarousel"
import { ProductsSection } from "@/components/ProductsSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  )
}
