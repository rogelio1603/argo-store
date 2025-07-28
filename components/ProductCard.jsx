"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ShoppingCartIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { generateProductUrl } from "@/lib/product-utils"

export function ProductCard({ product }) {
  const {
    id,
    name,
    slug,
    price,
    originalPrice,
    image,
    images,
    isOnSale,
    discount
  } = product

  // Generate the correct product URL using intelligent categorization
  const productUrl = generateProductUrl(product)

  // Prepare images for carousel - use product images or fallback to main image
  const productImages = useMemo(() => {
    if (images && images.length > 0) {
      return images
    }
    // Fallback to main image if no images array
    return [{ url: image, alternativeText: name }]
  }, [images, image, name])

  // Only show carousel if there are multiple images
  const hasMultipleImages = productImages.length > 1



  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 group">
        {isOnSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded z-20">
            OFERTA
          </div>
        )}
        
        {hasMultipleImages ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {productImages.map((img, index) => (
                <CarouselItem key={index}>
                  <Link href={productUrl} className="block w-full h-full">
                    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
                      <img
                        src={img.url}
                        alt={img.alternativeText || `${name} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation buttons - only visible on card hover and when not disabled */}
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:group-hover:opacity-0 transition-opacity duration-300 z-10 h-8 w-8 bg-white/80 hover:bg-white border-0 shadow-md [&>svg]:text-gray-700" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:group-hover:opacity-0 transition-opacity duration-300 z-10 h-8 w-8 bg-white/80 hover:bg-white border-0 shadow-md [&>svg]:text-gray-700" />
          </Carousel>
        ) : (
          <Link href={productUrl} className="block w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title with tooltip */}
        <div className="mb-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2 cursor-default">
                {name}
              </h3>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-grow">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs sm:text-sm text-red-500 font-semibold">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 