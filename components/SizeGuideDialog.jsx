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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

// Componente para ilustraciones SVG mejoradas
const CategoryIllustration = ({ category }) => {
  const getIllustration = () => {
    switch (category) {
      case 'pantalones':
        return (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            {/* Pantalón */}
            <g>
              {/* Cintura */}
              <rect x="70" y="50" width="60" height="8" fill="#2563eb" rx="4"/>
              
              {/* Cuerpo del pantalón */}
              <path
                d="M75 58 L75 120 L70 120 L65 200 L80 200 L85 120 L115 120 L120 200 L135 200 L130 120 L125 120 L125 58 Z"
                fill="#3b82f6"
                stroke="#1d4ed8"
                strokeWidth="2"
              />
              
              {/* Piernas */}
              <rect x="65" y="200" width="25" height="80" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
              <rect x="110" y="200" width="25" height="80" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
              
              {/* Líneas de medición */}
              {/* Cintura */}
              <line x1="50" y1="62" x2="150" y2="62" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="100" y="40" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">CINTURA</text>
              
              {/* Cadera */}
              <line x1="50" y1="90" x2="150" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="100" y="105" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">CADERA</text>
              
              {/* Largo */}
              <line x1="160" y1="58" x2="160" y2="280" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="175" y="170" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold" transform="rotate(90 175 170)">LARGO</text>
            </g>
          </svg>
        )
      
      case 'calzado':
        return (
          <svg viewBox="0 0 250 150" className="w-full h-full">
            {/* Zapato vista lateral */}
            <g>
              {/* Suela */}
              <ellipse cx="125" cy="120" rx="80" ry="15" fill="#4b5563"/>
              
              {/* Cuerpo del zapato */}
              <path
                d="M50 120 Q45 110 50 100 Q60 85 80 80 Q120 75 160 80 Q180 85 190 100 Q195 110 190 120 Z"
                fill="#6366f1"
                stroke="#4338ca"
                strokeWidth="2"
              />
              
              {/* Detalles del zapato */}
              <path
                d="M70 95 Q100 90 130 95 Q150 100 170 105"
                fill="none"
                stroke="#4338ca"
                strokeWidth="1.5"
              />
              
              {/* Cordones */}
              <circle cx="90" cy="95" r="2" fill="#1f2937"/>
              <circle cx="110" cy="92" r="2" fill="#1f2937"/>
              <circle cx="130" cy="92" r="2" fill="#1f2937"/>
              <circle cx="150" cy="95" r="2" fill="#1f2937"/>
              
              {/* Línea de medición de longitud */}
              <line x1="45" y1="140" x2="195" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="45" y1="135" x2="45" y2="145" stroke="#ef4444" strokeWidth="2"/>
              <line x1="195" y1="135" x2="195" y2="145" stroke="#ef4444" strokeWidth="2"/>
              <text x="120" y="155" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">LONGITUD (CM)</text>
              
              {/* Etiquetas de tallas */}
              <text x="125" y="30" textAnchor="middle" fill="#4338ca" fontSize="14" fontWeight="bold">TALLAS US / MX</text>
            </g>
          </svg>
        )
      
      default: // polo-camisa, polo-extra
        return (
          <svg viewBox="0 0 200 250" className="w-full h-full">
            {/* Camisa mejorada */}
            <g>
              {/* Cuerpo principal */}
              <path
                d="M70 90 L70 220 L130 220 L130 90 L125 85 L125 65 L115 55 L85 55 L75 65 L75 85 Z"
                fill="#10b981"
                stroke="#059669"
                strokeWidth="2"
              />
              
              {/* Cuello mejorado */}
              <path
                d="M75 65 L85 60 L100 58 L115 60 L125 65 L120 70 L115 67 L100 65 L85 67 L80 70 Z"
                fill="#059669"
                stroke="#047857"
                strokeWidth="1.5"
              />
              
              {/* Mangas mejoradas */}
              <ellipse cx="55" cy="80" rx="20" ry="30" fill="#10b981" stroke="#059669" strokeWidth="2"/>
              <ellipse cx="145" cy="80" rx="20" ry="30" fill="#10b981" stroke="#059669" strokeWidth="2"/>
              
              {/* Detalles de costura */}
              <line x1="75" y1="90" x2="75" y2="220" stroke="#047857" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="125" y1="90" x2="125" y2="220" stroke="#047857" strokeWidth="1" strokeDasharray="2,2"/>
              
              {/* Botones */}
              <circle cx="100" cy="80" r="2" fill="#047857"/>
              <circle cx="100" cy="95" r="2" fill="#047857"/>
              <circle cx="100" cy="110" r="2" fill="#047857"/>
              
              {/* Líneas de medición mejoradas */}
              {/* Ancho del pecho */}
              <line x1="40" y1="110" x2="160" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="40" y1="105" x2="40" y2="115" stroke="#ef4444" strokeWidth="2"/>
              <line x1="160" y1="105" x2="160" y2="115" stroke="#ef4444" strokeWidth="2"/>
              <text x="100" y="130" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">PECHO</text>
              
              {/* Altura */}
              <line x1="175" y1="65" x2="175" y2="220" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="170" y1="65" x2="180" y2="65" stroke="#ef4444" strokeWidth="2"/>
              <line x1="170" y1="220" x2="180" y2="220" stroke="#ef4444" strokeWidth="2"/>
              <text x="190" y="145" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold" transform="rotate(90 190 145)">ALTURA</text>
            </g>
          </svg>
        )
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
      {getIllustration()}
    </div>
  )
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

  const getMeasuringInstructions = () => {
    switch (category) {
      case 'pantalones':
        return [
          { label: 'Cintura', description: 'Mide alrededor de la cintura natural, en la parte más estrecha del torso.' },
          { label: 'Cadera', description: 'Mide alrededor de la parte más ancha de las caderas.' },
          { label: 'Largo', description: 'Mide desde la cintura hasta el tobillo.' }
        ]
      case 'calzado':
        return [
          { label: 'Longitud del pie', description: 'Mide desde el talón hasta la punta del dedo más largo.' },
          { label: 'Conversión de tallas', description: 'Usa la tabla para convertir entre tallas US y mexicanas.' }
        ]
      default:
        return [
          { label: 'Pecho', description: 'Mide alrededor de la parte más ancha del pecho, manteniendo la cinta métrica horizontal.' },
          { label: 'Altura', description: 'Mide desde el punto más alto del hombro hasta el dobladillo inferior de la prenda.' }
        ]
    }
  }

  const instructions = getMeasuringInstructions()

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 -m-6 mb-4 sm:mb-6 rounded-t-lg">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            GUÍA DE TALLAS
          </DialogTitle>
          <DialogDescription className="text-red-100 text-center text-sm sm:text-base">
            Encuentra la talla perfecta para ti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 sm:space-y-8">
          {/* Size Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
              {/* Table */}
              <div className="flex-1 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 text-center xl:text-left">
                  {currentSizeData.title}
                </h3>
                
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300 bg-gray-50">
                        {headers.map((header, index) => (
                          <th 
                            key={header.key}
                            className={`py-2 sm:py-3 px-2 sm:px-3 lg:px-4 font-semibold text-gray-800 text-xs sm:text-sm ${
                              index === 0 ? 'text-left' : 'text-center'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span>{header.label}</span>
                              {header.unit && (
                                <span className="text-xs font-normal text-gray-600">({header.unit})</span>
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
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            index % 2 === 1 ? 'bg-gray-25' : 'bg-white'
                          }`}
                        >
                          {headers.map((header, headerIndex) => (
                            <td 
                              key={header.key}
                              className={`py-2 sm:py-3 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm ${
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
              <div className="flex-shrink-0 w-full xl:w-64 h-48 xl:h-80 p-4">
                <CategoryIllustration category={category} />
              </div>
            </div>
          </div>

          {/* Accordion for Instructions and Recommendations */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="instructions" className="border border-blue-200 rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-3 bg-blue-50 rounded-t-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📏</span>
                  <span className="font-semibold text-blue-900">Cómo medir correctamente</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                <div className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="border-l-4 border-blue-300 pl-4">
                      <p className="text-sm">
                        <strong className="text-blue-900">{instruction.label}:</strong>{" "}
                        <span className="text-blue-800">{instruction.description}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommendations" className="border border-yellow-200 rounded-lg">
              <AccordionTrigger className="px-4 py-3 bg-yellow-50 rounded-t-lg hover:bg-yellow-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span className="font-semibold text-yellow-900">Recomendaciones importantes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <p className="text-yellow-800">
                      Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <p className="text-yellow-800">
                      Todas las medidas están en centímetros y son aproximadas.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <p className="text-yellow-800">
                      Las medidas pueden variar ligeramente dependiendo del material y diseño del producto.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <p className="text-yellow-800">
                      Para mayor precisión, te recomendamos comparar con una prenda similar que tengas.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Brand logo */}
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
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