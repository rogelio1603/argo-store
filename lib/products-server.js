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

  // Helper function to get main product image from inventario data
  const getMainProductImage = (inventarioData) => {
    if (!inventarioData || !Array.isArray(inventarioData) || inventarioData.length === 0) {
      return `/api/placeholder/400/400?id=${strapiProduct.id}`
    }
    
    // Get first inventario item that has images
    const firstInventarioWithImages = inventarioData.find(item => 
      item.imagenes && Array.isArray(item.imagenes) && item.imagenes.length > 0
    )
    
    if (firstInventarioWithImages && firstInventarioWithImages.imagenes[0]?.url) {
      const imageUrl = firstInventarioWithImages.imagenes[0].url
      return imageUrl.startsWith('http') ? imageUrl : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${imageUrl}`
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

  // Helper function to process inventario with images and stock_por_talla
  const processInventarioData = (inventarioData) => {
    if (!inventarioData || !Array.isArray(inventarioData)) return []
    
    return inventarioData.map(inventarioItem => ({
      id: inventarioItem.id,
      // Process images for this inventario item
      imagenes: inventarioItem.imagenes?.map(img => ({
        id: img.id,
        documentId: img.documentId,
        url: img.url?.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${img.url}`,
        alternativeText: img.alternativeText || `${strapiProduct.nombre} - Variant`
      })) || [],
      // Process stock_por_talla for this inventario item
      stock_por_talla: inventarioItem.stock_por_talla?.map(stockTalla => ({
        id: stockTalla.id,
        stock: stockTalla.stock,
        talla: stockTalla.talla?.talla || stockTalla.talla, // Handle both nested and direct talla
        // Link back to the images of this inventario item
        imageIds: inventarioItem.imagenes?.map(img => img.id) || []
      })) || []
    }))
  }

  return {
    id: strapiProduct.id,
    documentId: strapiProduct.documentId,
    name: strapiProduct.nombre,
    slug: strapiProduct.slug,
    description: strapiProduct.descripcion,
    // Handle pricing logic correctly
    price: strapiProduct.descuento && strapiProduct.precio_descuento 
      ? strapiProduct.precio_descuento  // Use discounted price as current price
      : strapiProduct.precio,           // Use original price if no discount
    isOnSale: strapiProduct.descuento && strapiProduct.precio_descuento && strapiProduct.precio_descuento < strapiProduct.precio,
    originalPrice: strapiProduct.descuento && strapiProduct.precio_descuento 
      ? strapiProduct.precio          // Original price becomes "originalPrice" when on sale
      : null,                         // No original price if not on sale
    characteristics: strapiProduct.caracteristicas,
    createdAt: strapiProduct.createdAt,
    updatedAt: strapiProduct.updatedAt,
    publishedAt: strapiProduct.publishedAt,
    // Handle images from Strapi - use inventario images as priority, fallback to regular images
    image: getMainProductImage(strapiProduct.inventario) || getImageUrl(strapiProduct.imagen || strapiProduct.imagenes),
    images: getAllImages(strapiProduct.imagenes || strapiProduct.imagen),
    // Add category logic based on your Strapi structure
    category: strapiProduct.categoria?.nombre || strapiProduct.categoria || 'general',
    // Include full category information for URL generation
    categoria: strapiProduct.categoria, // Full category object
    categoria_nombre: strapiProduct.categoria?.nombre,
    categoria_slug: strapiProduct.categoria?.slug,
    categoria_global: strapiProduct.categoria?.categoria_global,
    // Add any other populated fields
    brand: strapiProduct.marca?.nombre || strapiProduct.marca,
    tags: strapiProduct.etiquetas || strapiProduct.tags || [],
    // Include new inventario structure
    inventario: processInventarioData(strapiProduct.inventario),
    // Keep backward compatibility
    stock_por_color_talla: processInventarioData(strapiProduct.inventario), // For compatibility
    discount: strapiProduct.descuento && strapiProduct.precio_descuento && strapiProduct.precio
      ? Math.floor(((strapiProduct.precio - strapiProduct.precio_descuento) / strapiProduct.precio) * 100) 
      : null
  }
}

// Server-side function - token is secure here
export const fetchProductsServer = async ({ page = 1, pageSize = 8, category = null } = {}) => {
  try {
    // Construir la URL base
    let url = `${STRAPI_URL}/api/productos?populate[inventario][populate][imagenes][fields][0]=url&populate[inventario][populate][stock_por_talla][populate][talla][fields][0]=talla&populate[inventario][fields]=*&populate[categoria][fields]=*`
    
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
    const response = await fetch(`${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}&populate[inventario][populate][imagenes][fields][0]=url&populate[inventario][populate][stock_por_talla][populate][talla][fields][0]=talla&populate[inventario][fields]=*&populate[categoria][fields]=*`, {
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