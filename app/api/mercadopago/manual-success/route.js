import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('payment_id')
    const preferenceId = searchParams.get('preference_id')
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Get payment details from MercadoPago
    const payment = new Payment(client)
    const paymentInfo = await payment.get({ id: paymentId })

    // Prepare redirect URL based on payment status
    let redirectUrl = '/payment/failure'
    
    if (paymentInfo.status === 'approved') {
      redirectUrl = `/payment/success?payment_id=${paymentId}&status=approved&external_reference=${paymentInfo.external_reference}&collection_status=approved`
    } else if (paymentInfo.status === 'pending') {
      redirectUrl = `/payment/pending?payment_id=${paymentId}&status=pending&external_reference=${paymentInfo.external_reference}`
    } else {
      redirectUrl = `/payment/failure?payment_id=${paymentId}&status=${paymentInfo.status}&external_reference=${paymentInfo.external_reference}`
    }

    // Return redirect response
    return NextResponse.redirect(new URL(redirectUrl, request.url))

  } catch (error) {
    console.error('Error verifying payment:', error)
    
    return NextResponse.redirect(
      new URL('/payment/failure?error=verification_failed', request.url)
    )
  }
}

export async function POST(request) {
  try {
    const { payment_id } = await request.json()
    
    if (!payment_id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Get payment details from MercadoPago
    const payment = new Payment(client)
    const paymentInfo = await payment.get({ id: payment_id })
    
    return NextResponse.json({
      payment_id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
      payment_method: paymentInfo.payment_method_id,
      date_created: paymentInfo.date_created,
      date_approved: paymentInfo.date_approved
    })

  } catch (error) {
    console.error('Error verifying payment via POST:', error)
    
    return NextResponse.json(
      { error: 'Error verifying payment', details: error.message },
      { status: 500 }
    )
  }
} 