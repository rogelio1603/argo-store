import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { AboutUsSection } from "@/components/AboutUsSection"
import { fetchCategoriesServer } from "@/lib/categories-server"

export const metadata = {
  title: "Sobre Nosotros - ArgoStore",
  description: "Conoce nuestra historia, misión y compromiso con la moda de calidad. ArgoStore, democratizando la moda desde 2009.",
}

export default async function SobreNosotrosPage() {
  // Obtener categorías del servidor
  const categoriesData = await fetchCategoriesServer({ pageSize: 100 })
  const categories = categoriesData?.data || []

  return (
    <div className="min-h-screen">
      <Header categories={categories} />
      <main>
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  )
} 