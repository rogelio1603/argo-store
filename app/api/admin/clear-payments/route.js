import { NextResponse } from 'next/server'

// Ensure this route is never statically analyzed or prerendered
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    // Import only when needed to avoid bundling/initializing heavy code during build
    const { clearProcessedPayments } = await import('@/lib/payment-processor')
    clearProcessedPayments()
    
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