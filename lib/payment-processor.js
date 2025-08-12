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
    // Lazily import the email template to avoid bundling/react-dom conflicts during build
    const { default: EmailTemplate } = await import('@/components/EmailTemplate')
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
      
      // Build full customer name for Strapi
      const firstName = metadata.payer_first_name || additionalInfo.payer?.first_name || ''
      const lastNamePaterno = metadata.payer_last_name_paterno || metadata.payer_last_name || additionalInfo.payer?.last_name || ''
      const lastNameMaterno = metadata.payer_last_name_materno || ''
      const customerName = [firstName, lastNamePaterno, lastNameMaterno].filter(Boolean).join(' ').trim()

      // After a successful email, create a Sale entry in Strapi (v5)
      try {
        // Prefer cart_items from metadata if present since it includes size and image
        const itemsForStrapi = Array.isArray(metadata.cart_items) && metadata.cart_items.length > 0
          ? metadata.cart_items.map((ci) => ({
              id: ci.id,
              title: ci.title,
              size: ci.size || '',
              quantity: Number(ci.quantity) || 0,
              unit_price: Number(ci.unit_price) || 0,
              picture_url: ci.picture_url || ''
            }))
          : items

        await createStrapiSaleEntry({
          items: itemsForStrapi,
          payer,
          paymentInfo: {
            id: paymentInfo.id,
            external_reference: paymentInfo.external_reference,
            total: paymentInfo.transaction_amount,
            currency: paymentInfo.currency_id,
            status: paymentInfo.status
          },
          customerName
        })
      } catch (strapiErr) {
        console.error('⚠️ Error creating Strapi sale entry (non-blocking):', strapiErr)
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError)
      // If email fails, remove from sent list to allow retry
      emailSentPayments.delete(paymentId)
    }
    
    return {
      success: true,
      paymentId: paymentInfo.id,
      amount: paymentInfo.transaction_amount,
      externalReference: paymentInfo.external_reference
    }

  } catch (error) {
    console.error(`Error processing payment ${paymentId}:`, error)
    
    return {
      success: false,
      reason: 'Processing error',
      error: error.message
    }
  }
}

/**
 * Create a Sale entry in Strapi (v5) using REST API
 * Requires environment variables:
 *  - STRAPI_BASE_URL (e.g. https://cms.example.com)
 *  - STRAPI_API_TOKEN (Strapi API token with create permissions)
 * Optional:
 *  - STRAPI_SALES_COLLECTION_SLUG (default: 'ventas')
 */
