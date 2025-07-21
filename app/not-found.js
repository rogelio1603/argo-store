import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Página no encontrada
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Lo sentimos, no pudimos encontrar la página que estás buscando. 
              Es posible que el producto haya sido eliminado o que la URL sea incorrecta.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors"
            >
              Volver al inicio
            </Link>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/ropa" className="text-red-500 hover:text-red-600">
                Ver Ropa
              </Link>
              <Link href="/calzado" className="text-red-500 hover:text-red-600">
                Ver Calzado
              </Link>
              <Link href="/accesorios" className="text-red-500 hover:text-red-600">
                Ver Accesorios
              </Link>
              <Link href="/drops" className="text-red-500 hover:text-red-600">
                Ver Drops
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 