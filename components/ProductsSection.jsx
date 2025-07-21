import { fetchProductsServer } from "@/lib/products-server"
import { ProductsInfiniteScroll } from "./ProductsInfiniteScroll"
import { ReloadButton } from "./ReloadButton"

// Loading skeleton component
function ProductsSkeleton() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Productos Destacados
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra selección de productos más populares y las últimas tendencias en moda urbana
          </p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-3 sm:p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Error component
function ProductsError({ error }) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Error al cargar productos
          </h2>
          <p className="text-red-600 mb-4">
            {error?.message || 'Hubo un problema al cargar los productos'}
          </p>
          <ReloadButton />
        </div>
      </div>
    </section>
  )
}

// React Server Component
export async function ProductsSection() {
  try {
    // Fetch initial data on the server
    const initialData = await fetchProductsServer({ page: 1, pageSize: 8 })
    console.log(initialData)
    
    return (
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Productos Destacados
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra selección de productos más populares y las últimas tendencias en moda urbana
            </p>
          </div>

          {/* Client Component for Infinite Scroll */}
          <ProductsInfiniteScroll 
            initialData={initialData.data} 
            initialMeta={initialData.meta} 
          />
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error in ProductsSection server component:', error)
    return <ProductsError error={error} />
  }
} 