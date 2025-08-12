import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { processApprovedPayment } from '@/lib/payment-processor'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request) {
  try {
    const { payment_id } = await request.json()
    
    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id is required' }, { status: 400 })
    }
    
    // Get payment details from MercadoPago
    const payment = new Payment(client)
    const paymentInfo = await payment.get({ id: payment_id })

    // Process the payment automatically (same logic as webhook)
    if (paymentInfo.status === 'approved') {
      const processingResult = await processApprovedPayment(paymentInfo, { sendEmail: true })
      
      if (processingResult.success) {
        console.log('🎉 AUTOMATIC PROCESSING SUCCESSFUL:', processingResult)
      } else if (processingResult.testPayment) {
        console.log('🧪 Test payment detected in automatic processing:', processingResult)
      } else if (processingResult.duplicate) {
        console.log('🔄 Duplicate payment in automatic processing:', processingResult)
      } else {
        console.log('❌ Automatic processing failed:', processingResult)
      }
      
      // Enrich response with items and shipping address so the success page can render details
      const additionalInfo = paymentInfo.additional_info || {}
      const metadata = paymentInfo.metadata || {}

      const items = (additionalInfo.items || []).map((it) => ({
        id: it.id,
        title: it.title,
        description: it.description,
        picture_url: it.picture_url,
        // Ensure numeric types
        quantity: typeof it.quantity === 'string' ? Number(it.quantity) : (it.quantity ?? 0),
        unit_price: typeof it.unit_price === 'string' ? Number(it.unit_price) : (it.unit_price ?? 0)
      }))

      const shippingAddress = {
        street: metadata.address_street || additionalInfo.payer?.address?.street_name || '',
        colonia: metadata.address_colonia || '',
        city: metadata.address_city || '',
        state: metadata.address_state || '',
        alcaldia: metadata.address_alcaldia || '',
        postalCode: metadata.address_zip_code || additionalInfo.payer?.address?.zip_code || '',
        references: metadata.address_references || ''
      }

      const orderTotal = items.reduce((sum, it) => sum + (Number(it.unit_price) * Number(it.quantity)), 0)

      return NextResponse.json({
        success: true,
        payment_id: paymentInfo.id,
        status: paymentInfo.status,
        live_mode: paymentInfo.live_mode,
        processing_result: processingResult,
        message: 'Payment processed automatically',
        automatic: true,
        order: {
          items,
          shippingAddress,
          totals: {
            total: orderTotal
          }
        }
      })
    } else {
      console.log(`⚠️ Payment not approved: ${paymentInfo.id} - Status: ${paymentInfo.status}`)
      return NextResponse.json({
        success: false,
        payment_id: paymentInfo.id,
        status: paymentInfo.status,
        message: 'Payment not approved',
        automatic: true
      })
    }

  } catch (error) {
    console.error('❌ Error in automatic payment processing:', error)
    
    return NextResponse.json({
      error: 'Error in automatic payment processing',
      details: error.message,
      automatic: true
    }, { status: 500 })
  }
} 