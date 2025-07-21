"use client"

import * as React from "react"
import { useCategory } from "./CategoryContext"

const heroSlidesData = {
  all: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=fashion1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=fashion2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=fashion3"
    }
  ],
  drops: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=drops1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=drops2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=drops3"
    }
  ],
  ropa: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=clothing1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=clothing2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=clothing3"
    }
  ],
  accesorios: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=accessories1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=accessories2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=accessories3"
    }
  ],
  calzado: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=shoes1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=shoes2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=shoes3"
    }
  ]
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const { selectedCategory, getCurrentConfig } = useCategory()
  
  const config = getCurrentConfig()
  const heroSlides = heroSlidesData[selectedCategory] || heroSlidesData.all

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  // Reset slide when category changes
  React.useEffect(() => {
    setCurrentSlide(0)
  }, [selectedCategory])

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 2000) // Auto-advance every 2 seconds

    return () => clearInterval(timer)
  }, [heroSlides.length])

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