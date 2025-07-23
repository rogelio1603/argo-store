// Server-side Products API functions - for React Server Components
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'

// Transform Strapi product data to match the expected format
const transformProductData = (strapiProduct) => {
  // Helper function to get image URL from Strapi media
  const getImageUrl = (imageData) => {
    if (!imageData) return `/api/placeholder/400/400?id=${strapiProduct.id}`
    
    // Handle both single image and array of images
    const image = Array.isArray(imageData) ? imageData[0] : imageData
    
    if (image?.url) {
      // If URL is relative, prepend STRAPI_URL
      return image.url.startsWith('http') ? image.url : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${image.url}`
    }
    
    return `/api/placeholder/400/400?id=${strapiProduct.id}`
  }
  
  // Helper function to get all images
  const getAllImages = (imageData) => {
    if (!imageData) return []
    
    const images = Array.isArray(imageData) ? imageData : [imageData]
    return images.map(img => ({
      id: img.id,
      url: img.url?.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${img.url}`,
      alternativeText: img.alternativeText || strapiProduct.nombre,
      width: img.width,
      height: img.height,
      formats: img.formats
    })).filter(img => img.url && !img.url.includes('undefined'))
  }

  return {
    id: strapiProduct.id,
    documentId: strapiProduct.documentId,
    name: strapiProduct.nombre,
    slug: strapiProduct.slug,
    description: strapiProduct.descripcion,
    price: strapiProduct.precio,
    isOnSale: strapiProduct.descuento,
    originalPrice: strapiProduct.precio_descuento,
    characteristics: strapiProduct.caracteristicas,
    createdAt: strapiProduct.createdAt,
    updatedAt: strapiProduct.updatedAt,
    publishedAt: strapiProduct.publishedAt,
    // Handle images from Strapi
    image: getImageUrl(strapiProduct.imagen || strapiProduct.imagenes),
    images: getAllImages(strapiProduct.imagenes || strapiProduct.imagen),
    // Add category logic based on your Strapi structure
    category: strapiProduct.categoria?.nombre || strapiProduct.categoria || 'general',
    // Add any other populated fields
    brand: strapiProduct.marca?.nombre || strapiProduct.marca,
    tags: strapiProduct.etiquetas || strapiProduct.tags || [],
    // Include stock information
    stock_por_color_talla: strapiProduct.stock_por_color_talla || [],
    discount: strapiProduct.descuento && strapiProduct.precio_descuento 
      ? Math.floor(((strapiProduct.precio_descuento - strapiProduct.precio) / strapiProduct.precio_descuento) * 100) 
      : null
  }
}

// Server-side function - token is secure here
export const fetchProductsServer = async ({ page = 1, pageSize = 8, category = null } = {}) => {
  try {
    // Construir la URL base
    let url = `${STRAPI_URL}/api/productos?populate[imagenes][fields][0]=url&populate[stock_por_color_talla][fields][0]=color&populate[stock_por_color_talla][fields]=*&populate[categoria][fields][0]=nombre`
    
    // Agregar filtro por categoría si se especifica
    if (category) {
      url += `&filters[categoria][nombre][$eq]=${encodeURIComponent(category)}`
    }
    
    // Agregar paginación
    url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
      },
      // Add cache options for Next.js
      next: { 
        revalidate: 300 // Revalidate every 5 minutes
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform Strapi data to match expected format
    const transformedProducts = data.data.map(transformProductData)
    
    return {
      data: transformedProducts,
      meta: data.meta
    }
  } catch (error) {
    console.error('Error fetching products on server:', error)
    throw new Error('Failed to fetch products')
  }
}

// Server-side function to fetch product by slug
export const fetchProductBySlugServer = async (slug) => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}&populate=*`, {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
      },
      // Add cache options for Next.js
      next: { 
        revalidate: 300 // Revalidate every 5 minutes
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.data.length === 0) {
      throw new Error('Product not found')
    }
    
    // Transform Strapi data to match expected format
    const transformedProduct = transformProductData(data.data[0])
    
    return {
      data: transformedProduct
    }
  } catch (error) {
    console.error('Error fetching product by slug on server:', error)
    throw new Error('Failed to fetch product')
  }
}