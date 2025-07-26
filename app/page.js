import { Header } from "@/components/Header"
import { HeroCarouselServer } from "@/components/HeroCarouselServer"
import { ProductsSection } from "@/components/ProductsSection"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"
import { fetchCategoriesServer } from "@/lib/categories-server"

export default async function Home() {
  // Obtener categorías del servidor
  const categoriesData = await fetchCategoriesServer({ pageSize: 100 })
  const categories = categoriesData?.data || []

  return (
    <CategoryProvider initialCategory="all">
      <div className="min-h-screen">
        <Header categories={categories} />
        <main>
          <HeroCarouselServer categorySlug="inicio" />
          <ProductsSection category={null} />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  )
}
