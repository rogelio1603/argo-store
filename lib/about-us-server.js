const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'

// Transforma la data de Strapi para About Us
const transformAboutUsData = (strapiData) => {
  const argoImagen = strapiData.argo_imagen?.url
    ? (strapiData.argo_imagen.url.startsWith('http')
        ? strapiData.argo_imagen.url
        : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${strapiData.argo_imagen.url}`)
    : null

  const testimonios = Array.isArray(strapiData.testimonios)
    ? strapiData.testimonios
        .map(img => img.url ? (img.url.startsWith('http')
          ? img.url
          : `${process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'}${img.url}`) : null)
        .filter(Boolean)
    : []

  return {
    argoImagen,
    testimonios
  }
}

// Server-side function para obtener About Us
export const fetchAboutUsServer = async () => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/sobre-argos?populate[argo_imagen][fields][0]=url&populate[testimonios][fields][0]=url`, {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
      },
      next: { revalidate: 300 }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const aboutUs = data.data?.attributes ? transformAboutUsData(data.data.attributes) : null
    return { data: aboutUs }
  } catch (error) {
    console.error('Error fetching About Us:', error)
    throw new Error('Failed to fetch About Us')
  }
}
