/**
 * Utility functions for price formatting
 */

/**
 * Formats a price with proper comma separators and decimal places
 * @param {number} price - The price to format
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} - Formatted price string
 */
export function formatPrice(price, locale = 'en-US') {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0.00'
  }
  
  return price.toLocaleString(locale, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
}

/**
 * Formats a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} - Formatted price string with currency
 */
export function formatPriceWithCurrency(price, currency = '$', locale = 'en-US') {
  return `${currency}${formatPrice(price, locale)}`
}

/**
 * Formats a discount percentage
 * @param {number} discount - The discount percentage
 * @returns {string} - Formatted discount string
 */
export function formatDiscount(discount) {
  if (typeof discount !== 'number' || isNaN(discount) || discount <= 0) {
    return ''
  }
  
  return `-${Math.round(discount)}%`
}

/**
 * Example usage:
 * formatPrice(1000) → "1,000.00"
 * formatPrice(1234.56) → "1,234.56"
 * formatPriceWithCurrency(1000) → "$1,000.00"
 * formatDiscount(25.5) → "-26%"
 */ 