// Client-side Categories API functions - uses secure API routes

export const fetchCategories = async ({ pageParam = 1, pageSize = 8 } = {}) => {
  try {
    // Use our secure API route instead of direct Strapi calls
    const response = await fetch(`/api/groups?page=${pageParam}&pageSize=${pageSize}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

export const fetchFeaturedCategories = async () => {
  try {
    // Use our secure API route instead of direct Strapi calls
    const response = await fetch(`/api/groups?page=1&pageSize=8`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    throw new Error('Failed to fetch featured categories')
  }
}

// Dynamic categories configuration - generated from Strapi data
let dynamicCategoriesConfig = {
  all: {
    title: "Moda que Define tu Estilo",
    subtitle: "Descubre nuestra colección exclusiva de ropa y accesorios",
    buttonText: "Explorar Colección",
    sectionSubtitle: "Una selección curada de nuestros mejores productos en todas las categorías",
    color: "red",
    subcategories: []
  }
}

// Color mapping for categories
const categoryColors = {
  'drops': 'orange',
  'ropa': 'blue', 
  'accesorios': 'purple',
  'calzado': 'green',
  'zapatos': 'green',
  'default': 'red'
}

// Cache para almacenar categorías de Strapi
let strapiCategoriesCache = null

// Función para obtener categorías de Strapi con cache
const getStrapiCategories = async () => {
  if (strapiCategoriesCache) {
    return strapiCategoriesCache
  }
  
  try {
    const response = await fetch('/api/groups?page=1&pageSize=100')
    if (response.ok) {
      const data = await response.json()
      strapiCategoriesCache = data.data || []
      return strapiCategoriesCache
    }
  } catch (error) {
    console.error('Error fetching Strapi categories:', error)
  }
  
  return []
}

// Funciones actualizadas para usar datos dinámicos de Strapi
export const getCategorySlugFromRoute = async (category, subcategory = null) => {
  if (!category) return null
  
  if (category === 'all') return 'inicio'
  
  if (!subcategory) {
    // Para categorías principales, usar el slug directo
    return category
  }
  
  // Para subcategorías, buscar en los datos de Strapi
  const strapiCategories = await getStrapiCategories()
  const matchingCategory = strapiCategories.find(cat => 
    cat.slug === subcategory && 
    cat.categoria_global && 
    cat.categoria_global.toLowerCase() === category.toLowerCase()
  )
  
  return matchingCategory ? matchingCategory.slug : subcategory
}

export const getProductCategoryFromRoute = async (category, subcategory = null) => {
  if (!category) return null
  
  if (category === 'all') return null
  
  if (!subcategory) {
    // Para categorías principales, buscar dinámicamente en Strapi
    const strapiCategories = await getStrapiCategories()
    const possibleGlobalCategory = strapiCategories.find(cat => {
      if (!cat.categoria_global) return false
      const routeSlug = cat.categoria_global.toLowerCase().replace(/\s+/g, '-')
      return routeSlug === category.toLowerCase()
    })
    
    return possibleGlobalCategory ? possibleGlobalCategory.categoria_global : null
  }
  
  // Para subcategorías, buscar el nombre en los datos de Strapi
  const strapiCategories = await getStrapiCategories()
  const matchingCategory = strapiCategories.find(cat => 
    cat.slug === subcategory && 
    cat.categoria_global && 
    cat.categoria_global.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  )
  
  return matchingCategory ? matchingCategory.nombre : null
}

// Función sincrónica para el Header (que ya tiene los datos)
export const getCategorySlugFromRouteSync = (category, subcategory = null) => {
  if (!category) return null
  if (category === 'all') return 'inicio'
  if (!subcategory) return category
  return subcategory
}

export const getProductCategoryFromRouteSync = (category, subcategory = null) => {
  if (!category) return null
  if (category === 'all') return null
  
  if (!subcategory) {
    // Para categorías principales, no podemos hacer búsqueda dinámica sincrónica
    // Se debe usar la versión async en su lugar
    console.warn('getProductCategoryFromRouteSync: Use getProductCategoryFromRoute async version for dynamic mapping')
    return null
  }
  
  // Para subcategorías, no podemos hacer la búsqueda sincrónica
  // DynamicCategoryPage debería usar la versión async
  return null
}

// Generate dynamic config from Strapi data
export const generateDynamicConfig = async () => {
  try {
    const { data: categoriesData } = await fetchFeaturedCategories()
    
    if (!categoriesData || !Array.isArray(categoriesData)) {
      console.warn('No categories data available, using fallback config')
      return dynamicCategoriesConfig
    }

    // Generate config for each category from Strapi
    categoriesData.forEach(category => {
      const slug = category.slug
      const color = categoryColors[slug] || categoryColors.default
      
      dynamicCategoriesConfig[slug] = {
        title: category.name || `Categoría ${slug}`,
        subtitle: category.description || `Descubre nuestra colección de ${category.name || slug}`,
        buttonText: `Ver ${category.name || slug}`,
        sectionTitle: `Nuestra Colección de ${category.name || slug}`,
        sectionSubtitle: `Productos únicos de ${category.name || slug} para complementar tu estilo`,
        color: color,
        subcategories: [], // We can extend this later if needed
        // Add Strapi data
        strapiData: {
          id: category.id,
          documentId: category.documentId,
          featuredImages: category.featuredImages || [],
          image: category.image,
          images: category.images || []
        }
      }
    })

    return dynamicCategoriesConfig
  } catch (error) {
    console.error('Error generating dynamic config:', error)
    return dynamicCategoriesConfig
  }
}

// Initialize dynamic config
export const initializeCategoriesConfig = async () => {
  dynamicCategoriesConfig = await generateDynamicConfig()
  return dynamicCategoriesConfig
}

// Get current categories config (with fallback to static if dynamic not loaded)
export const getCategoriesConfig = () => {
  return dynamicCategoriesConfig
}

// Helper functions
export const getAllCategories = () => {
  return Object.keys(dynamicCategoriesConfig).filter(key => key !== 'all')
}

export const getCategoryConfig = (category) => {
  return dynamicCategoriesConfig[category] || dynamicCategoriesConfig.all
}

export const getSubcategories = (category) => {
  const config = getCategoryConfig(category)
  return config.subcategories || []
}

export const getSubcategoryBySlug = (category, slug) => {
  const subcategories = getSubcategories(category)
  return subcategories.find(sub => sub.slug === slug)
}

export const getFeaturedSubcategories = (category) => {
  const subcategories = getSubcategories(category)
  return subcategories.filter(sub => sub.featured)
}

// Generate dynamic routes
export const generateDynamicRoutes = () => {
  const routes = []
  
  getAllCategories().forEach(category => {
    // Add main category route
    routes.push(`/${category}`)
    
    // Add subcategory routes
    getSubcategories(category).forEach(subcategory => {
      routes.push(`/${category}/${subcategory.slug}`)
    })
  })
  
  return routes
}

// Legacy static config (fallback)
export const categoriesConfig = dynamicCategoriesConfig 