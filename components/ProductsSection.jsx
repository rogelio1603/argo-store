"use client"

import * as React from "react"
import { useInfiniteQuery } from '@tanstack/react-query'
import { ProductCard } from "./ProductCard"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { fetchProducts } from "@/lib/api"
import { LoaderIcon } from "lucide-react"
import { useCategory } from "./CategoryContext"

export function ProductsSection() {
  const { selectedCategory, selectedSubcategory, getCurrentConfig } = useCategory()
  const config = getCurrentConfig()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, selectedSubcategory],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam, category: selectedCategory, subcategory: selectedSubcategory }),
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination
      return page < pageCount ? page + 1 : undefined
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Intersection observer for infinite scrolling
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  })

  // Trigger fetch when intersection observer detects the target
  React.useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten all pages into a single array of products
  const allProducts = data?.pages.flatMap(page => page.data) || []

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {config.sectionTitle}
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {config.sectionSubtitle}
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 auto-rows-fr">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-full flex flex-col">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (isError) {
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
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {config.sectionTitle}
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {config.sectionSubtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 auto-rows-fr">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-8">
            <LoaderIcon className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Cargando más productos...</span>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={targetRef} className="h-10 flex justify-center items-center">
          {hasNextPage && !isFetchingNextPage && (
            <div className="text-gray-500 text-sm">
              Desplázate hacia abajo para cargar más productos
            </div>
          )}
        </div>

        {/* End of products message */}
        {!hasNextPage && allProducts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Has visto todos nuestros productos destacados
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold text-sm"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </section>
  )
} 