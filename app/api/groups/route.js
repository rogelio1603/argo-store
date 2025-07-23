import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'

export async function GET(request) {
  try {
    const strapiUrl = `${STRAPI_URL}/api/categorias?populate[imagenes_destacadas][fields][0]=url`
    
    const response = await fetch(strapiUrl, {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
      },
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      console.error('Strapi response not ok:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const strapiData = await response.json()
    
    if (!strapiData.data) {
      console.error('No data in Strapi response')
      return NextResponse.json({ data: [] })
    }
    
    // Transform basic data first
    const transformedCategories = strapiData.data.map(category => {
      return {
        id: category.id,
        name: category.nombre || 'Sin nombre',
        slug: category.slug || 'sin-slug',
        description: category.descripcion || '',
        featuredImages: category.imagenes_destacadas ? 
          category.imagenes_destacadas.map(img => ({
            id: img.id,
            url: img.url?.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`
          })) : []
      }
    })
    
    const finalResponse = {
      data: transformedCategories,
      meta: strapiData.meta || {}
    }
    
    return NextResponse.json(finalResponse)
  } catch (error) {
    console.error('Error in groups API:', error)
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 500 }
    )
  }
} 