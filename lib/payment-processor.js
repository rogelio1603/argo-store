import EmailTemplate from '@/components/EmailTemplate'
import { Resend } from 'resend'

// In-memory stores (in production, use a database)
const processedPayments = new Set()
const paymentTimestamps = new Map()
const emailSentPayments = new Set()

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send confirmation email
 * @param {Object} emailData - Email data
 * @returns {Promise} - Email sending result
 */
export async function sendConfirmationEmail({ to, firstName, lastName, paymentId, amount, currency, items, payer }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Argo Store <onboarding@resend.dev>', // Cambiar por tu dominio verificado
      to: [to || 'delivered@resend.dev'],
      subject: `Confirmación de pago - Pedido #${paymentId}`,
      react: EmailTemplate({ 
        firstName: firstName || 'Cliente',
        lastName: lastName || '',
        paymentId,
        amount,
        currency,
        items,
        payer
      }),
    })

    if (error) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`)
    }

    return { success: true, data }
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

/**
 * Check if a payment has already been processed
 * @param {string} paymentId - The payment ID
 * @returns {boolean} - True if already processed
 */
export function isPaymentAlreadyProcessed(paymentId) {
  return processedPayments.has(paymentId)
}

/**
 * Mark a payment as processed
 * @param {string} paymentId - The payment ID
 */
export function markPaymentAsProcessed(paymentId) {
  processedPayments.add(paymentId)
  paymentTimestamps.set(paymentId, new Date().toISOString())
}

/**
 * Check if an email has already been sent for a payment
 * @param {string} paymentId - The payment ID
 * @returns {boolean} - True if email already sent
 */
export function isEmailAlreadySent(paymentId) {
  return emailSentPayments.has(paymentId.toString())
}

/**
 * Mark that an email has been sent for a payment
 * @param {string} paymentId - The payment ID
 */
export function markEmailAsSent(paymentId) {
  emailSentPayments.add(paymentId.toString())
}

/**
 * Validate if payment is real (not a test payment)
 * @param {Object} paymentInfo - Payment information from MercadoPago
 * @returns {Object} - Validation result
 */
export function validateRealPayment(paymentInfo) {
  const validationResult = {
    isValid: false,
    isTestPayment: false,
    reasons: []
  }

  // For production credentials, we still want to validate test payments
  // Check if it's a test payment (live_mode should be true for real payments)
  if (paymentInfo.live_mode === false) {
    validationResult.isTestPayment = true
    validationResult.reasons.push('Payment is in test mode (live_mode: false)')
  }

  // If using production credentials but still receiving test users
  if (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR-') && paymentInfo.live_mode === false) {
    validationResult.isTestPayment = true
    validationResult.reasons.push('Test payment with production credentials')
  }

  // Check for test card patterns (common test card numbers)
  const testCardPatterns = [
    '4000', // Test Visa cards typically start with 4000
    '4444', // Another common test pattern
    '5555', // Test Mastercard
    '3711', // Test Amex
  ]

  if (paymentInfo.payment_method?.id === 'visa' || paymentInfo.payment_method?.id === 'master') {
    const firstFourDigits = paymentInfo.card?.first_six_digits?.substring(0, 4)
    if (firstFourDigits && testCardPatterns.some(pattern => firstFourDigits.startsWith(pattern))) {
      validationResult.isTestPayment = true
      validationResult.reasons.push(`Test card pattern detected: ${firstFourDigits}`)
    }
  }

  // Check transaction amount for obvious test amounts
  const testAmounts = [100, 1, 10, 0.01, 1000] // Common test amounts
  if (testAmounts.includes(paymentInfo.transaction_amount)) {
    validationResult.reasons.push(`Suspicious test amount: $${paymentInfo.transaction_amount}`)
  }

  // Additional validations for real payments
  if (!validationResult.isTestPayment) {
    // Check if payment has required fields for real payments
    if (!paymentInfo.payer?.email) {
      validationResult.reasons.push('Missing payer email')
    }

    if (!paymentInfo.external_reference) {
      validationResult.reasons.push('Missing external reference')
    }

    if (paymentInfo.transaction_amount < 1) {
      validationResult.reasons.push('Transaction amount too low for real payment')
    }

    // If no blocking reasons and not test payment, it's valid
    const blockingReasons = validationResult.reasons.filter(reason => 
      !reason.includes('Suspicious test amount')
    )
    
    if (blockingReasons.length === 0) {
      validationResult.isValid = true
    }
  }

  return validationResult
}

/**
 * Process approved payment
 * @param {Object} paymentInfo - Payment information from MercadoPago
 * @returns {Object} - Processing result
 */
export async function processApprovedPayment(paymentInfo, options = {}) {
  const { sendEmail = true } = options
  const paymentId = paymentInfo.id.toString()
  
  // Check if already processed
  if (isPaymentAlreadyProcessed(paymentId)) {
    // Log duplicate payment indicator
    console.log('🔄 baba 🔄') // Pago duplicado detectado
    
    return {
      success: true, // Changed to true for duplicate payments
      reason: 'Payment already processed',
      duplicate: true,
      paymentId: paymentInfo.id,
      amount: paymentInfo.transaction_amount,
      externalReference: paymentInfo.external_reference
    }
  }

  // Check if email has already been sent for this payment
  if (isEmailAlreadySent(paymentId)) {
    console.log('📧 EMAIL YA ENVIADO:', paymentId)
    
    return {
      success: true, // Changed to true for already sent emails
      reason: 'Email already sent for this payment',
      emailAlreadySent: true,
      paymentId: paymentInfo.id,
      amount: paymentInfo.transaction_amount,
      externalReference: paymentInfo.external_reference
    }
  }

  // Validate if it's a real payment
  const validation = validateRealPayment(paymentInfo)
  
  if (validation.isTestPayment) {
    // Log test payment indicator
    console.log('🧪 baba 🧪') // Pago de prueba detectado
    
    // Mark as processed to avoid reprocessing, but don't execute business logic
    markPaymentAsProcessed(paymentId)
    
    return {
      success: false,
      reason: 'Test payment detected',
      testPayment: true,
      validationReasons: validation.reasons
    }
  }

  if (!validation.isValid) {
    // Log validation failure indicator
    console.log('❌ baba ❌') // Validación de pago falló
    
    return {
      success: false,
      reason: 'Payment validation failed',
      validationReasons: validation.reasons
    }
  }
  
  try {
    // Here you would implement your business logic:
    // 1. Update order status in database
    // 2. Send confirmation email
    // 3. Update inventory
    // 4. Clear user's cart
    // 5. Create invoice/receipt

    // Mark as processed
    markPaymentAsProcessed(paymentId)

    // Send confirmation email (only if enabled)
    try {
      if (!sendEmail) {
        console.log('📧 Email sending disabled by option for payment:', paymentId)
        return {
          success: true,
          paymentId: paymentInfo.id,
          amount: paymentInfo.transaction_amount,
          externalReference: paymentInfo.external_reference,
          emailAlreadySent: isEmailAlreadySent(paymentId) || false
        }
      }
      // Double-check email hasn't been sent (race condition protection)
      if (isEmailAlreadySent(paymentId)) {
        console.log('📧 EMAIL YA ENVIADO (double-check):', paymentId)
        return {
          success: true,
          paymentId: paymentInfo.id,
          amount: paymentInfo.transaction_amount,
          externalReference: paymentInfo.external_reference,
          emailAlreadySent: true
        }
      }

      // Mark email as sent BEFORE sending to prevent race conditions
      markEmailAsSent(paymentId)
      console.log('📧 MARCADO COMO ENVIADO:', paymentId)

      // For testing: use your verified email if in development
      const emailTo = process.env.NODE_ENV === 'development' 
        ? 'rogeliooseguera16@gmail.com' 
        : paymentInfo.payer?.email;

      // Extraer items de la compra
      const items = paymentInfo.additional_info?.items?.map(item => ({
        description: item.description,
        picture_url: item.picture_url,
        quantity: item.quantity,
        title: item.title,
        unit_price: parseFloat(item.unit_price)
      })) || [];
      
      // Extraer datos del payer desde metadata (más confiable)
      const metadata = paymentInfo.metadata || {};
      const additionalInfo = paymentInfo.additional_info || {};
      
      // Construir objeto payer con datos de metadata (prioridad) y additional_info (fallback)
      const payer = {
        address: metadata.address_street || additionalInfo.payer?.address?.street_name || '',
        colonia: metadata.address_colonia || '',
        state: metadata.address_state || '',
        city: metadata.address_city || '',
        alcaldia: metadata.address_alcaldia || '',
        zip_code: metadata.address_zip_code || additionalInfo.payer?.address?.zip_code || '',
        references: metadata.address_references || ''
      };
         
      await sendConfirmationEmail({
        to: emailTo,
        firstName: metadata.payer_first_name || additionalInfo.payer?.first_name || 'Cliente',
        lastName: metadata.payer_last_name || additionalInfo.payer?.last_name || '',
        paymentId: paymentInfo.id,
        amount: paymentInfo.transaction_amount,
        currency: paymentInfo.currency_id,
        items: items,
        payer: payer
      })
      console.log('✅ Email sent successfully for payment:', paymentId)
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError)
      // If email fails, remove from sent list to allow retry
      emailSentPayments.delete(paymentId)
    }
    
    // Log success indicator
    console.log('🎉 bubu 🎉') // Pago procesado exitosamente

    return {
      success: true,
      paymentId: paymentInfo.id,
      amount: paymentInfo.transaction_amount,
      externalReference: paymentInfo.external_reference
    }

  } catch (error) {
    console.error(`Error processing payment ${paymentId}:`, error)
    
    // Log error indicator
    console.log('❌ baba ❌') // Error procesando pago
    
    return {
      success: false,
      reason: 'Processing error',
      error: error.message
    }
  }
}

/**
 * Get processing statistics
 * @returns {Object} - Processing stats
 */
export function getProcessingStats() {
  return {
    totalProcessed: processedPayments.size,
    processedPayments: Array.from(processedPayments),
    timestamps: Object.fromEntries(paymentTimestamps),
    emailsSent: emailSentPayments.size,
    emailSentPayments: Array.from(emailSentPayments)
  }
}

/**
 * Clear processed payments (for testing purposes)
 */
export function clearProcessedPayments() {
  processedPayments.clear()
  paymentTimestamps.clear()
  emailSentPayments.clear()
} 