"use client"

import * as React from "react"

const heroSlides = [
  {
    id: 1,
    backgroundImage: "/api/placeholder/1200/600"
  },
  {
    id: 2,
    backgroundImage: "/api/placeholder/1200/601"
  },
  {
    id: 3,
    backgroundImage: "/api/placeholder/1200/602"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 2000) // Auto-advance every 2 seconds

    return () => clearInterval(timer)
  }, [])

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
            Moda que Define tu{" "}
            <span className="text-red-500">
              Estilo
            </span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra colección exclusiva de ropa y accesorios
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-sm sm:text-lg transition-colors duration-300 transform hover:scale-105">
            Explorar Colección
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
              index === currentSlide ? 'bg-red-500' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
} 