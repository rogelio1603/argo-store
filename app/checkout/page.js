"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import useCartStore from '@/lib/cart-store'
import { ShoppingCartIcon, CreditCardIcon, UserIcon, TruckIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { checkoutSchema } from '@/lib/checkout-schema'
import { mexicanStates, getCitiesForState } from '@/lib/mexico-locations'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotals } = useCartStore()
  const { totalItems, totalPrice } = getTotals()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [availableCities, setAvailableCities] = useState([])

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      motherLastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      address: '',
      state: '',
      city: '',
      postalCode: ''
    }
  })

  // Watch state changes for dynamic city loading
  const watchedState = watch('state')
  const watchedCity = watch('city')

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Redirect if cart is empty (after hydration)
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/')
    }
  }, [isHydrated, items.length, router])

  // Update available cities when state changes
  useEffect(() => {
    if (watchedState) {
      const cities = getCitiesForState(watchedState)
      setAvailableCities(cities)
      
      // Clear city selection if current city is not available in new state
      if (watchedCity && !cities.includes(watchedCity)) {
        setValue('city', '')
      }
    } else {
      setAvailableCities([])
    }
  }, [watchedState, watchedCity, setValue])

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Prepare payer data for MercadoPago
      const payer = {
        name: data.firstName,
        surname: `${data.lastName} ${data.motherLastName}`.trim(),
        email: data.email,
        phone: {
          area_code: '52', // Mexico area code
          number: data.phone
        },
        address: {
          street_name: data.address,
          street_number: '',
          zip_code: data.postalCode
        }
      }

      // Create payment preference
      const response = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          payer
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('MercadoPago error details:', result)
        throw new Error(result.details || result.error || 'Error creating payment preference')
      }

      // Store order data in localStorage for later use
      localStorage.setItem('currentOrder', JSON.stringify({
        items,
        payer: {
          ...payer,
          fullAddress: {
            address: data.address,
            city: data.city,
            state: mexicanStates.find(s => s.id === data.state)?.name || data.state,
            postalCode: data.postalCode
          }
        },
        total: totalPrice,
        preferenceId: result.id,
        timestamp: new Date().toISOString()
      }))

      // Show success toast before redirect
      toast.success('Redirigiendo a MercadoPago', {
        description: 'Serás redirigido al portal de pagos de MercadoPago.',
        duration: 3000,
      })

      // Always use production URL (init_point) - never sandbox
      const redirectUrl = result.init_point || result.payment_url

      if (!redirectUrl) {
        throw new Error('No se recibió URL de pago de MercadoPago')
      }

      // Small delay to show the toast
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 1000)

    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Error al procesar el pago', {
        description: `${error.message}. Por favor intenta nuevamente.`,
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Completa tu información para proceder con el pago</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Juan"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Pérez"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Materno *
                    </label>
                    <input
                      type="text"
                      {...register('motherLastName')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.motherLastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="García"
                    />
                    {errors.motherLastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.motherLastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="5512345678"
                      maxLength="10"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Email *
                    </label>
                    <input
                      type="email"
                      {...register('confirmEmail')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.confirmEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.confirmEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Información de Dirección de Envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Calle Reforma #123, Col. Centro"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      {...register('state')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un estado</option>
                      {mexicanStates.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <select
                      {...register('city')}
                      disabled={!watchedState || availableCities.length === 0}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {!watchedState ? 'Primero selecciona un estado' : 'Selecciona una ciudad'}
                      </option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      {...register('postalCode')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="06600"
                      maxLength="5"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Button - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/mercadopago/test-simple', {
                        method: 'POST'
                      })
                      const data = await response.json()
                      if (data.success) {
                        toast.success('Prueba exitosa!', {
                          description: 'MercadoPago está funcionando correctamente'
                        })
                      } else {
                        toast.error('Prueba falló', {
                          description: data.error
                        })
                      }
                    } catch (error) {
                      toast.error('Error en prueba', {
                        description: error.message
                      })
                    }
                  }}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center justify-center mb-4"
                >
                  🧪 Probar Conexión MercadoPago (Dev)
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Pagar con MercadoPago
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    {item.size && (
                      <p className="text-xs text-gray-500">Talla: {item.size}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({totalItems} productos)</span>
                <span>${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>A calcular</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-red-600">
                  ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Métodos de Pago Disponibles</h3>
              <div className="text-xs text-blue-800">
                • Tarjetas de crédito y débito<br/>
                • OXXO<br/>
                • SPEI<br/>
                • Y más opciones con MercadoPago México
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <h3 className="text-sm font-medium text-green-900 mb-2">🇲🇽 Envíos a toda la República Mexicana</h3>
              <div className="text-xs text-green-800">
                Realizamos envíos seguros a todos los estados de México.<br/>
                El costo del envío se calculará según tu ubicación.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 