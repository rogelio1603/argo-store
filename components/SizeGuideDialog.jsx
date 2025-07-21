"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const sizeData = {
  "polo-camisa": {
    title: "TIPO POLO Y CAMISA",
    sizes: [
      { size: "M", pecho: 48, altura: 68 },
      { size: "L", pecho: 50, altura: 69 },
      { size: "XL", pecho: 51, altura: 72 },
      { size: "2XL", pecho: 54, altura: 74 },
      { size: "3XL", pecho: 55, altura: 75 }
    ]
  },
  "polo-extra": {
    title: "PLAYERA TIPO POLO - TALLAS EXTRAS",
    sizes: [
      { size: "3XL", pecho: 57, altura: 75 },
      { size: "4XL", pecho: 59, altura: 77 },
      { size: "5XL", pecho: 61, altura: 79 },
      { size: "6XL", pecho: 63, altura: 81 }
    ]
  },
  "pantalones": {
    title: "PANTALONES Y JEANS",
    sizes: [
      { size: "28", cintura: 71, cadera: 91, largo: 102 },
      { size: "30", cintura: 76, cadera: 96, largo: 104 },
      { size: "32", cintura: 81, cadera: 101, largo: 106 },
      { size: "34", cintura: 86, cadera: 106, largo: 108 },
      { size: "36", cintura: 91, cadera: 111, largo: 110 },
      { size: "38", cintura: 96, cadera: 116, largo: 112 }
    ]
  },
  "calzado": {
    title: "CALZADO",
    sizes: [
      { size: "6", mx: "24", cm: 24.0 },
      { size: "6.5", mx: "24.5", cm: 24.5 },
      { size: "7", mx: "25", cm: 25.0 },
      { size: "7.5", mx: "25.5", cm: 25.5 },
      { size: "8", mx: "26", cm: 26.0 },
      { size: "8.5", mx: "26.5", cm: 26.5 },
      { size: "9", mx: "27", cm: 27.0 },
      { size: "9.5", mx: "27.5", cm: 27.5 },
      { size: "10", mx: "28", cm: 28.0 },
      { size: "10.5", mx: "28.5", cm: 28.5 },
      { size: "11", mx: "29", cm: 29.0 }
    ]
  }
}

export function SizeGuideDialog({ children, category = "polo-camisa" }) {
  const currentSizeData = sizeData[category]

  // Generate table headers based on category
  const getTableHeaders = () => {
    switch (category) {
      case 'pantalones':
        return [
          { key: 'size', label: 'TALLA' },
          { key: 'cintura', label: 'CINTURA', unit: 'CM' },
          { key: 'cadera', label: 'CADERA', unit: 'CM' },
          { key: 'largo', label: 'LARGO', unit: 'CM' }
        ]
      case 'calzado':
        return [
          { key: 'size', label: 'TALLA US' },
          { key: 'mx', label: 'TALLA MX' },
          { key: 'cm', label: 'LONGITUD', unit: 'CM' }
        ]
      default: // polo-camisa, polo-extra
        return [
          { key: 'size', label: 'TALLAS' },
          { key: 'pecho', label: 'PECHO', unit: 'CM' },
          { key: 'altura', label: 'ALTURA', unit: 'CM' }
        ]
    }
  }

  const headers = getTableHeaders()

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="bg-red-500 text-white p-4 sm:p-6 -m-6 mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            GUÍA DE TALLAS
          </DialogTitle>
          <DialogDescription className="text-red-100 text-center text-sm sm:text-base">
            Encuentra la talla perfecta para ti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 sm:space-y-8">
          {/* Size Table */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-center">
              {/* Table */}
              <div className="flex-1 w-full">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center xl:text-left">
                  {currentSizeData.title}
                </h3>
                
                <div className="w-full">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-800">
                        {headers.map((header, index) => (
                          <th 
                            key={header.key}
                            className={`py-3 sm:py-4 px-2 sm:px-3 lg:px-4 font-bold text-gray-900 text-sm sm:text-base lg:text-lg ${
                              index === 0 ? 'text-left' : 'text-center'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span>{header.label}</span>
                              {header.unit && (
                                <span className="text-xs sm:text-sm font-normal">({header.unit})</span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentSizeData.sizes.map((item, index) => (
                        <tr 
                          key={item.size} 
                          className={`border-b border-gray-200 ${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}
                        >
                          {headers.map((header, headerIndex) => (
                            <td 
                              key={header.key}
                              className={`py-3 sm:py-4 px-2 sm:px-3 lg:px-4 text-sm sm:text-base lg:text-lg ${
                                headerIndex === 0 
                                  ? 'font-semibold text-gray-900' 
                                  : 'text-center text-gray-700'
                              }`}
                            >
                              {item[header.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Illustration */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64">
                  {/* Polo Shirt Illustration */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Shirt body */}
                    <path
                      d="M60 80 L60 180 L140 180 L140 80 L130 70 L130 50 L120 40 L80 40 L70 50 L70 70 Z"
                      fill="#B8E6E1"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    {/* Collar */}
                    <path
                      d="M70 50 L85 45 L100 42 L115 45 L130 50 L125 55 L115 52 L100 50 L85 52 L75 55 Z"
                      fill="#059669"
                    />
                    {/* Sleeves */}
                    <ellipse cx="50" cy="65" rx="15" ry="25" fill="#059669" />
                    <ellipse cx="150" cy="65" rx="15" ry="25" fill="#059669" />
                    
                    {/* Measurement lines */}
                    {/* Width measurement */}
                    <line x1="45" y1="100" x2="155" y2="100" stroke="#000" strokeWidth="2" />
                    <line x1="45" y1="95" x2="45" y2="105" stroke="#000" strokeWidth="2" />
                    <line x1="155" y1="95" x2="155" y2="105" stroke="#000" strokeWidth="2" />
                    
                    {/* Height measurement */}
                    <line x1="170" y1="50" x2="170" y2="180" stroke="#000" strokeWidth="2" />
                    <line x1="165" y1="50" x2="175" y2="50" stroke="#000" strokeWidth="2" />
                    <line x1="165" y1="180" x2="175" y2="180" stroke="#000" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6">
            <h4 className="font-bold text-blue-900 mb-3 text-base sm:text-lg">
              📏 Cómo medir correctamente:
            </h4>
            <div className="space-y-2 text-blue-800 text-sm sm:text-base">
              <p><strong>Pecho:</strong> Mide alrededor de la parte más ancha del pecho, manteniendo la cinta métrica horizontal.</p>
              <p><strong>Altura:</strong> Mide desde el punto más alto del hombro hasta el dobladillo inferior de la prenda.</p>
            </div>
          </div>

          {/* Size recommendation */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 sm:p-6">
            <h4 className="font-bold text-yellow-900 mb-3 text-base sm:text-lg">
              💡 Recomendaciones:
            </h4>
            <div className="space-y-2 text-yellow-800 text-sm sm:text-base">
              <p>• Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad.</p>
              <p>• Todas las medidas están en centímetros.</p>
              <p>• Las medidas pueden variar ligeramente dependiendo del material y diseño.</p>
            </div>
          </div>

          {/* Brand logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
              <img
                src="/logo.avif"
                alt="ArgoStore Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 