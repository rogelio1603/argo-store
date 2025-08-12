"use client"

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ClockIcon, InfoIcon, HomeIcon, ShoppingBagIcon } from 'lucide-react'

function PaymentPendingContent() {
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [orderData, setOrderData] = useState(null)

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

    setPaymentInfo({
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
      payment_type,
      merchant_order_id,
      preference_id
    })

    // Get stored order data
    const storedOrder = localStorage.getItem('currentOrder')
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        setOrderData(parsedOrder)
      } catch (error) {
        console.error('Error parsing stored order:', error)
      }
    }
  }, [searchParams])

  const getPaymentTypeInstructions = () => {
    const paymentType = paymentInfo?.payment_type

    switch (paymentType) {
      case 'bank_transfer':
        return {
          title: 'Transferencia Bancaria',
          instructions: [
            'Tu transferencia está siendo procesada',
            'Puede tomar de 1 a 3 días hábiles en confirmarse',
            'Recibirás un email una vez se confirme el pago',
            'Conserva el comprobante de la transferencia'
          ],
          timeframe: '1-3 días hábiles'
        }
      case 'ticket':
        return {
          title: 'Pago en Efectivo',
          instructions: [
            'Dirígete al punto de pago indicado',
            'Presenta el código de pago',
            'Realiza el pago en efectivo',
            'El pago se confirmará automáticamente'
          ],
          timeframe: 'Hasta 24 horas después del pago'
        }
      case 'atm':
        return {
          title: 'Pago en Cajero',
          instructions: [
            'Ve a un cajero automático',
            'Selecciona la opción de pagos',
            'Ingresa el código proporcionado',
            'Completa el pago'
          ],
          timeframe: 'Hasta 24 horas después del pago'
        }
      default:
        return {
          title: 'Pago Pendiente',
          instructions: [
            'Tu pago está siendo procesado',
            'Recibirás confirmación por email',
            'El tiempo de procesamiento depende del método usado',
            'No es necesario realizar ninguna acción adicional'
          ],
          timeframe: 'Varía según el método de pago'
        }
    }
  }

  const paymentInstructions = getPaymentTypeInstructions()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Pending Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
          </div>

          {/* Pending Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pago Pendiente de Confirmación
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Tu pedido ha sido registrado y está esperando la confirmación del pago.
            </p>
          </div>

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentInfo.payment_id && (
                  <div>
                    <p className="text-sm text-gray-600">ID de Pago</p>
                    <p className="font-medium">{paymentInfo.payment_id}</p>
                  </div>
                )}
                {paymentInfo.external_reference && (
                  <div>
                    <p className="text-sm text-gray-600">Referencia Externa</p>
                    <p className="font-medium">{paymentInfo.external_reference}</p>
                  </div>
                )}
                {orderData?.total && (
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                                         <p className="font-medium text-green-600">
                       ${orderData.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Tiempo Estimado</p>
                  <p className="font-medium">{paymentInstructions.timeframe}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <InfoIcon className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  {paymentInstructions.title}
                </h3>
                <ul className="space-y-2">
                  {paymentInstructions.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm text-blue-800">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {orderData && orderData.items && (
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de tu Pedido</h2>
              <div className="space-y-3">
                {orderData.items.map((item) => (
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
          )}

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Información Importante</h3>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• Conserva este número de referencia para futuras consultas</p>
              <p>• Recibirás un email de confirmación una vez se procese el pago</p>
              <p>• Tu pedido será preparado automáticamente al confirmar el pago</p>
              <p>• Si tienes dudas, contacta nuestro soporte con la referencia del pago</p>
            </div>
          </div>

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

          {/* Contact Support */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
            <p className="text-sm text-gray-500">
              Contacta nuestro soporte: 
              <a href="mailto:soporte@argostore.com" className="text-red-600 hover:text-red-700 ml-1">
                soporte@argostore.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <PaymentPendingContent />
    </Suspense>
  )
}