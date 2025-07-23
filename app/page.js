import { Header } from "@/components/Header"
import { HeroCarouselServer } from "@/components/HeroCarouselServer"
import { ProductsSection } from "@/components/ProductsSection"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"

export default function Home() {
  return (
    <CategoryProvider initialCategory="all">
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroCarouselServer categorySlug="inicio" />
          <ProductsSection category={null} />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  )
}
