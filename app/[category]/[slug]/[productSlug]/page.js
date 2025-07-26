import { ProductDetailPage } from "@/components/ProductDetailPage"
import { fetchProductBySlugServer } from "@/lib/products-server"
import { fetchCategoriesServer } from "@/lib/categories-server"
import { isValidCategoryRoute, getSubcategoriesForCategory } from "@/lib/dynamic-routes"
import { notFound } from 'next/navigation'

export default async function UniversalProductPage({ params }) {
  const { category, slug, productSlug } = await params
  
  // Verificar si la categoría es válida
  const isValidCategory = await isValidCategoryRoute(category)
  
  if (!isValidCategory) {
    notFound()
  }
  
  // Verificar si la subcategoría existe
  const subcategories = await getSubcategoriesForCategory(category)
  const subcategoryExists = subcategories.some(sub => sub.slug === slug)
  
  if (!subcategoryExists) {
    notFound()
  }
  
  try {
    // Obtener producto y categorías en paralelo
    const [productData, categoriesData] = await Promise.all([
      fetchProductBySlugServer(productSlug),
      fetchCategoriesServer({ pageSize: 100 })
    ])
    
    if (!productData?.data) {
      notFound()
    }

    const categories = categoriesData?.data || []

    return <ProductDetailPage product={productData.data} categories={categories} />
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { category, productSlug } = await params
  
  try {
    const productData = await fetchProductBySlugServer(productSlug)
    const product = productData?.data
    
    if (!product) {
      return {
        title: 'Producto no encontrado',
      }
    }

    // Capitalizar la primera letra de la categoría para el título
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')

    return {
      title: `${product.name} - ${categoryTitle} - ArgoStore`,
      description: product.description || `Compra ${product.name} en ArgoStore`,
      openGraph: {
        title: `${product.name} - ${categoryTitle} - ArgoStore`,
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