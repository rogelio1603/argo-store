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
    
    // Force automatic redirect to success page
    preferenceData.auto_return = 'approved'
    
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
          colonia: payer.address?.colonia || '',
          state: payer.address?.state || '',
          city: payer.address?.city || '',
          zip_code: payer.address?.zip_code || ''
        }
      }
      
      // Add complete address info in additional_info for later retrieval
      if (!preferenceData.additional_info) {
        preferenceData.additional_info = {}
      }
      
      // Store complete address info in metadata for reliable retrieval
      preferenceData.metadata = {
        // Payer information
        payer_first_name: payer.name || '',
        payer_last_name: payer.surname || '',
        payer_email: payer.email || '',
        payer_phone: payer.phone?.number || '',
        
        // Complete address information
        address_street: payer.address?.street_name || '',
        address_colonia: payer.address?.colonia || '',
        address_state: payer.address?.state || '',
        address_city: payer.address?.city || '',
        address_alcaldia: payer.address?.alcaldia || '',
        address_zip_code: payer.address?.zip_code || '',
        address_references: payer.address?.references || '',
        
        // Items information (for backup)
        items_count: items.length,
        total_amount: mercadoPagoItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
      }
    }

    // Ensure metadata exists and include cart items so we can reconstruct order later
    preferenceData.metadata = {
      ...(preferenceData.metadata || {}),
      cart_items: items.map((it) => ({
        id: it.productId,
        title: it.name,
        size: it.size || '',
        quantity: it.quantity,
        unit_price: parseFloat(it.price),
        picture_url: it.image
      }))
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