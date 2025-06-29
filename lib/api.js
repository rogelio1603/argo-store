// Mock API functions - replace with actual Strapi endpoints
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

// Mock data generator for demonstration
const generateMockProducts = (page, pageSize = 8) => {
  const startId = (page - 1) * pageSize + 1
  const products = []
  
  const productTypes = [
    'Camiseta Premium', 'Cartera de Cuero', 'Jeans Clásicos', 'Reloj Deportivo',
    'Sudadera con Capucha', 'Zapatillas Urbanas', 'Gorra Snapback', 'Mochila Vintage',
    'Chaqueta Denim', 'Pantalón Cargo', 'Bufanda de Lana', 'Cinturón de Cuero'
  ]
  
  for (let i = 0; i < pageSize; i++) {
    const id = startId + i
    const typeIndex = (id - 1) % productTypes.length
    const isOnSale = Math.random() > 0.5
    const basePrice = Math.floor(Math.random() * 150) + 20
    const originalPrice = isOnSale ? basePrice + Math.floor(Math.random() * 50) + 10 : null
    
    products.push({
      id,
      name: `${productTypes[typeIndex]} ${id}`,
      price: basePrice,
      originalPrice,
      image: `/api/placeholder/400/400?id=${id}`,
      isOnSale,
      discount: isOnSale ? Math.floor(((originalPrice - basePrice) / originalPrice) * 100) : null,
      category: productTypes[typeIndex].split(' ')[0].toLowerCase(),
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    })
  }
  
  return products
}

export const fetchProducts = async ({ pageParam = 1, pageSize = 8 }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    // In a real app, this would be:
    // const response = await fetch(`${STRAPI_URL}/api/products?pagination[page]=${pageParam}&pagination[pageSize]=${pageSize}&populate=*`)
    // const data = await response.json()
    
    // Mock response structure similar to Strapi
    const products = generateMockProducts(pageParam, pageSize)
    const totalProducts = 100 // Mock total count
    const totalPages = Math.ceil(totalProducts / pageSize)
    
    return {
      data: products,
      meta: {
        pagination: {
          page: pageParam,
          pageSize,
          pageCount: totalPages,
          total: totalProducts,
        }
      }
    }
  } catch (error) {
    throw new Error('Failed to fetch products')
  }
}

export const fetchFeaturedProducts = async () => {
  // Mock featured products
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    data: generateMockProducts(1, 8),
    meta: {
      pagination: {
        page: 1,
        pageSize: 8,
        pageCount: 1,
        total: 8,
      }
    }
  }
}

// Mock testimonial images generator
const generateMockTestimonials = () => {
  return [
    {
      id: 1,
      image: '/api/placeholder/400/500?testimonial=1',
      alt: 'Testimonio de cliente satisfecho 1',
      order: 1
    },
    {
      id: 2,
      image: '/api/placeholder/400/500?testimonial=2',
      alt: 'Testimonio de cliente satisfecho 2',
      order: 2
    },
    {
      id: 3,
      image: '/api/placeholder/400/500?testimonial=3',
      alt: 'Testimonio de cliente satisfecho 3',
      order: 3
    },
    {
      id: 4,
      image: '/api/placeholder/400/500?testimonial=4',
      alt: 'Testimonio de cliente satisfecho 4',
      order: 4
    },
    {
      id: 5,
      image: '/api/placeholder/400/500?testimonial=5',
      alt: 'Testimonio de cliente satisfecho 5',
      order: 5
    },
    {
      id: 6,
      image: '/api/placeholder/400/500?testimonial=6',
      alt: 'Testimonio de cliente satisfecho 6',
      order: 6
    },
    {
      id: 7,
      image: '/api/placeholder/400/500?testimonial=7',
      alt: 'Testimonio de cliente satisfecho 7',
      order: 7
    },
    {
      id: 8,
      image: '/api/placeholder/400/500?testimonial=8',
      alt: 'Testimonio de cliente satisfecho 8',
      order: 8
    }
  ]
}

export const fetchTestimonials = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  try {
    // In a real app, this would be:
    // const response = await fetch(`${STRAPI_URL}/api/testimonials?populate=*&sort=order:asc`)
    // const data = await response.json()
    // return {
    //   data: data.data.map(item => ({
    //     id: item.id,
    //     image: `${STRAPI_URL}${item.attributes.image.data.attributes.url}`,
    //     alt: item.attributes.alt || 'Testimonio de cliente',
    //     order: item.attributes.order
    //   }))
    // }
    
    // Mock response structure similar to Strapi
    const testimonials = generateMockTestimonials()
    
    return {
      data: testimonials
    }
  } catch (error) {
    throw new Error('Failed to fetch testimonials')
  }
} 