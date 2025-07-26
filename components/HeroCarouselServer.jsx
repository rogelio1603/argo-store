import { HeroCarousel } from "./HeroCarousel"
import { fetchCategoriesServer } from "@/lib/categories-server"

export async function HeroCarouselServer({ categorySlug = null }) {
  try {
    const { data: categoriesData } = await fetchCategoriesServer({ pageSize: 100 })
    
    // If categorySlug is specified, filter for that specific category
    let filteredCategories = categoriesData || []
    let categoryInfo = null
    
    if (categorySlug && categorySlug !== 'inicio') {
      // First try to find by exact slug match (for specific subcategories like 'bolsas')
      const exactMatch = categoriesData?.find(category => category.slug === categorySlug)
      
      if (exactMatch) {
        // If we found an exact match, use it for hero info and filter by its categoria_global
        categoryInfo = exactMatch
        filteredCategories = categoriesData?.filter(category => 
          category.categoria_global === exactMatch.categoria_global
        ) || []
      } else {
        // If no exact match, search by categoria_global (for main categories like 'accesorios')
        filteredCategories = categoriesData?.filter(category => {
          if (!category.categoria_global) return false
          const routeSlug = category.categoria_global.toLowerCase().replace(/\s+/g, '-')
          return routeSlug === categorySlug.toLowerCase()
        }) || []
        
        // For main categories, use the first category from that global category
        categoryInfo = filteredCategories.length > 0 ? filteredCategories[0] : null
      }
    }
     
    return <HeroCarousel categoriesData={filteredCategories} categoryInfo={categoryInfo} />
  } catch (error) {
    console.error('Error in HeroCarouselServer:', error)
    return <HeroCarousel categoriesData={[]} categoryInfo={null} />
  }
} 