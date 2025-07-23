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

// Mapeo de IDs de rutas a slugs de Strapi
const routeToSlugMapping = {
  // Página de inicio
  'all': 'inicio',
  // Drops - mapeo directo de /drops/1 -> drop-1
  'drops-1': 'drop-1',
  'drops-2': 'drop-2', 
  'drops-3': 'drop-3',
  // Ropa - mapeo de /ropa/AE -> ropa-ae (ajustar según slugs reales de Strapi)
  'ropa-AE': 'ropa-ae',
  'ropa-PT': 'ropa-pt',
  'ropa-SD': 'ropa-sd', 
  'ropa-CH': 'ropa-ch',
  // Accesorios - mapeo de /accesorios/GR -> accesorios-gr
  'accesorios-GR': 'accesorios-gr',
  'accesorios-BG': 'accesorios-bg',
  'accesorios-JY': 'accesorios-jy',
  // Calzado - mapeo de /calzado/SN -> calzado-sn
  'calzado-SN': 'calzado-sn',
  'calzado-CS': 'calzado-cs',
  'calzado-BT': 'calzado-bt',
}

// Mapeo de categorías del Header a categorías de productos en Strapi
const headerToProductCategoryMapping = {
  // Página de inicio - mostrar todos los productos
  'all': null,
  // Drops - mapear a categorías específicas de drops
  'drops': 'Drops',
  'drops-1': 'Drop 1',
  'drops-2': 'Drop 2', 
  'drops-3': 'Drop 3',
  // Ropa - mapear a categorías de ropa
  'ropa': 'Ropa',
  'ropa-AE': 'Camisas',
  'ropa-PT': 'Pantalones',
  'ropa-SD': 'Sudaderas',
  'ropa-CH': 'Chaquetas',
  // Accesorios - mapear a categorías de accesorios
  'accesorios': 'Accesorios',
  'accesorios-GR': 'Gorras',
  'accesorios-BG': 'Bolsos',
  'accesorios-JY': 'Joyería',
  // Calzado - mapear a categorías de calzado
  'calzado': 'Calzado',
  'calzado-SN': 'Zapatos',
  'calzado-CS': 'Casual',
  'calzado-BT': 'Botas',
}

export const getCategorySlugFromRoute = (category, subcategory = null) => {
  if (!category) return null
  
  const routeKey = subcategory ? `${category}-${subcategory}` : category
  return routeToSlugMapping[routeKey] || null
}

export const getProductCategoryFromRoute = (category, subcategory = null) => {
  if (!category) return null
  
  const routeKey = subcategory ? `${category}-${subcategory}` : category
  return headerToProductCategoryMapping[routeKey] || null
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