"use client"

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon } from 'lucide-react'
import useCartStore from '@/lib/cart-store'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentValidation, setPaymentValidation] = useState(null)
  const [isValidating, setIsValidating] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)

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

    // AUTOMATIC PAYMENT PROCESSING - Process and validate payment

    const processPaymentAutomatically = async () => {
      if (payment_id && (status === 'approved' || collection_status === 'approved')) {
        try {
          setIsValidating(true)
          
          const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id })
          })
          
          const result = await response.json()
          
          // Set validation result to control UI
          setPaymentValidation(result)

          // If API returns order details, use them to render items and shipping
          if (result?.order) {
            const apiItems = (result.order.items || []).map((it) => ({
              id: it.id,
              name: it.title,
              image: it.picture_url,
              quantity: Number(it.quantity) || 0,
              price: Number(it.unit_price) || 0
            }))
            const addr = result.order.shippingAddress || {}
            const builtOrder = {
              items: apiItems,
              total: Number(result.order?.totals?.total) || apiItems.reduce((s, it) => s + (it.price * it.quantity), 0),
              payer: {
                fullAddress: {
                  street: addr.street || '',
                  exteriorNumber: '',
                  interiorNumber: '',
                  colonia: addr.colonia || '',
                  city: addr.city || '',
                  alcaldia: addr.alcaldia || '',
                  state: addr.state || '',
                  postalCode: addr.postalCode || '',
                  references: addr.references || ''
                }
              },
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
            }
            setOrderData(builtOrder)
          }
          
        } catch (error) {
          console.error('❌ Error in automatic payment processing:', error)
          setPaymentValidation({ 
            success: false, 
            error: 'Error validating payment',
            processing_result: { success: false }
          })
        } finally {
          setIsValidating(false)
        }
      } else {
        setIsValidating(false)
      }
    }

    // Execute automatic processing
    processPaymentAutomatically()

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

    setIsLoading(false)
  }, [searchParams, clearCart])

  // Separate effect to handle cart clearing based on payment validation
  useEffect(() => {
    if (paymentValidation && !isValidating) {
      // Clear cart for successful payments (including duplicates and already sent emails)
      if (paymentValidation?.success === true) {
        clearCart()
        localStorage.removeItem('currentOrder')
      } else {
        console.error('🛡️ Cart NOT cleared - Payment not validated as successful')
      }
    }
  }, [paymentValidation, isValidating, clearCart])

  // Countdown effect for redirect
  useEffect(() => {
    if (paymentValidation && !isValidating) {
      // Start countdown for duplicate payments or already sent emails
      if (paymentValidation?.processing_result?.duplicate || 
          paymentValidation?.processing_result?.emailAlreadySent) {
        setShowCountdown(true)
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              window.location.href = '/'
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      }
    }
  }, [paymentValidation, isValidating])

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Cargando...' : 'Validando pago con MercadoPago...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Verificando que el pago sea válido y real
          </p>
        </div>
      </div>
    )
  }

  // Determine the real payment status based on server validation
  const paymentStatus = searchParams.get('status') || searchParams.get('collection_status')
  const serverValidation = paymentValidation?.processing_result
  
  // Only consider approved if MercadoPago says approved AND server validation passed
  const isRealPaymentApproved = paymentStatus === 'approved' && 
                               paymentValidation?.success === true && 
                               serverValidation?.success === true
  
  const isTestPayment = serverValidation?.testPayment === true
  const isDuplicatePayment = serverValidation?.duplicate === true
  const isEmailAlreadySent = serverValidation?.emailAlreadySent === true

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isRealPaymentApproved ? (
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

                  {/* Shipping Address */}
                  {orderData?.payer?.fullAddress && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dirección de Envío</h3>
                      <div className="bg-white rounded-md p-4 text-sm text-gray-800 space-y-1">
                        <p>
                          <span className="font-semibold">Dirección:</span> {orderData.payer.fullAddress.street} {orderData.payer.fullAddress.exteriorNumber}
                          {orderData.payer.fullAddress.interiorNumber ? `, Int. ${orderData.payer.fullAddress.interiorNumber}` : ''}
                        </p>
                        <p>
                          <span className="font-semibold">Colonia:</span> {orderData.payer.fullAddress.colonia}
                        </p>
                        {orderData.payer.fullAddress.alcaldia && (
                          <p>
                            <span className="font-semibold">Alcaldía:</span> {orderData.payer.fullAddress.alcaldia}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold">Ciudad / Estado:</span> {orderData.payer.fullAddress.city}
                          {orderData.payer.fullAddress.state ? `, ${orderData.payer.fullAddress.state}` : ''}
                        </p>
                        <p>
                          <span className="font-semibold">Código Postal:</span> {orderData.payer.fullAddress.postalCode}
                        </p>
                        {orderData.payer.fullAddress.references && (
                          <p>
                            <span className="font-semibold">Referencias:</span> {orderData.payer.fullAddress.references}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Information Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                  <strong>¿Qué sigue?</strong><br/>
                  • Prepararemos tu pedido<br/>
                  • Te notificaremos cuando esté listo para envío<br/>
                  • Puedes contactarnos si tienes alguna pregunta via whatsapp o email
                </p>
              </div>
            </>
          ) : isTestPayment ? (
            <>
              {/* Test Payment Detected */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                <ShoppingBagIcon className="h-10 w-10 text-yellow-600" />
              </div>

              <h1 className="text-3xl font-bold text-yellow-700 mb-4">
                🧪 Pago de Prueba Detectado
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Este pago fue realizado con una tarjeta de prueba y no se procesará como una compra real.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-yellow-800">
                  <strong>Para hacer una compra real:</strong><br/>
                  • Usa una tarjeta real (no de prueba)<br/>
                  • Asegúrate de tener fondos suficientes<br/>
                  • Verifica que la información sea correcta
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">ID de Pago (Prueba)</p>
                <p className="font-medium">{searchParams.get('payment_id')}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Razones: {serverValidation?.validationReasons?.join(', ')}
                </p>
              </div>
            </>
          ) : isDuplicatePayment ? (
            <>
              {/* Duplicate Payment */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <ShoppingBagIcon className="h-10 w-10 text-blue-600" />
              </div>

              <h1 className="text-3xl font-bold text-blue-700 mb-4">
                🔄 Pago Ya Procesado
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Este pago ya fue procesado anteriormente. No se duplicará la orden.
              </p>

              {showCountdown && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Redirigiendo al inicio en {countdown} segundos...</strong>
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">ID de Pago</p>
                <p className="font-medium">{searchParams.get('payment_id')}</p>
              </div>
            </>
          ) : isEmailAlreadySent ? (
            <>
              {/* Email Already Sent */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <ShoppingBagIcon className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-green-700 mb-4">
                📧 Email Ya Enviado
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                El email de confirmación ya fue enviado para este pago.
              </p>

              {showCountdown && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-green-800 text-center">
                    <strong>Redirigiendo al inicio en {countdown} segundos...</strong>
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">ID de Pago</p>
                <p className="font-medium">{searchParams.get('payment_id')}</p>
              </div>
            </>
          ) : (
            <>
              {/* Payment Validation Failed */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <ShoppingBagIcon className="h-10 w-10 text-red-600" />
              </div>

              <h1 className="text-3xl font-bold text-red-700 mb-4">
                ❌ Pago No Válido
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                El pago no pudo ser validado correctamente.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-red-800">
                  <strong>Posibles causas:</strong><br/>
                  • Tarjeta de prueba en entorno de producción<br/>
                  • Información de pago incorrecta<br/>
                  • Problema técnico<br/>
                  • Pago rechazado por el banco
                </p>
              </div>

              {paymentValidation?.error && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-600">Error</p>
                  <p className="font-medium text-red-600">{paymentValidation.error}</p>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}