import { HeroCarousel } from "./HeroCarousel"
import { fetchCategoriesServer } from "@/lib/categories-server"

export async function HeroCarouselServer({ categorySlug = null }) {
  try {
    const { data: categoriesData } = await fetchCategoriesServer()
    
    // Si se especifica un categorySlug, filtrar para esa categoría específica
    let filteredCategories = categoriesData || []
    if (categorySlug) {
      filteredCategories = categoriesData?.filter(category => category.slug === categorySlug) || []
    }
    
    return <HeroCarousel categoriesData={filteredCategories} />
  } catch (error) {
    console.error('Error in HeroCarouselServer:', error)
    return <HeroCarousel categoriesData={[]} />
  }
} 