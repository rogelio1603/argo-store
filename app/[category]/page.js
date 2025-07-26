import DynamicCategoryPage from "@/components/DynamicCategoryPage"
import { isValidCategoryRoute } from "@/lib/dynamic-routes"
import { notFound } from 'next/navigation'

export default async function UniversalCategoryPage({ params }) {
  const { category } = await params
  
  // Verificar si la categoría es válida
  const isValid = await isValidCategoryRoute(category)
  
  if (!isValid) {
    notFound()
  }
  
  return (
    <DynamicCategoryPage 
      category={category} 
      showSubcategoriesGrid={true}
    />
  )
}

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  try {
    const { generateCategoryRoutes } = await import('@/lib/dynamic-routes')
    const routes = await generateCategoryRoutes()
    
    return routes.map(route => ({
      category: route.slug
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
} 