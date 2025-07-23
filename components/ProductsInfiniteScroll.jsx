"use client"

import * as React from "react"
import { useInfiniteQuery } from '@tanstack/react-query'
import { ProductCard } from "./ProductCard"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { fetchProducts } from "@/lib/products"
import { LoaderIcon } from "lucide-react"

export function ProductsInfiniteScroll({ initialData, initialMeta, category = null }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['products', category],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam, category }),
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination
      return page < pageCount ? page + 1 : undefined
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Initialize with server data
    initialData: {
      pages: [{ data: initialData, meta: initialMeta }],
      pageParams: [1]
    }
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

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          {error?.message || 'Hubo un problema al cargar más productos'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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
    </>
  )
} 