async function createStrapiSaleEntry({ items, payer, paymentInfo, customerName }) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_HOST
  const apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN
  const collection = process.env.NEXT_PUBLIC_STRAPI_SALES_COLLECTION_SLUG
    || process.env.STRAPI_SALES_COLLECTION_SLUG
    || 'ventas'

  if (!baseUrl || !apiToken) {
    throw new Error('Missing NEXT_PUBLIC_STRAPI_HOST or NEXT_PUBLIC_STRAPI_TOKEN env vars')
  }

  // Prepare auth header early so helpers can use it
  const authHeader = apiToken.startsWith('Bearer ') ? apiToken : `Bearer ${apiToken}`

  // Build readable shipping address string
  const shippingAddress = buildAddressString(payer)

  // Compute total quantity from items for Strapi field "cantidad"
  const totalQuantity = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)

  // Customer label (full name preferred)
  const customerLabel = customerName && customerName.length > 0
    ? customerName
    : (paymentInfo?.id ? `PAY-${paymentInfo.id}` : 'CLIENTE')
  // Normalize items to match Strapi component field names
  const normalizedItems = (Array.isArray(items) ? items : []).map((it) => {
    const quantity = Number(it.quantity) || 0
    const unitPrice = Number(it.unit_price ?? it.price) || 0
    return {
      nombre_producto: (it.nombre_producto ?? (it.title ?? it.name)) ?? '',
      talla: String((it.talla ?? it.size) || ''),
      cantidad_de_productos_comprados: quantity,
      precio_unitario: unitPrice,
      subtotal: Number((quantity * unitPrice).toFixed(2)),
      imagen_producto: (it.imagen_producto ?? (it.picture_url ?? it.image)) || ''
    }
  })

  // If the component field `imagen_producto` is Media, resolve media IDs by URL
  async function resolveMediaIdsForItems(rawItems) {
    const toRelative = (url) => {
      try {
        if (!url) return ''
        if (url.startsWith('http')) {
          const u = new URL(url)
          return u.pathname
        }
        return url
      } catch {
        return ''
      }
    }

    async function findMediaIdByUrl(relativeUrl) {
      if (!relativeUrl) return null
      const search = new URLSearchParams({ 'filters[url][$eq]': relativeUrl })
      const r = await fetch(`${baseUrl.replace(/\/$/, '')}/api/upload/files?${search.toString()}`, {
        headers: { Authorization: authHeader }
      })
      if (!r.ok) return null
      const arr = await r.json().catch(() => null)
      if (Array.isArray(arr) && arr.length > 0 && arr[0]?.id) return arr[0].id
      // Fallback by filename if url lookup fails
      const filename = relativeUrl.split('/').pop()
      if (!filename) return null
      const r2 = await fetch(`${baseUrl.replace(/\/$/, '')}/api/upload/files?filters[name][$eq]=${encodeURIComponent(filename)}`, {
        headers: { Authorization: authHeader }
      })
      if (!r2.ok) return null
      const arr2 = await r2.json().catch(() => null)
      if (Array.isArray(arr2) && arr2.length > 0 && arr2[0]?.id) return arr2[0].id
      return null
    }

    const resolved = await Promise.all(
      rawItems.map(async (it) => {
        const value = it.imagen_producto
        if (typeof value === 'number') return it
        if (typeof value === 'string' && value.length > 0) {
          const rel = toRelative(value)
          const id = await findMediaIdByUrl(rel)
          if (id) {
            return { ...it, imagen_producto: id }
          }
          // If not found, omit the field to avoid validation error
          const { imagen_producto, ...rest } = it
          return rest
        }
        return it
      })
    )
    return resolved
  }

  const itemsWithMediaIds = await resolveMediaIdsForItems(normalizedItems)

  // Strapi v5 REST create payload (match your model fields exactly)
  const payload = {
    data: {
      cliente: customerLabel || 'CLIENTE',
      direccion_envio: shippingAddress,
      cantidad: Number.isFinite(totalQuantity) ? totalQuantity : 0
    }
  }

  // Optional: include order item details into a JSON field if enabled via env
  // Configure with NEXT_PUBLIC_STRAPI_SALES_INCLUDE_DETAILS=true and
  // NEXT_PUBLIC_STRAPI_SALES_DETAILS_FIELD=detalles (defaults to 'detalles')
  const includeDetails = process.env.NEXT_PUBLIC_STRAPI_SALES_INCLUDE_DETAILS === 'true'
  const detailsFieldName = process.env.NEXT_PUBLIC_STRAPI_SALES_DETAILS_FIELD || 'detalles'
  if (includeDetails) {
    payload.data[detailsFieldName] = normalizedItems
  }

  // Optional: include order total if you add the field in Strapi
  const includeTotal = process.env.NEXT_PUBLIC_STRAPI_SALES_INCLUDE_TOTAL === 'true'
  const totalFieldName = process.env.NEXT_PUBLIC_STRAPI_SALES_TOTAL_FIELD || 'total'
  if (includeTotal) {
    const orderTotal = normalizedItems.reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0)
    payload.data[totalFieldName] = Number(orderTotal.toFixed(2))
  }

  // Send items as repeatable component field (structured Option B).
  // Field name in Strapi: 'productos_comprados' (component: order_item)
  payload.data.productos_comprados = itemsWithMediaIds

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/${collection}`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Strapi create failed: ${res.status} ${res.statusText} ${errText}`)
  }

  const json = await res.json()
  return json
}

function buildAddressString(payer) {
  if (!payer) return ''
  const parts = []
  if (payer.address) parts.push(payer.address)
  if (payer.colonia) parts.push(`Col. ${payer.colonia}`)
  const cityState = [payer.city, payer.state].filter(Boolean).join(', ')
  if (cityState) parts.push(cityState)
  if (payer.alcaldia) parts.push(`Alcaldía ${payer.alcaldia}`)
  if (payer.zip_code) parts.push(`C.P. ${payer.zip_code}`)
  if (payer.references) parts.push(`Ref: ${payer.references}`)
  return parts.join(' | ')
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