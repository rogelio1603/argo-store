import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    // Most minimal preference possible
    const preferenceData = {
      items: [
        {
          id: 'test-1',
          title: 'Producto de Prueba',
          quantity: 1,
          unit_price: 100,
          currency_id: 'MXN'
        }
      ]
    }

    const preference = new Preference(client)
    const result = await preference.create({ body: preferenceData })

    return NextResponse.json({
      success: true,
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    })

  } catch (error) {
    console.error('Error in simple test:', error)
    console.error('Full error:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        error: error.message,
        full_error: error
      },
      { status: 500 }
    )
  }
} 