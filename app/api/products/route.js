import { NextResponse } from 'next/server'

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
    discount: strapiProduct.descuento && strapiProduct.precio_descuento 
      ? Math.floor(((strapiProduct.precio_descuento - strapiProduct.precio) / strapiProduct.precio_descuento) * 100) 
      : null
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '8'

    const response = await fetch(`${STRAPI_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true&populate=*`, {
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
    
    return NextResponse.json({
      data: transformedProducts,
      meta: data.meta
    })
  } catch (error) {
    console.error('Error fetching products in API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 