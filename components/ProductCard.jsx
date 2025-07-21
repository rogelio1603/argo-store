"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { generateProductUrl } from "@/lib/product-utils"

export function ProductCard({ product }) {
  const {
    id,
    name,
    slug,
    price,
    originalPrice,
    image,
    isOnSale,
    discount
  } = product

  // Generate the correct product URL using intelligent categorization
  const productUrl = generateProductUrl(product)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
      {/* Product Image */}
      <Link href={productUrl} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
          {isOnSale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded z-10">
              OFERTA
            </div>
          )}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

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
        <div className="flex items-center space-x-1 sm:space-x-2 mb-3 sm:mb-4 flex-grow">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            ${price}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
              <span className="text-xs sm:text-sm text-red-500 font-semibold">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-black text-white py-2 px-3 sm:px-4 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center justify-center space-x-2 group/button text-xs sm:text-sm mt-auto cursor-pointer">
          <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 group-hover/button:scale-110 transition-transform duration-200" />
          <span>Agregar al Carrito</span>
        </button>
      </div>
    </div>
  )
} 