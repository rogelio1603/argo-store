import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

export async function POST(request) {
  try {
    const { items, payer } = await request.json()

    // Validate production credentials
    if (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-')) {
      console.warn('⚠️ WARNING: Using TEST credentials in production mode')
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Transform cart items to MercadoPago format
    const mercadoPagoItems = items.map(item => ({
      id: item.productId.toString(),
      title: item.name,
      description: `${item.name}${item.size ? ` - Talla: ${item.size}` : ''}`,
      picture_url: item.image,
      category_id: 'fashion',
      quantity: item.quantity,
      unit_price: parseFloat(item.price),
      currency_id: 'MXN'
    }))

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Validate URL format
    const validBaseUrl = baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`
    
    // Create preference with production settings
    const preferenceData = {
      items: mercadoPagoItems,
      external_reference: `order_${Date.now()}`,
      statement_descriptor: 'ARGO STORE'
    }

    // Always add back_urls for production environment
    preferenceData.back_urls = {
      success: `${validBaseUrl}/payment/success`,
      failure: `${validBaseUrl}/payment/failure`,
      pending: `${validBaseUrl}/payment/pending`
    }
    
    // Always add notification URL for webhooks
    preferenceData.notification_url = `${validBaseUrl}/api/mercadopago/webhook`

    // Add payer information if provided
    if (payer?.email) {
      preferenceData.payer = {
        name: payer.name || '',
        surname: payer.surname || '',
        email: payer.email,
        phone: {
          area_code: '52',
          number: payer.phone?.number || ''
        },
        address: {
          street_name: payer.address?.street_name || '',
          zip_code: payer.address?.zip_code || ''
        }
      }
    }

    const preference = new Preference(client)
    const result = await preference.create({ body: preferenceData })

    // ALWAYS use init_point for production (never sandbox_init_point)
    const paymentUrl = result.init_point

    if (!paymentUrl) {
      throw new Error('No payment URL received from MercadoPago')
    }

    return NextResponse.json({
      id: result.id,
      init_point: paymentUrl,
      // Don't return sandbox URL in production
      environment: 'production',
      payment_url: paymentUrl
    })

  } catch (error) {
    console.error('Error creating MercadoPago PRODUCTION preference:', error)
    console.error('Full error object:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        error: 'Error creating payment preference', 
        details: error.message,
        status: error.status || 500,
        mercadopago_error: error.cause || error.response?.data
      },
      { status: 500 }
    )
  }
} 