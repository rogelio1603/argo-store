// Testimonials API functions
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337'

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
    // const response = await fetch(`${STRAPI_URL}/api/testimonials?populate=*&sort=order:asc`, {
    //   headers: {
    //     'Authorization': `${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
    //   }
    // })
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