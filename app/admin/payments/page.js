"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  RefreshCcwIcon,
  TrashIcon
} from 'lucide-react'

export default function PaymentsAdminPage() {
  const [stats, setStats] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const [statsResponse, credentialsResponse] = await Promise.all([
        fetch('/api/mercadopago/webhook'),
        fetch('/api/mercadopago/credentials-check')
      ])
      
      const statsData = await statsResponse.json()
      const credentialsData = await credentialsResponse.json()
      
      setStats(statsData.stats)
      setCredentials(credentialsData)
      
      toast.success('Estadísticas actualizadas')
    } catch (error) {
      toast.error('Error al cargar estadísticas')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearProcessedPayments = async () => {
    if (!confirm('¿Estás seguro de que quieres limpiar el cache de pagos procesados?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/clear-payments', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('Cache de pagos limpiado')
        fetchStats()
      } else {
        toast.error('Error al limpiar cache')
      }
    } catch (error) {
      toast.error('Error de conexión')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🛡️ Panel de Administración de Pagos
              </h1>
              <p className="text-gray-600 mt-2">
                Monitoreo y control de pagos procesados por MercadoPago
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={fetchStats}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                <RefreshCcwIcon className="h-4 w-4 mr-2" />
                Actualizar
              </button>
              
              <button
                onClick={clearProcessedPayments}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Limpiar Cache
              </button>
            </div>
          </div>

          {/* Credentials Status */}
          {credentials && (
            <div className="mb-8 p-6 rounded-lg border-2" style={{
              backgroundColor: credentials.environment === 'production' ? '#fef2f2' : '#f0f9ff',
              borderColor: credentials.environment === 'production' ? '#fca5a5' : '#93c5fd'
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold" style={{
                    color: credentials.environment === 'production' ? '#dc2626' : '#2563eb'
                  }}>
                    {credentials.environment === 'production' ? '🔴 ENTORNO DE PRODUCCIÓN' : '🧪 ENTORNO DE PRUEBA'}
                  </h3>
                  <p className="text-sm mt-1" style={{
                    color: credentials.environment === 'production' ? '#991b1b' : '#1d4ed8'
                  }}>
                    {credentials.environment === 'production' 
                      ? 'Los pagos son REALES y se cobrarán dinero'
                      : 'Los pagos son simulados - no se cobra dinero real'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Access Token: {credentials.accessToken.prefix}</p>
                  <p className="text-xs text-gray-600">Public Key: {credentials.publicKey.prefix}</p>
                </div>
              </div>
              
              {credentials.recommendations && (
                <div className="mt-4 space-y-1">
                  {credentials.recommendations.map((rec, index) => (
                    <p key={index} className="text-xs" style={{
                      color: credentials.environment === 'production' ? '#991b1b' : '#1d4ed8'
                    }}>
                      {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-900">
                      Pagos Procesados
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.totalProcessed}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <CreditCardIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Webhook Status
                    </h3>
                    <p className="text-sm font-medium text-blue-600">
                      Activo y funcionando
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-900">
                      Última Actualización
                    </h3>
                    <p className="text-sm font-medium text-yellow-600">
                      {new Date().toLocaleString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processed Payments List */}
          {stats && stats.processedPayments.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pagos Procesados Recientemente
              </h3>
              
              <div className="space-y-3">
                {stats.processedPayments.slice(-10).reverse().map((paymentId) => (
                  <div key={paymentId} className="bg-white rounded-md p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment ID: {paymentId}
                        </p>
                        {stats.timestamps[paymentId] && (
                          <p className="text-sm text-gray-500">
                            Procesado: {new Date(stats.timestamps[paymentId]).toLocaleString('es-MX')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Procesado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {stats && stats.processedPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay pagos procesados aún
              </h3>
              <p className="text-gray-600">
                Los pagos aprobados aparecerán aquí una vez que sean procesados por el webhook.
              </p>
            </div>
          )}

          {/* Information Panel */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              📋 Información del Sistema
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-blue-900">Validaciones Activas:</h5>
                <ul className="mt-2 space-y-1 text-blue-800">
                  <li>✅ Detección de pagos de prueba</li>
                  <li>✅ Prevención de pagos duplicados</li>
                  <li>✅ Validación de live_mode</li>
                  <li>✅ Verificación de tarjetas de prueba</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-blue-900">Seguridad:</h5>
                <ul className="mt-2 space-y-1 text-blue-800">
                  <li>🔒 Solo pagos reales se procesan</li>
                  <li>🔒 Cache de pagos procesados</li>
                  <li>🔒 Logs detallados de auditoría</li>
                  <li>🔒 Validación de webhooks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Development Warning */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Modo de Desarrollo
              </h4>
              <p className="text-sm text-yellow-700">
                Este panel está en modo de desarrollo. En producción, considera usar una base de datos 
                para almacenar permanentemente los pagos procesados en lugar del cache en memoria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 