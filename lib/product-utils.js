// Utility functions for product categorization and URL generation

// Product type mapping based on keywords in product names
const PRODUCT_TYPE_MAPPING = {
  // Ropa subcategories
  'camiseta': 'AE',
  'playera': 'AE', 
  'polo': 'AE',
  'tank': 'AE',
  'blusa': 'AE',
  'top': 'AE',
  
  'pantalon': 'PT',
  'pants': 'PT',
  'jeans': 'PT',
  'jean': 'PT',
  'chinos': 'PT',
  'joggers': 'PT',
  'cargo': 'PT',
  'leggings': 'PT',
  
  'sudadera': 'SD',
  'hoodie': 'SD',
  'buzo': 'SD',
  'crewneck': 'SD',
  'sweatshirt': 'SD',
  
  'chaqueta': 'CH',
  'jacket': 'CH',
  'chamarra': 'CH',
  'bomber': 'CH',
  'abrigo': 'CH',
  'saco': 'CH',
  'blazer': 'CH',
  
  // Calzado subcategories
  'sneakers': 'SN',
  'tennis': 'SN',
  'zapatillas': 'SN',
  'deportivos': 'SN',
  'running': 'SN',
  'basketball': 'SN',
  
  'zapatos': 'CS',
  'loafers': 'CS',
  'oxford': 'CS',
  'mocasines': 'CS',
  'casuales': 'CS',
  
  'botas': 'BT',
  'boots': 'BT',
  'botines': 'BT',
  
  // Accesorios subcategories
  'gorra': 'GR',
  'cap': 'GR',
  'hat': 'GR',
  'sombrero': 'GR',
  'snapback': 'GR',
  'beanie': 'GR',
  
  'bolso': 'BG',
  'mochila': 'BG',
  'bag': 'BG',
  'backpack': 'BG',
  'riñonera': 'BG',
  'cartera': 'BG',
  'tote': 'BG',
  
  'collar': 'JY',
  'pulsera': 'JY',
  'anillo': 'JY',
  'aretes': 'JY',
  'pendientes': 'JY',
  'joyeria': 'JY',
  'jewelry': 'JY',
  'cadena': 'JY'
}

// Category mapping
const CATEGORY_MAPPING = {
  'ropa': ['camiseta', 'playera', 'polo', 'tank', 'blusa', 'top', 'pantalon', 'pants', 'jeans', 'jean', 'chinos', 'joggers', 'cargo', 'leggings', 'sudadera', 'hoodie', 'buzo', 'crewneck', 'sweatshirt', 'chaqueta', 'jacket', 'chamarra', 'bomber', 'abrigo', 'saco', 'blazer'],
  'calzado': ['sneakers', 'tennis', 'zapatillas', 'deportivos', 'running', 'basketball', 'zapatos', 'loafers', 'oxford', 'mocasines', 'casuales', 'botas', 'boots', 'botines'],
  'accesorios': ['gorra', 'cap', 'hat', 'sombrero', 'snapback', 'beanie', 'bolso', 'mochila', 'bag', 'backpack', 'riñonera', 'cartera', 'tote', 'collar', 'pulsera', 'anillo', 'aretes', 'pendientes', 'joyeria', 'jewelry', 'cadena']
}

/**
 * Detects the category of a product based on its name and other attributes
 * @param {Object} product - Product object with name, description, etc.
 * @returns {string} - Category name (ropa, calzado, accesorios, drops)
 */
export function detectProductCategory(product) {
  if (!product) return 'general'
  
  // If category is already defined in Strapi, use it
  if (product.category && product.category !== 'general') {
    return product.category.toLowerCase()
  }
  
  const searchText = `${product.name || ''} ${product.description || ''}`.toLowerCase()
  
  // Check each category for keyword matches
  for (const [category, keywords] of Object.entries(CATEGORY_MAPPING)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return category
      }
    }
  }
  
  // Default fallback
  return 'ropa' // Most products are likely to be clothing
}

/**
 * Detects the subcategory of a product based on its name and category
 * @param {Object} product - Product object with name, description, category
 * @returns {string} - Subcategory code (AE, PT, SN, etc.)
 */
export function detectProductSubcategory(product) {
  if (!product) return 'general'
  
  const searchText = `${product.name || ''} ${product.description || ''}`.toLowerCase()
  
  // Check for direct matches with product type mapping
  for (const [keyword, subcategory] of Object.entries(PRODUCT_TYPE_MAPPING)) {
    if (searchText.includes(keyword)) {
      return subcategory
    }
  }
  
  // Fallback based on detected category
  const category = detectProductCategory(product)
  const fallbackMap = {
    'ropa': 'AE',      // Default to Camisetas
    'calzado': 'SN',   // Default to Sneakers  
    'accesorios': 'GR', // Default to Gorras
    'drops': '1'       // Default to Drop 1
  }
  
  return fallbackMap[category] || 'general'
}

/**
 * Generates the correct product URL based on intelligent categorization
 * @param {Object} product - Product object
 * @returns {string} - Product URL path
 */
export function generateProductUrl(product) {
  if (!product) return '#'
  
  const category = detectProductCategory(product)
  const subcategory = detectProductSubcategory(product)
  const slug = product.slug || product.id
  
  return `/${category}/${subcategory}/${slug}`
}

/**
 * Gets the display name for a category
 * @param {string} category - Category code
 * @returns {string} - Display name
 */
export function getCategoryDisplayName(category) {
  const names = {
    'ropa': 'Ropa',
    'calzado': 'Calzado', 
    'accesorios': 'Accesorios',
    'drops': 'Drops'
  }
  return names[category?.toLowerCase()] || 'Productos'
}

/**
 * Gets the display name for a subcategory
 * @param {string} subcategory - Subcategory code
 * @returns {string} - Display name
 */
export function getSubcategoryDisplayName(subcategory) {
  const names = {
    // Ropa
    'AE': 'Camisetas',
    'PT': 'Pantalones', 
    'SD': 'Sudaderas',
    'CH': 'Chaquetas',
    
    // Calzado
    'SN': 'Sneakers',
    'CS': 'Casual',
    'BT': 'Botas',
    
    // Accesorios
    'GR': 'Gorras',
    'BG': 'Bolsos', 
    'JY': 'Joyería',
    
    // Drops
    '1': 'Drop Verano 2024',
    '2': 'Drop Urban Night',
    '3': 'Drop Retro Wave'
  }
  return names[subcategory] || 'General'
} 