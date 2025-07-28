import { NextResponse } from 'next/server'
import { PaymentProcessor } from '@/lib/payment-processor'

export async function POST(request) {
  try {
    // In production, you might want to add authentication here
    // For now, we'll allow it in development mode
    
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      )
    }

    PaymentProcessor.clearProcessedPayments()
    
    return NextResponse.json({
      success: true,
      message: 'Processed payments cache cleared successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error clearing processed payments:', error)
    
    return NextResponse.json(
      { error: 'Error clearing processed payments', details: error.message },
      { status: 500 }
    )
  }
} 