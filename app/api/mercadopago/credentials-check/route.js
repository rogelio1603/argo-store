import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY

    if (!accessToken || !publicKey) {
      return NextResponse.json({
        error: 'Missing MercadoPago credentials',
        hasAccessToken: !!accessToken,
        hasPublicKey: !!publicKey
      }, { status: 400 })
    }

    // Determine environment based on credentials
    const isTestCredentials = accessToken.startsWith('TEST-')
    const isProductionCredentials = accessToken.startsWith('APP_USR-')
    
    const publicKeyIsTest = publicKey.startsWith('TEST-')
    const publicKeyIsProduction = publicKey.startsWith('APP_USR-')

    const credentialsMatch = (isTestCredentials && publicKeyIsTest) || 
                           (isProductionCredentials && publicKeyIsProduction)

    return NextResponse.json({
      environment: isProductionCredentials ? 'production' : 'test',
      accessToken: {
        type: isProductionCredentials ? 'production' : isTestCredentials ? 'test' : 'unknown',
        prefix: accessToken.substring(0, 10) + '...',
        isProduction: isProductionCredentials,
        isTest: isTestCredentials
      },
      publicKey: {
        type: publicKeyIsProduction ? 'production' : publicKeyIsTest ? 'test' : 'unknown',
        prefix: publicKey.substring(0, 10) + '...',
        isProduction: publicKeyIsProduction,
        isTest: publicKeyIsTest
      },
      credentialsMatch,
      recommendations: !credentialsMatch ? [
        'Las credenciales de Access Token y Public Key no coinciden',
        'Asegúrate de usar ambas credenciales del mismo entorno (test o producción)'
      ] : isProductionCredentials ? [
        '✅ Usando credenciales de PRODUCCIÓN',
        '🔴 Los pagos serán REALES - se cobrarán a las tarjetas',
        '⚠️ Asegúrate de tener todo configurado correctamente'
      ] : [
        '🧪 Usando credenciales de TEST',
        '✅ Los pagos son simulados - no se cobra dinero real',
        '💡 Para producción, cambia a credenciales APP_USR-'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error checking credentials:', error)
    
    return NextResponse.json({
      error: 'Error checking credentials',
      details: error.message
    }, { status: 500 })
  }
} 