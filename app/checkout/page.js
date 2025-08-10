"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import useCartStore from '@/lib/cart-store'
import { ShoppingCartIcon, CreditCardIcon, UserIcon, TruckIcon, ArrowLeftIcon, AlertTriangle, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { checkoutSchema } from '@/lib/checkout-schema'
import { mexicanStates } from '@/lib/mexico-locations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotals } = useCartStore()
  const { totalItems, totalPrice } = getTotals()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
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
      street: '',
      exteriorNumber: '',
      interiorNumber: '',
      colonia: '',
      state: '',
      city: '',
      alcaldia: '',
      postalCode: '',
      references: ''
    }
  })

  // Watch state changes for conditional alcaldia field
  const watchedState = watch('state')

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

  // Clear alcaldia when state changes and is not CDMX
  useEffect(() => {
    if (watchedState && watchedState !== 'CDMX') {
      setValue('alcaldia', '')
    }
  }, [watchedState, setValue])

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Convert all text fields to uppercase except email
      const processedData = {
        ...data,
        firstName: data.firstName.toUpperCase(),
        lastName: data.lastName.toUpperCase(),
        motherLastName: data.motherLastName.toUpperCase(),
        // email stays as is (lowercase/mixed case)
        phone: data.phone,
        street: data.street.toUpperCase(),
        exteriorNumber: data.exteriorNumber.toUpperCase(),
        interiorNumber: data.interiorNumber ? data.interiorNumber.toUpperCase() : '',
        colonia: data.colonia.toUpperCase(),
        city: data.city.toUpperCase(),
        alcaldia: data.alcaldia ? data.alcaldia.toUpperCase() : '',
        postalCode: data.postalCode, // Numbers don't need uppercase
        references: data.references ? data.references.toUpperCase() : ''
      }

      // Build complete address string with uppercase values
      const fullAddress = `${processedData.street} ${processedData.exteriorNumber}${processedData.interiorNumber ? ` INT. ${processedData.interiorNumber}` : ''}`
      
      // Prepare payer data for MercadoPago
      const payer = {
        name: processedData.firstName,
        surname: `${processedData.lastName} ${processedData.motherLastName}`.trim(),
        email: data.email, // Keep original email (no uppercase)
        phone: {
          area_code: '52', // Mexico area code
          number: processedData.phone
        },
        address: {
          street_name: fullAddress,
          colonia: processedData.colonia,
          state: mexicanStates.find(s => s.id === data.state)?.name.toUpperCase() || processedData.state,
          city: processedData.city,
          alcaldia: processedData.alcaldia,
          zip_code: processedData.postalCode,
          references: processedData.references
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

      // Store order data in localStorage for later use (with uppercase values)
      localStorage.setItem('currentOrder', JSON.stringify({
        items,
        payer: {
          ...payer,
          fullAddress: {
            street: processedData.street,
            exteriorNumber: processedData.exteriorNumber,
            interiorNumber: processedData.interiorNumber,
            colonia: processedData.colonia,
            city: processedData.city,
            alcaldia: processedData.alcaldia,
            state: mexicanStates.find(s => s.id === data.state)?.name.toUpperCase() || processedData.state,
            postalCode: processedData.postalCode,
            references: processedData.references,
            completeAddress: fullAddress
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Disclaimer visible para el flujo de pago */}
          <div className="mt-4 rounded-md border border-yellow-300 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-6 text-yellow-900">
                <span className="font-semibold">Importante:</span> cuando <span className="font-semibold">Mercado Pago</span> termine de procesar tu pago,
                permanece en la pantalla y no cierres ni recargues la ventana, ni pulses ningún botón. Te redirigiremos
                <span className="font-semibold"> automáticamente</span> y en ese momento generaremos y enviaremos el
                <span className="font-semibold"> correo de confirmación de tu compra</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                // Validate form; if invalid, close dialog (if open) and focus user on errors
                const valid = await trigger()
                if (!valid) {
                  setConfirmOpen(false)
                  toast.error('Por favor completa los campos requeridos antes de continuar.')
                  return
                }
                setConfirmOpen(true)
              }}
              className="space-y-6"
            >
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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Información de Dirección de Envío
                </h2>
                
                {/* Primera fila: Calle y Números */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calle *
                    </label>
                    <Input
                      type="text"
                      {...register('street')}
                      className={errors.street ? 'border-red-300 bg-red-50' : ''}
                      placeholder="Calle Reforma"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Exterior *
                    </label>
                    <Input
                      type="text"
                      {...register('exteriorNumber')}
                      className={errors.exteriorNumber ? 'border-red-300 bg-red-50' : ''}
                      placeholder="123"
                    />
                    {errors.exteriorNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.exteriorNumber.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Interior
                    </label>
                    <Input
                      type="text"
                      {...register('interiorNumber')}
                      className={errors.interiorNumber ? 'border-red-300 bg-red-50' : ''}
                      placeholder="4A"
                    />
                    {errors.interiorNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.interiorNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Segunda fila: Colonia y CP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colonia *
                    </label>
                    <Input
                      type="text"
                      {...register('colonia')}
                      className={errors.colonia ? 'border-red-300 bg-red-50' : ''}
                      placeholder="Centro"
                    />
                    {errors.colonia && (
                      <p className="mt-1 text-sm text-red-600">{errors.colonia.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <Input
                      type="text"
                      {...register('postalCode')}
                      className={errors.postalCode ? 'border-red-300 bg-red-50' : ''}
                      placeholder="06600"
                      maxLength="5"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Tercera fila: Estado, Ciudad y Alcaldía (condicional) */}
                <div className={`grid grid-cols-1 gap-4 ${watchedState === 'CDMX' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    {/* Hidden input to register field with RHF */}
                    <input type="hidden" {...register('state')} />
                    <Select
                      onValueChange={(value) => {
                        setValue('state', value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                        trigger('state')
                      }}
                      value={watchedState}
                    >
                      <SelectTrigger className={errors.state ? 'border-red-300 bg-red-50' : ''}>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {mexicanStates.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <Input
                      type="text"
                      {...register('city')}
                      className={errors.city ? 'border-red-300 bg-red-50' : ''}
                      placeholder="Ciudad de México"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  
                  {watchedState === 'CDMX' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alcaldía
                      </label>
                      <Input
                        type="text"
                        {...register('alcaldia')}
                        className={errors.alcaldia ? 'border-red-300 bg-red-50' : ''}
                        placeholder="Cuauhtémoc"
                      />
                      {errors.alcaldia && (
                        <p className="mt-1 text-sm text-red-600">{errors.alcaldia.message}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Cuarta fila: Referencias */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencias del Domicilio <span className="text-gray-500">(opcional)</span>
                  </label>
                  <Textarea
                    {...register('references')}
                    className={errors.references ? 'border-red-300 bg-red-50' : ''}
                    placeholder="Entre calle X y Y, edificio azul, portón negro..."
                    rows={3}
                  />
                  {errors.references && (
                    <p className="mt-1 text-sm text-red-600">{errors.references.message}</p>
                  )}
                </div>
              </div>

              {/* Botón de prueba eliminado para producción */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Redirigiendo a Mercado Pago...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Pagar con Mercado Pago
                  </>
                )}
              </Button>
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

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Listo para continuar con el pago?</DialogTitle>
              <DialogDescription>
                Al continuar te redirigiremos a Mercado Pago. Por favor, una vez completado el pago, permanece en la pantalla; te redirigiremos automáticamente para confirmar tu compra y enviar el correo de confirmación.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setConfirmOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Continuar a Mercado Pago
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 