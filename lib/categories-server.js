// Server-side Categories API functions - for React Server Components
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'

// Transform Strapi category data to match the expected format
const transformCategoryData = (strapiCategory) => {
  // Helper function to get featured images
  const getFeaturedImages = (imagenesDestacadas) => {
    if (!imagenesDestacadas || !Array.isArray(imagenesDestacadas)) return []
    
    return imagenesDestacadas.map(img => ({
      id: img.id,
      url: img.url?.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${img.url}`,
      alternativeText: img.alternativeText || strapiCategory.nombre,
      width: img.width,
      height: img.height,
      formats: img.formats
    })).filter(img => img.url && !img.url.includes('undefined'))
  }

  // Helper function to get main image URL
  const getMainImageUrl = (imagenesDestacadas) => {
    if (!imagenesDestacadas || !Array.isArray(imagenesDestacadas) || imagenesDestacadas.length === 0) {
      return `/api/placeholder/400/400?id=${strapiCategory.id}`
    }
    
    const firstImage = imagenesDestacadas[0]
    if (firstImage?.url) {
      return firstImage.url.startsWith('http') ? firstImage.url : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${firstImage.url}`
    }
    
    return `/api/placeholder/400/400?id=${strapiCategory.id}`
  }

  return {
    id: strapiCategory.id,
    documentId: strapiCategory.documentId,
    name: strapiCategory.nombre,
    nombre: strapiCategory.nombre, // Keep original name for compatibility
    slug: strapiCategory.slug,
    description: strapiCategory.descripcion,
    descripcion: strapiCategory.descripcion, // Keep original description
    descripcion_menu: strapiCategory.descripcion_menu,
    descripcion_seccion: strapiCategory.descripcion_seccion, // Section description for hero
    cabecera_seccion: strapiCategory.cabecera_seccion, // Section header for hero
    categoria_global: strapiCategory.categoria_global,
    createdAt: strapiCategory.createdAt,
    updatedAt: strapiCategory.updatedAt,
    publishedAt: strapiCategory.publishedAt,
    // Handle featured images from Strapi
    image: getMainImageUrl(strapiCategory.imagenes_destacadas),
    images: getFeaturedImages(strapiCategory.imagenes_destacadas),
    featuredImages: getFeaturedImages(strapiCategory.imagenes_destacadas)
  }
}

// Server-side function - token is secure here
export const fetchCategoriesServer = async ({ page = 1, pageSize = 8 } = {}) => {
  try {
    const strapiUrl = `${STRAPI_URL}/api/categorias?pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true&populate=*`
    
    // Headers de la petición
    const headers = {}
    if (process.env.NEXT_PUBLIC_STRAPI_TOKEN) {
      headers['Authorization'] = process.env.NEXT_PUBLIC_STRAPI_TOKEN
    }
    
    const response = await fetch(strapiUrl, {
      headers,
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      console.error('Strapi response not ok:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (!data.data) {
      console.error('No data in Strapi response')
      return { data: [] }
    }
    
    // Transform Strapi data to match expected format
    const transformedCategories = data.data.map(transformCategoryData)
    
    return {
      data: transformedCategories,
      meta: data.meta
    }
  } catch (error) {
    console.error('Error fetching categories on server:', error)
    throw new Error('Failed to fetch categories')
  }
} 