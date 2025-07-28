import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { PaymentProcessor } from '@/lib/payment-processor'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const body = await request.json()

    // MercadoPago sends notifications for different events
    if (body.type === 'payment') {
      const paymentId = body.data.id

      if (!paymentId) {
        console.error('No payment ID found in webhook data')
        return NextResponse.json({ received: true, error: 'No payment ID' })
      }

      // Check if payment already processed to avoid duplicate processing
      if (PaymentProcessor.isPaymentAlreadyProcessed(paymentId.toString())) {
        return NextResponse.json({ 
          received: true, 
          status: 'already_processed',
          paymentId 
        })
      }
    } else {
      console.log(`Non-payment notification received: ${body.type}`)
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      type: body.type,
      paymentId: body.data?.id 
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    // Still return 200 to avoid MercadoPago retrying indefinitely
    return NextResponse.json({ 
      received: true, 
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

// Handle GET requests (MercadoPago sends a GET to verify the endpoint)
export async function GET() {
  return NextResponse.json({ 
    status: 'webhook endpoint active',
    timestamp: new Date().toISOString(),
    stats: PaymentProcessor.getProcessingStats()
  })
} 