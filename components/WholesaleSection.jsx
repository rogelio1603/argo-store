"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { PercentIcon, PackageIcon, TruckIcon, HeadphonesIcon, CreditCardIcon, StarIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react"

const benefits = [
  {
    icon: PercentIcon,
    title: "Descuentos Especiales",
    description: "Hasta 40% de descuento en compras mayoristas según volumen",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: PackageIcon,
    title: "Pedidos Mínimos Flexibles",
    description: "Desde 50 piezas para acceder a precios mayoristas",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: TruckIcon,
    title: "Envío Gratuito",
    description: "Envío sin costo en pedidos mayoristas a nivel nacional",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: HeadphonesIcon,
    title: "Asesor Dedicado",
    description: "Ejecutivo de ventas exclusivo para tu cuenta mayorista",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: CreditCardIcon,
    title: "Términos de Pago",
    description: "Facilidades de pago y crédito para clientes frecuentes",
    color: "bg-red-50 text-red-600"
  },
  {
    icon: StarIcon,
    title: "Productos Exclusivos",
    description: "Acceso prioritario a nuevas colecciones y productos limitados",
    color: "bg-indigo-50 text-indigo-600"
  }
]

export function WholesaleSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            ¿Eres <span className="text-red-500">Mayorista</span>?
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Únete a nuestra red de socios mayoristas y accede a precios especiales, 
            beneficios exclusivos y un servicio personalizado para hacer crecer tu negocio.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ 
                duration: 0.4, 
                ease: "easeOut", 
                delay: 0.4 + (index * 0.05) 
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-xl ${benefit.color}`}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="bg-gray-50 rounded-3xl p-8 lg:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h3 
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            ¿Listo para comenzar?
          </motion.h3>
          <motion.p 
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Contáctanos hoy mismo y descubre cómo podemos ayudarte a maximizar tus ganancias 
            con nuestros productos de alta calidad y precios mayoristas competitivos.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 1.0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <a
              href="tel:+523330743550"
              className="inline-flex items-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Llamar Ahora
            </a>
            <a
              href="https://wa.me/523330743550"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.685"/>
              </svg>
              WhatsApp
            </a>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              +52 33 3074 3550
            </div>
            <div className="flex items-center">
              <MailIcon className="w-4 h-4 mr-2" />
              mayoristas@argostore.com
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              Lun - Sab: 10:00 - 19:00
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 