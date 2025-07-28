import DynamicCategoryPage from "@/components/DynamicCategoryPage"
import { isValidCategoryRoute, getSubcategoriesForCategory } from "@/lib/dynamic-routes"
import { notFound } from 'next/navigation'

export default async function UniversalSubcategoryPage({ params }) {
  const { category, slug } = await params
  
  // Verificar si la categoría es válida
  const isValidCategory = await isValidCategoryRoute(category)
  
  if (!isValidCategory) {
    notFound()
  }
  
  // Verificar si la subcategoría existe
  const subcategories = await getSubcategoriesForCategory(category)
  const subcategoryExists = subcategories.some(sub => sub.slug === slug)
  
  if (!subcategoryExists) {
    notFound()
  }
  
  return (
    <DynamicCategoryPage 
      category={category} 
      subcategory={slug}
    />
  )
}

// Generar rutas estáticas para todas las subcategorías
export async function generateStaticParams() {
  try {
    const { generateCategoryRoutes } = await import('@/lib/dynamic-routes')
    const routes = await generateCategoryRoutes()
    
    const params = []
    
    for (const route of routes) {
      for (const subcategory of route.subcategories) {
        params.push({
          category: route.slug,
          slug: subcategory.slug
        })
      }
    }
    
    return params
  } catch (error) {
    console.error('Error generating static params for subcategories:', error)
    return []
  }
} 