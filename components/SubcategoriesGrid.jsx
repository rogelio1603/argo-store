"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useCategory } from "./CategoryContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function SubcategoriesGrid() {
  const { selectedCategory, getSubcategoriesList, getCurrentConfig } = useCategory()
  const subcategories = getSubcategoriesList()
  const config = getCurrentConfig()

  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explora Nuestras{" "}
            <span 
              className={`text-${config.color}-500`}
              style={{
                color: config.color === 'red' ? '#ef4444' : 
                       config.color === 'orange' ? '#f97316' : 
                       config.color === 'blue' ? '#3b82f6' : 
                       config.color === 'purple' ? '#8b5cf6' : 
                       config.color === 'green' ? '#22c55e' : '#ef4444'
              }}
            >
              Colecciones
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cada una de nuestras colecciones especializadas
          </p>
        </motion.div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut", 
                delay: index * 0.1 
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link 
                href={`/${selectedCategory}/${subcategory.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Featured Badge */}
                    {subcategory.featured && (
                      <div 
                        className={`absolute top-4 left-4 bg-${config.color}-500 text-white px-3 py-1 rounded-full text-sm font-semibold`}
                        style={{
                          backgroundColor: config.color === 'red' ? '#ef4444' : 
                                         config.color === 'orange' ? '#f97316' : 
                                         config.color === 'blue' ? '#3b82f6' : 
                                         config.color === 'purple' ? '#8b5cf6' : 
                                         config.color === 'green' ? '#22c55e' : '#ef4444'
                        }}
                      >
                        Destacado
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title with tooltip */}
                    <div className="mb-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2 cursor-default">
                            {subcategory.name}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{subcategory.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {subcategory.description}
                    </p>
                    
                    {/* Product Examples */}
                    <div className="space-y-2 flex-grow">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Incluye:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {subcategory.products?.slice(0, 3).map((product, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full line-clamp-1"
                          >
                            {product}
                          </span>
                        ))}
                        {subcategory.products?.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{subcategory.products.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-between mt-4 mt-auto pt-2">
                      <span 
                        className={`text-${config.color}-600 font-semibold text-sm`}
                        style={{
                          color: config.color === 'red' ? '#dc2626' : 
                                 config.color === 'orange' ? '#ea580c' : 
                                 config.color === 'blue' ? '#2563eb' : 
                                 config.color === 'purple' ? '#7c3aed' : 
                                 config.color === 'green' ? '#16a34a' : '#dc2626'
                        }}
                      >
                        Ver Colección
                      </span>
                      <svg 
                        className={`w-4 h-4 text-${config.color}-600 group-hover:translate-x-1 transition-transform`}
                        style={{
                          color: config.color === 'red' ? '#dc2626' : 
                                 config.color === 'orange' ? '#ea580c' : 
                                 config.color === 'blue' ? '#2563eb' : 
                                 config.color === 'purple' ? '#7c3aed' : 
                                 config.color === 'green' ? '#16a34a' : '#dc2626'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 