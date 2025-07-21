import { ProductDetailPage } from "@/components/ProductDetailPage"
import { fetchProductBySlugServer } from "@/lib/products-server"
import { notFound } from 'next/navigation'

export default async function DropsProductPage({ params }) {
  const { slug } = await params
  
  try {
    const productData = await fetchProductBySlugServer(slug)
    
    if (!productData?.data) {
      notFound()
    }

    return <ProductDetailPage product={productData.data} />
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params
  
  try {
    const productData = await fetchProductBySlugServer(slug)
    const product = productData?.data
    
    if (!product) {
      return {
        title: 'Producto no encontrado',
      }
    }

    return {
      title: `${product.name} - Drops - ArgoStore`,
      description: product.description || `Compra ${product.name} en ArgoStore`,
      openGraph: {
        title: `${product.name} - Drops - ArgoStore`,
        description: product.description || `Compra ${product.name} en ArgoStore`,
        images: product.images?.length > 0 ? [product.images[0].url] : [product.image],
      },
    }
  } catch (error) {
    return {
      title: 'Producto - ArgoStore',
    }
  }
} 