import { Header } from "@/components/Header"
import { HeroCarouselServer } from "@/components/HeroCarouselServer"
import { ProductsSection } from "@/components/ProductsSection"
import { SubcategoriesGrid } from "@/components/SubcategoriesGrid"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"
import { getCategorySlugFromRoute, getProductCategoryFromRoute } from "@/lib/categories"

export default function DynamicCategoryPage({ 
  category, 
  subcategory = null, 
  showSubcategoriesGrid = false 
}) {
  // Obtener el slug de Strapi basado en la ruta
  const categorySlug = getCategorySlugFromRoute(category, subcategory)
  // Obtener la categoría de productos basada en la ruta
  const productCategory = getProductCategoryFromRoute(category, subcategory)
  
  return (
    <CategoryProvider initialCategory={category} initialSubcategory={subcategory}>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroCarouselServer categorySlug={categorySlug} />
          {showSubcategoriesGrid && !subcategory && (
            <SubcategoriesGrid />
          )}
          <ProductsSection category={productCategory} />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  )
} 