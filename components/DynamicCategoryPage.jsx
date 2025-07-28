import { Header } from "@/components/Header"
import { HeroCarouselServer } from "@/components/HeroCarouselServer"
import { ProductsSection } from "@/components/ProductsSection"
import { SubcategoriesGrid } from "@/components/SubcategoriesGrid"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"
import { getCategorySlugFromRoute, getProductCategoryFromRoute } from "@/lib/categories"
import { fetchCategoriesServer } from "@/lib/categories-server"

export default async function DynamicCategoryPage({ 
  category, 
  subcategory = null, 
  showSubcategoriesGrid = false 
}) {
  // Get categories from server
  const categoriesData = await fetchCategoriesServer({ pageSize: 100 })
  const categories = categoriesData?.data || []

  // Updated functions to get slug and product category
  const getCategorySlugFromCategories = (cat, subcat, categoriesData) => {
    if (!cat) return null
    if (cat === 'all') return 'inicio'
    if (!subcat) return cat
    
    // Search in Strapi categories
    const matchingCategory = categoriesData.find(strapiCat => 
      strapiCat.slug === subcat && 
      strapiCat.categoria_global && 
      strapiCat.categoria_global.toLowerCase().replace(/\s+/g, '-') === cat.toLowerCase()
    )
    
    return matchingCategory ? matchingCategory.slug : subcat
  }

  const getProductCategoryFromCategories = (cat, subcat, categoriesData) => {
    if (!cat) return null
    if (cat === 'all') return null
    
          if (!subcat) {
       // For main categories, search dynamically in Strapi data
       // First try to find a categoria_global that matches the route slug
      const possibleGlobalCategory = categoriesData.find(strapiCat => {
        if (!strapiCat.categoria_global) return false
        const routeSlug = strapiCat.categoria_global.toLowerCase().replace(/\s+/g, '-')
        return routeSlug === cat.toLowerCase()
      })
      
      return possibleGlobalCategory ? possibleGlobalCategory.categoria_global : null
    }
    
    // For subcategories, search the name in Strapi
    const matchingCategory = categoriesData.find(strapiCat => 
      strapiCat.slug === subcat && 
      strapiCat.categoria_global && 
      strapiCat.categoria_global.toLowerCase().replace(/\s+/g, '-') === cat.toLowerCase()
    )
    
    return matchingCategory ? matchingCategory.nombre : null
  }

  // Get Strapi slug and product category using available data
  const categorySlug = getCategorySlugFromCategories(category, subcategory, categories)
  const productCategory = getProductCategoryFromCategories(category, subcategory, categories)
  
  return (
    <CategoryProvider initialCategory={category} initialSubcategory={subcategory}>
      <div className="min-h-screen">
        <Header categories={categories} />
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