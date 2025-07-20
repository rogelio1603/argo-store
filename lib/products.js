// Client-side Products API functions - uses secure API routes

export const fetchProducts = async ({ pageParam = 1, pageSize = 8 }) => {
  try {
    // Use our secure API route instead of direct Strapi calls
    const response = await fetch(`/api/products?page=${pageParam}&pageSize=${pageSize}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

export const fetchFeaturedProducts = async () => {
  try {
    // Use our secure API route instead of direct Strapi calls
    const response = await fetch(`/api/products?page=1&pageSize=8`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw new Error('Failed to fetch featured products')
  }
}

export const fetchProductBySlug = async (slug) => {
  try {
    // Use our secure API route instead of direct Strapi calls
    const response = await fetch(`/api/products/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw new Error('Failed to fetch product')
  }
} 