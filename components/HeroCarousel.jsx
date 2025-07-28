"use client"

import { useEffect, useState } from "react"
import { useCategory } from "./CategoryContext"
import { Skeleton } from "@/components/ui/skeleton"

export function HeroCarousel({ categoriesData, categoryInfo = null }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { selectedCategory, getCurrentConfig, isConfigLoaded } = useCategory()
  
  // Use dynamic category info if available, otherwise fall back to config
  const getDynamicConfig = () => {
    if (categoryInfo) {
      const dynamicConfig = {
        title: categoryInfo.cabecera_seccion || categoryInfo.nombre || "Moda que Define tu Estilo",
        subtitle: categoryInfo.descripcion_seccion || categoryInfo.descripcion || "Descubre nuestra colección exclusiva",
        buttonText: "Explorar Colección",
        color: getColorFromCategory(categoryInfo.categoria_global || categoryInfo.nombre)
      }
      
      return dynamicConfig
    }
    
    return getCurrentConfig()
  }
  
  // Generate consistent color based on category name
  const getColorFromCategory = (categoryName) => {
    if (!categoryName) return 'red'
    
    const colors = ['red', 'orange', 'blue', 'purple', 'green']
    const hash = categoryName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }
  
  const config = getDynamicConfig()
  
  // Get hero slides from categories data
  const getHeroSlides = () => {
    if (!categoriesData || !Array.isArray(categoriesData)) {
      return [
        {
          id: 1,
          backgroundImage: "/api/placeholder/1200/600?type=fallback"
        }
      ]
    }

    // If we have categories with featured images, use them
    const slidesWithImages = categoriesData
      .filter(category => category.featuredImages && category.featuredImages.length > 0)
      .flatMap(category => 
        category.featuredImages.map((img, index) => ({
          id: `${category.id}-${index}`,
          backgroundImage: img.url,
          categoryName: category.name
        }))
      )

    // If no slides with images, return fallback
    if (slidesWithImages.length === 0) {
      return [
        {
          id: 1,
          backgroundImage: "/api/placeholder/1200/600?type=fallback"
        }
      ]
    }

    return slidesWithImages
  }

  const heroSlides = getHeroSlides()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [selectedCategory])

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 2000) // Auto-advance every 2 seconds

    return () => clearInterval(timer)
  }, [heroSlides.length])

  // Show skeleton while config is being loaded
  if (!isConfigLoaded) {
    return (
      <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-900 overflow-hidden">
        {/* Background skeleton */}
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content skeleton */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title skeleton */}
            <div className="mb-4 sm:mb-6">
              <Skeleton className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-64 sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] mx-auto bg-white/20" />
            </div>
            
            {/* Subtitle skeleton */}
            <div className="mb-6 sm:mb-8">
              <Skeleton className="h-4 sm:h-6 md:h-7 lg:h-8 w-48 sm:w-64 md:w-80 lg:w-96 mx-auto bg-white/20 mb-2" />
              <Skeleton className="h-4 sm:h-6 md:h-7 lg:h-8 w-56 sm:w-72 md:w-96 lg:w-[500px] mx-auto bg-white/20" />
            </div>
            
            {/* Button skeleton */}
            <Skeleton className="h-12 sm:h-16 w-32 sm:w-40 md:w-48 mx-auto bg-white/20 rounded-lg" />
          </div>
        </div>

        {/* Dots skeleton */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {[1, 2, 3].map((_, index) => (
            <Skeleton 
              key={index} 
              className="w-3 h-3 rounded-full bg-white/20" 
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-black overflow-hidden">
      {/* Background slides */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.backgroundImage})`
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            {config.title.split(' ').map((word, index) => {
              const isLastWord = index === config.title.split(' ').length - 1;
              const colorClass = config.color === 'red' ? 'text-red-500' : 
                                 config.color === 'orange' ? 'text-orange-500' : 
                                 config.color === 'blue' ? 'text-blue-500' : 
                                 config.color === 'purple' ? 'text-purple-500' : 
                                 config.color === 'green' ? 'text-green-500' : 'text-red-500';
              
              return (
                <span key={index} className={isLastWord ? colorClass : ''}>
                  {word}{index < config.title.split(' ').length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
          <button 
            onClick={() => {
              const productosSection = document.getElementById('productos-destacados');
              if (productosSection) {
                productosSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
            className={`bg-${config.color}-500 hover:bg-${config.color}-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-sm sm:text-lg transition-colors duration-300 transform hover:scale-105 cursor-pointer`}
            style={{
              backgroundColor: config.color === 'red' ? '#ef4444' : 
                              config.color === 'orange' ? '#f97316' : 
                              config.color === 'blue' ? '#3b82f6' : 
                              config.color === 'purple' ? '#8b5cf6' : 
                              config.color === 'green' ? '#22c55e' : '#ef4444'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = config.color === 'red' ? '#dc2626' : 
                                               config.color === 'orange' ? '#ea580c' : 
                                               config.color === 'blue' ? '#2563eb' : 
                                               config.color === 'purple' ? '#7c3aed' : 
                                               config.color === 'green' ? '#16a34a' : '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = config.color === 'red' ? '#ef4444' : 
                                               config.color === 'orange' ? '#f97316' : 
                                               config.color === 'blue' ? '#3b82f6' : 
                                               config.color === 'purple' ? '#8b5cf6' : 
                                               config.color === 'green' ? '#22c55e' : '#ef4444';
            }}
          >
            {config.buttonText}
          </button>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? '' : 'bg-white/50 hover:bg-white/70'
            }`}
            style={{
              backgroundColor: index === currentSlide ? 
                (config.color === 'red' ? '#ef4444' : 
                 config.color === 'orange' ? '#f97316' : 
                 config.color === 'blue' ? '#3b82f6' : 
                 config.color === 'purple' ? '#8b5cf6' : 
                 config.color === 'green' ? '#22c55e' : '#ef4444') : undefined
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
} 