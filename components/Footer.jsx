"use client"

import * as React from "react"
import Link from "next/link"
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, InstagramIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                ArgoStore
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Tu destino para la moda moderna y accesorios únicos. Calidad y estilo en cada producto.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-300">
                <PhoneIcon className="h-4 w-4" />
                <span>+52 33 3024 3550</span>
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

          {/* Tienda Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4 text-sm">Tienda</h3>
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
            <h3 className="text-white font-semibold mb-4 text-sm">Empresa</h3>
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
            </ul>
          </div>

          {/* Soporte Section */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4 text-sm">Soporte</h3>
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
                href="https://facebook.com" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link 
                href="https://instagram.com" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400 order-3 md:order-2">
              <Link href="/aviso-de-privacidad" className="hover:text-white transition-colors duration-200">
                Aviso de Privacidad
              </Link>
              <Link href="/politica-de-devoluciones" className="hover:text-white transition-colors duration-200">
                Política de Devoluciones
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400 order-2 md:order-3">
              © 2025 ArgoShop. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 