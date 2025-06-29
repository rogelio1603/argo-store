"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPinIcon, ClockIcon, PhoneIcon, MailIcon, UsersIcon } from "lucide-react"

export function LocationSection() {
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const [mapError, setMapError] = React.useState(false)

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Nuestra <span className="text-red-500">Ubicación</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Map Section */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.172863670823!2d-103.31688232308757!3d20.662545100252768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b38e595f0793%3A0x78511f9ae44e1e4d!2sARGO%20shop!5e0!3m2!1ses!2sus!4v1751182713359!5m2!1ses!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="ArgoStore"
                onLoad={() => {
                  setMapLoaded(true)
                  setMapError(false)
                }}
                onError={() => {
                  setMapLoaded(false)
                  setMapError(true)
                }}
              />
              
              {/* Loading state */}
              {!mapLoaded && !mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando mapa...</p>
                  </div>
                </div>
              )}
              
              {/* Fallback for when iframe fails to load */}
              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se pudo cargar el mapa</p>
                    <p className="text-sm text-gray-400 mb-4">Motolinia 156-C, Guadalajara</p>
                    <button
                      onClick={() => {
                        setMapError(false)
                        setMapLoaded(false)
                        // Force iframe reload by changing src
                        const iframe = document.querySelector('iframe[title="ArgoStore"]')
                        if (iframe) {
                          const src = iframe.src
                          iframe.src = ''
                          setTimeout(() => iframe.src = src, 100)
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Information Section */}
          <motion.div 
            className="order-1 lg:order-2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Visitors Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                <UsersIcon className="h-6 w-6 text-red-500 mr-3" />
                Visitanos
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Te invitamos a conocer nuestro showroom en el corazón de la Guadalajara. Aquí 
                podrás ver y tocar nuestros productos antes de comprar.
              </p>
            </motion.div>

            {/* Address */}
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <MapPinIcon className="h-5 w-5 text-red-500 mr-2" />
                Dirección
              </h4>
              <div className="text-gray-600 space-y-0.5 leading-snug">
                <p>Motolinia 156-C, zona del vestir Medrano</p>
                <p>Guadalajara, Jalisco, 44800</p>
                <p>México</p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <ClockIcon className="h-5 w-5 text-red-500 mr-2" />
                Horarios
              </h4>
              <div className="text-gray-600 space-y-1.5 leading-snug">
                <div className="flex justify-between">
                  <span>Lunes - Sábado:</span>
                  <span className="font-medium">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Contacto
              </h4>
              <div className="flex flex-col space-y-2.5 md:flex-row md:gap-12 md:space-y-0">
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium leading-tight">Teléfono:</p>
                    <a 
                      href="tel:+523330243550" 
                      className="text-red-500 hover:text-red-600 transition-colors leading-tight"
                    >
                      +52 33 3074 3550
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MailIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium leading-tight">Email:</p>
                    <a 
                      href="mailto:argo.store@gmail.com" 
                      className="text-red-500 hover:text-red-600 transition-colors leading-tight"
                    >
                      argo.store@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <a
                href="https://www.google.com/maps/dir//Motolinia+156-C,+Zona+Centro,+44100+Guadalajara,+Jal./@20.6769598,-103.3918217,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                Cómo Llegar
              </a>
              <a
                href="tel:+523330243550"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                Llamar Ahora
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 