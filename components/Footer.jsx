"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, InstagramIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.avif"
                  alt="ArgoStore Logo"
                  width={140}
                  height={70}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Tu destino para la moda moderna y accesorios únicos. Calidad y estilo en cada producto.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-300">
                    <PhoneIcon className="h-4 w-4" />
                    <span>+52 33 3074 3550</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-300">
                    <MailIcon className="h-4 w-4" />
                    <span>argo@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-300">
                    <MapPinIcon className="h-4 w-4" />
                    <span>Guadalajara, Jalisco</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tienda Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4 text-md">Tienda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ropa" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Ropa
                </Link>
              </li>
              <li>
                <Link href="/accesorios" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link href="/drops" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Drops
                </Link>
              </li>
              <li>
                <Link href="/nuevos-productos" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Nuevos Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4 text-md">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/aviso-de-privacidad" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Aviso de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4 text-md">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/envios" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/guia-de-tallas" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                  Guía de Tallas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Legal Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            {/* Social Media */}
            <div className="flex items-center justify-center space-x-4 order-1 md:order-1">
              <Link 
                href="https://www.facebook.com/argo.shop.gdl" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" aria-label="Facebook" role="img" />
              </Link>
              <Link 
                href="https://www.instagram.com/argo.shop3/" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" aria-label="Instagram" role="img" />
              </Link>
              <Link 
                href="https://www.tiktok.com/@argo_shop" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400 order-2 md:order-3">
              © {new Date().getFullYear()} ArgoShop. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 