"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { HeartIcon, UsersIcon, TrophyIcon, TruckIcon, Heart, Award } from "lucide-react"
import { TestimonialsSection } from "./TestimonialsSection"
import { WholesaleSection } from "./WholesaleSection"
import { LocationSection } from "./LocationSection"
import { fetchAboutUsServer } from "@/lib/about-us-server"

const stats = [
  {
    icon: UsersIcon,
    number: "50,000+",
    label: "Clientes Satisfechos",
    color: "text-red-500",
    ariaLabel: "Clientes Satisfechos"
  },
  {
    icon: TrophyIcon,
    number: "15+",
    label: "Años de Experiencia",
    color: "text-red-500",
    ariaLabel: "Años de Experiencia"
  },
  {
    icon: HeartIcon,
    number: "1,000+",
    label: "Productos Únicos",
    color: "text-red-500",
    ariaLabel: "Productos Únicos"
  },
  {
    icon: TruckIcon,
    number: "100,000+",
    label: "Envíos Realizados",
    color: "text-red-500",
    ariaLabel: "Envíos Realizados"
  }
]

// CLIENT COMPONENT
export function AboutUsSection({ aboutUs }) {
  return (
    <>
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Image */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-pink-100">
                {/* Heart icon in top right corner - positioned inside */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 rounded-full p-3 shadow-lg animate-bounce" style={{
                    animationDuration: '2s'
                  }}>
                    <Heart className="h-6 w-6 text-white" aria-label="Heart" role="img" />
                  </div>
                </div>
                
                {/* User icon in bottom left corner - positioned inside */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-black rounded-full p-3 shadow-lg">
                    <Award className="w-6 h-6 text-white" aria-label="Award" role="img" />
                  </div>
                </div>
                
                {/* Background image */}
                <Image
                  src={aboutUs?.argoImagen || "/api/placeholder/600/750"}
                  alt="Nuestra Historia - ArgoStore"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Nuestra <span className="text-red-500">Historia</span>
                  </h1>
                  
                  <motion.div 
                    className="space-y-4 text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <p>
                      ArgoStore nació en 2009 con una visión clara: democratizar la moda de 
                      alta calidad y hacer que el estilo sea accesible para todos.
                    </p>
                    
                    <p>
                      Comenzamos como una pequeña boutique en el corazón de la Ciudad 
                      de México, con el sueño de ofrecer piezas únicas que reflejaran la 
                      personalidad de cada cliente.
                    </p>
                    
                    <p>
                      Hoy, más de 15 años después, nos hemos convertido en una de las 
                      tiendas de moda online más reconocidas de México. Nuestro 
                      compromiso sigue siendo el mismo: ofrecer productos de calidad 
                      excepcional, un servicio al cliente incomparable y una experiencia de 
                      compra que inspire confianza y satisfacción.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center bg-gray-50 p-6 rounded-xl"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: "easeOut", 
                        delay: 0.6 + (index * 0.1) 
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <div className="flex justify-center mb-3">
                        <div className="bg-red-50 rounded-full p-3">
                          <stat.icon className={`h-6 w-6 ${stat.color}`} aria-label={stat.ariaLabel} role="img" />
                        </div>
                      </div>
                      <div className="font-bold text-2xl text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <TestimonialsSection testimonios={aboutUs?.testimonios || []} />
      {/* Wholesale Section */}
      <WholesaleSection />
      {/* Location Section */}
      <LocationSection />
    </>
  )
}

// SERVER COMPONENT
export async function AboutUsSectionServer() {
  const { data } = await fetchAboutUsServer()
  return <AboutUsSection aboutUs={data} />
} 