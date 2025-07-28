import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
    hasPublicKey: !!process.env.MERCADOPAGO_PUBLIC_KEY,
    timestamp: new Date().toISOString()
  })
} 