"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon } from 'lucide-react'
import useCartStore from '@/lib/cart-store'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get payment parameters from URL
    const collection_id = searchParams.get('collection_id')
    const collection_status = searchParams.get('collection_status')
    const payment_id = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const external_reference = searchParams.get('external_reference')
    const payment_type = searchParams.get('payment_type')
    const merchant_order_id = searchParams.get('merchant_order_id')
    const preference_id = searchParams.get('preference_id')
    const site_id = searchParams.get('site_id')
    const processing_mode = searchParams.get('processing_mode')
    const merchant_account_id = searchParams.get('merchant_account_id')

    // Get stored order data
    const storedOrder = localStorage.getItem('currentOrder')
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderData({
          ...parsedOrder,
          paymentInfo: {
            collection_id,
            collection_status,
            payment_id,
            status,
            external_reference,
            payment_type,
            merchant_order_id,
            preference_id,
            site_id,
            processing_mode,
            merchant_account_id
          }
        })
      } catch (error) {
        console.error('Error parsing stored order:', error)
      }
    }

    // Clear cart if payment was successful
    if (status === 'approved' || collection_status === 'approved') {
      clearCart()
      
      // Clear stored order data
      localStorage.removeItem('currentOrder')
    }

    setIsLoading(false)
  }, [searchParams, clearCart])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  const paymentStatus = searchParams.get('status') || searchParams.get('collection_status')
  const isApproved = paymentStatus === 'approved'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isApproved ? (
            <>
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Pago Exitoso!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Tu compra ha sido procesada correctamente. Recibirás un email de confirmación en breve.
              </p>

              {/* Order Details */}
              {orderData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles de la Compra</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">ID de Pago</p>
                      <p className="font-medium">{orderData.paymentInfo?.payment_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Referencia Externa</p>
                      <p className="font-medium">{orderData.paymentInfo?.external_reference || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Pagado</p>
                                             <p className="font-medium text-green-600">
                         ${orderData.total?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Método de Pago</p>
                      <p className="font-medium">{orderData.paymentInfo?.payment_type || 'MercadoPago'}</p>
                    </div>
                  </div>

                  {/* Items Purchased */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Productos Comprados</h3>
                    <div className="space-y-3">
                      {orderData.items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-md">
                          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                            <p className="text-xs text-gray-600">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                                                     <div className="text-sm font-medium text-gray-900">
                             ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Information Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                  <strong>¿Qué sigue?</strong><br/>
                  • Recibirás un email de confirmación<br/>
                  • Prepararemos tu pedido<br/>
                  • Te notificaremos cuando esté listo para envío<br/>
                  • Puedes contactarnos si tienes alguna pregunta
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Pending/Processing Status */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                <ShoppingBagIcon className="h-10 w-10 text-yellow-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Pago en Proceso
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Tu pago está siendo procesado. Te notificaremos cuando se complete.
              </p>

              {orderData?.paymentInfo?.payment_id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-600">ID de Pago</p>
                  <p className="font-medium">{orderData.paymentInfo.payment_id}</p>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Link>
            <Link
              href="/ropa"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 