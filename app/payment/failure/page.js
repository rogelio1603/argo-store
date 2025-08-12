"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircleIcon, ArrowLeftIcon, CreditCardIcon, RefreshCcwIcon } from 'lucide-react'

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
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

  const handleRetryPayment = () => {
    // Redirect back to checkout to retry
    router.push('/checkout')
  }

  const getFailureReason = () => {
    const status = paymentInfo?.status || paymentInfo?.collection_status
    
    switch (status) {
      case 'rejected':
        return {
          title: 'Pago Rechazado',
          message: 'Tu pago fue rechazado. Esto puede deberse a fondos insuficientes, problemas con la tarjeta o restricciones del banco.',
          suggestions: [
            'Verifica que tu tarjeta tenga fondos suficientes',
            'Confirma que los datos de la tarjeta sean correctos',
            'Intenta con otro método de pago',
            'Contacta a tu banco si el problema persiste'
          ]
        }
      case 'cancelled':
        return {
          title: 'Pago Cancelado',
          message: 'El pago fue cancelado durante el proceso.',
          suggestions: [
            'Puedes intentar nuevamente',
            'Verifica tu conexión a internet',
            'Usa un método de pago diferente'
          ]
        }
      case 'pending':
        return {
          title: 'Pago Pendiente',
          message: 'Tu pago está pendiente de confirmación.',
          suggestions: [
            'Si pagaste con transferencia bancaria, puede tomar tiempo en procesarse',
            'Revisa tu email para instrucciones adicionales',
            'El pago se confirmará automáticamente una vez procesado'
          ]
        }
      default:
        return {
          title: 'Error en el Pago',
          message: 'Ocurrió un error durante el proceso de pago.',
          suggestions: [
            'Verifica tu conexión a internet',
            'Intenta con otro método de pago',
            'Contacta a soporte si el problema persiste'
          ]
        }
    }
  }

  const failureInfo = getFailureReason()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {failureInfo.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {failureInfo.message}
            </p>
          </div>

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Intento de Pago</h2>
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
                {paymentInfo.status && (
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium capitalize">{paymentInfo.status}</p>
                  </div>
                )}
                {paymentInfo.payment_type && (
                  <div>
                    <p className="text-sm text-gray-600">Método de Pago</p>
                    <p className="font-medium">{paymentInfo.payment_type}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          {orderData && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Pedido se Mantiene</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total a pagar:</span>
                                 <span className="text-2xl font-bold text-blue-600">
                   ${orderData.total?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
              </div>
              <p className="text-sm text-blue-800">
                Tu carrito se mantiene con {orderData.items?.length} producto(s). 
                Puedes intentar el pago nuevamente.
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">¿Qué puedes hacer?</h3>
            <ul className="space-y-2">
              {failureInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-yellow-800">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
            <button
              onClick={handleRetryPayment}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCcwIcon className="h-5 w-5 mr-2" />
              Intentar Nuevamente
            </button>
            
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver al Inicio
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