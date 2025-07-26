// Sistema de rutas dinámicas basado en datos de Strapi

export const generateCategoryRoutes = async () => {
  try {
    // En el entorno del servidor, podemos usar la función directa
    const { fetchCategoriesServer } = await import('./categories-server')
    const categoriesData = await fetchCategoriesServer({ pageSize: 100 })
    const categories = categoriesData?.data || []
    
    // Obtener todas las categorías_global únicas
    const globalCategories = [...new Set(
      categories
        .filter(cat => cat.categoria_global)
        .map(cat => cat.categoria_global)
    )]
    
    return globalCategories.map(global => ({
      globalCategory: global,
      slug: global.toLowerCase().replace(/\s+/g, '-'),
      subcategories: categories.filter(cat => cat.categoria_global === global)
    }))
  } catch (error) {
    console.error('Error generating category routes:', error)
    return []
  }
}

// Función helper para verificar si una ruta de categoría es válida
export const isValidCategoryRoute = async (categorySlug) => {
  const routes = await generateCategoryRoutes()
  return routes.some(route => route.slug === categorySlug)
}

// Función helper para obtener subcategorías de una categoría
export const getSubcategoriesForCategory = async (categorySlug) => {
  const routes = await generateCategoryRoutes()
  const categoryRoute = routes.find(route => route.slug === categorySlug)
  return categoryRoute ? categoryRoute.subcategories : []
} 