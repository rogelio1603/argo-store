"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Truck, Shield, RotateCcw, ZoomIn } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { detectProductCategory, detectProductSubcategory, getCategoryDisplayName, getSubcategoryDisplayName } from "@/lib/product-utils"
import { ProductCard } from "@/components/ProductCard"
import { fetchProducts } from "@/lib/products"
import { SizeGuideDialog } from "@/components/SizeGuideDialog"
import useCartStore from "@/lib/cart-store"

// Removed COLOR_CLASSES since we're now using images instead of colors

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export function ProductDetailPage({ product, categories = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  
  // Cart store
  const { addItem } = useCartStore()

  // Extract unique images from inventario data
  const getAvailableImages = () => {
    if (!product.inventario || !Array.isArray(product.inventario)) {
      // Fallback to old structure for compatibility
      if (!product.stock_por_color_talla || !Array.isArray(product.stock_por_color_talla)) {
        return []
      }
      
      const imagesMap = new Map()
      product.stock_por_color_talla.forEach(stockItem => {
        if (stockItem.imagenes && Array.isArray(stockItem.imagenes)) {
          stockItem.imagenes.forEach(imagen => {
            if (imagen && imagen.id && !imagesMap.has(imagen.id)) {
              imagesMap.set(imagen.id, {
                ...imagen,
                stockItemId: stockItem.id,
                stockPorTalla: [{ talla: stockItem.talla, stock: stockItem.stock }]
              })
            }
          })
        }
      })
      return Array.from(imagesMap.values())
    }

    const imagesMap = new Map()
    
    product.inventario.forEach(inventarioItem => {
      if (inventarioItem.imagenes && Array.isArray(inventarioItem.imagenes)) {
        inventarioItem.imagenes.forEach(imagen => {
          if (imagen && imagen.id && !imagesMap.has(imagen.id)) {
            imagesMap.set(imagen.id, {
              ...imagen,
              inventarioItemId: inventarioItem.id,
              stockPorTalla: inventarioItem.stock_por_talla || []
            })
          }
        })
      }
    })
    
    return Array.from(imagesMap.values())
  }

  const availableImages = getAvailableImages()

  // Extract unique sizes from inventario data
  const getAvailableSizes = () => {
    if (!product.inventario || !Array.isArray(product.inventario)) {
      // Fallback to old structure for compatibility
      if (!product.stock_por_color_talla || !Array.isArray(product.stock_por_color_talla)) {
        return SIZES // fallback to default sizes
      }
      
      const sizesSet = new Set()
      product.stock_por_color_talla.forEach(stockItem => {
        if (stockItem.talla) {
          sizesSet.add(stockItem.talla)
        }
      })
      const availableSizes = Array.from(sizesSet)
      return SIZES.filter(size => availableSizes.includes(size))
        .concat(availableSizes.filter(size => !SIZES.includes(size)))
    }

    const sizesSet = new Set()
    
    product.inventario.forEach(inventarioItem => {
      if (inventarioItem.stock_por_talla && Array.isArray(inventarioItem.stock_por_talla)) {
        inventarioItem.stock_por_talla.forEach(stockTalla => {
          if (stockTalla.talla) {
            sizesSet.add(stockTalla.talla)
          }
        })
      }
    })
    
    // Convert to array and sort by predefined order
    const availableSizes = Array.from(sizesSet)
    return SIZES.filter(size => availableSizes.includes(size))
      .concat(availableSizes.filter(size => !SIZES.includes(size)))
  }

  const availableSizes = getAvailableSizes()

  // Get stock for specific image and size combination
  const getStockForSelection = (imageId, sizeName) => {
    if (!product.inventario || !Array.isArray(product.inventario)) {
      // Fallback to old structure for compatibility
      if (!product.stock_por_color_talla || !Array.isArray(product.stock_por_color_talla)) {
        return 0
      }
      
      const stockItem = product.stock_por_color_talla.find(item => {
        if (!item.imagenes || !Array.isArray(item.imagenes)) return false
        const hasImage = item.imagenes.some(img => img.id === imageId)
        return hasImage && item.talla === sizeName
      })
      
      return stockItem ? stockItem.stock || 0 : 0
    }

    // Find the inventario item that contains the image
    const inventarioItem = product.inventario.find(item => {
      if (!item.imagenes || !Array.isArray(item.imagenes)) return false
      return item.imagenes.some(img => img.id === imageId)
    })

    if (!inventarioItem || !inventarioItem.stock_por_talla) {
      return 0
    }

    // Find the stock for the specific size in this inventario item
    const stockTalla = inventarioItem.stock_por_talla.find(st => st.talla === sizeName)
    
    return stockTalla ? stockTalla.stock || 0 : 0
  }

  // Check if a size is available for selected image
  const isSizeAvailable = (sizeName) => {
    if (!selectedImage) return true
    return getStockForSelection(selectedImage.id, sizeName) > 0
  }

  // Get available sizes for selected image
  const getAvailableSizesForImage = (imageId) => {
    if (!imageId) return availableSizes
    return availableSizes.filter(size => getStockForSelection(imageId, size) > 0)
  }

  // Auto-select first available size when image changes
  const handleImageSelection = (imageData) => {
    setSelectedImage(imageData)
    setCurrentImageIndex(0) // Reset to first image view
    const availableSizesForImage = getAvailableSizesForImage(imageData.id)
    if (availableSizesForImage.length > 0) {
      setSelectedSize(availableSizesForImage[0])
    } else {
      setSelectedSize(null)
    }
  }

  // Get total stock for current selection
  const currentStock = selectedImage && selectedSize ? getStockForSelection(selectedImage.id, selectedSize) : 0

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedImage || !selectedSize || currentStock === 0) return
    
    addItem(product, selectedImage, selectedSize, quantity)
    
    // Optional: Show success message or reset quantity
    setQuantity(1)
  }

  // Handle buy now (same as add to cart for now, but could redirect to checkout)
  const handleBuyNow = () => {
    if (!selectedImage || !selectedSize || currentStock === 0) return
    
    addItem(product, selectedImage, selectedSize, quantity)
    
    // Could redirect to checkout page here
    // router.push('/checkout')
  }
  
  // Get all available images from inventario data for the main gallery
  const getAllProductImages = () => {
    const allImages = []
    
    // Add main product image first
    if (product.image) {
      allImages.push({ 
        url: product.image, 
        alternativeText: product.name 
      })
    }
    
    // Add all images from inventario
    if (product.inventario && Array.isArray(product.inventario)) {
      product.inventario.forEach(inventarioItem => {
        if (inventarioItem.imagenes && Array.isArray(inventarioItem.imagenes)) {
          inventarioItem.imagenes.forEach(imagen => {
            // Avoid duplicates by checking URL
            if (!allImages.some(img => img.url === imagen.url)) {
              allImages.push({
                url: imagen.url,
                alternativeText: imagen.alternativeText || `${product.name} - Variant`
              })
            }
          })
        }
      })
    }
    // Fallback to old structure for compatibility
    else if (product.stock_por_color_talla && Array.isArray(product.stock_por_color_talla)) {
      product.stock_por_color_talla.forEach(stockItem => {
        if (stockItem.imagenes && Array.isArray(stockItem.imagenes)) {
          stockItem.imagenes.forEach(imagen => {
            // Avoid duplicates by checking URL
            if (!allImages.some(img => img.url === imagen.url)) {
              allImages.push({
                url: imagen.url,
                alternativeText: imagen.alternativeText || `${product.name} - ${stockItem.talla}`
              })
            }
          })
        }
      })
    }
    
    // Fallback to regular product images if no stock images
    if (allImages.length === 0 && product.images?.length > 0) {
      return product.images
    }
    
    // Final fallback
    if (allImages.length === 0) {
      return [{ url: product.image || '/api/placeholder/400/400', alternativeText: product.name }]
    }
    
    return allImages
  }
  
  const images = getAllProductImages()

  // Auto-select first available image and size on component mount
  useEffect(() => {
    if (availableImages.length > 0 && !selectedImage) {
      const firstImage = availableImages[0]
      handleImageSelection(firstImage)
    }
  }, [availableImages.length, selectedImage])
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  
  const increaseQuantity = () => {
    if (currentStock === 0 || quantity >= currentStock) return
    setQuantity(prev => prev + 1)
  }
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  // Generate breadcrumb based on product category information
  const getBreadcrumbInfo = () => {
    // Use Strapi category info if available
    if (product.categoria_global && product.categoria_nombre) {
      return {
        categorySlug: product.categoria_global.toLowerCase().replace(/\s+/g, '-'),
        categoryName: product.categoria_global,
        subcategorySlug: product.categoria_slug || product.categoria_nombre.toLowerCase().replace(/\s+/g, '-'),
        subcategoryName: product.categoria_nombre
      }
    }
    
    // Fallback to intelligent detection
    const detectedCategory = detectProductCategory(product)
    const detectedSubcategory = detectProductSubcategory(product)
    const categoryDisplayName = getCategoryDisplayName(detectedCategory)
    const subcategoryDisplayName = getSubcategoryDisplayName(detectedSubcategory)
    
    return {
      categorySlug: detectedCategory,
      categoryName: categoryDisplayName,
      subcategorySlug: detectedSubcategory,
      subcategoryName: subcategoryDisplayName
    }
  }
  
  const breadcrumbInfo = getBreadcrumbInfo()
  
  // Determine size guide category based on product
  const getSizeGuideCategory = () => {
    const productName = product.name?.toLowerCase() || ''
    const productDesc = product.description?.toLowerCase() || ''
    const searchText = `${productName} ${productDesc}`
    
    // Check if it's calzado - use breadcrumbInfo or search text
    const isFootwear = breadcrumbInfo.categorySlug === 'calzado' || 
                      breadcrumbInfo.categoryName.toLowerCase().includes('calzado') ||
                      searchText.includes('zapato') || searchText.includes('sneaker') || 
                      searchText.includes('bota') || searchText.includes('sandalia') ||
                      searchText.includes('zapatilla') || searchText.includes('tennis')
    
    if (isFootwear) {
      return "calzado"
    }
    
    // Check if it's pantalones
    if (searchText.includes('pantalon') || searchText.includes('jean') || 
        searchText.includes('pants') || searchText.includes('cargo') ||
        searchText.includes('jogger') || searchText.includes('chino')) {
      return "pantalones"
    }
    
    // Check if it's an extra large size product
    if (searchText.includes('3xl') || searchText.includes('4xl') || 
        searchText.includes('5xl') || searchText.includes('6xl') ||
        searchText.includes('talla extra') || searchText.includes('plus size')) {
      return "polo-extra"
    }
    
    // Default to regular clothing sizes
    return "polo-camisa"
  }
  
  const breadcrumbs = [
    { name: 'Inicio', href: '/' },
    { name: breadcrumbInfo.categoryName, href: `/${breadcrumbInfo.categorySlug}` },
    { name: breadcrumbInfo.subcategoryName, href: `/${breadcrumbInfo.categorySlug}/${breadcrumbInfo.subcategorySlug}` },
    { name: product.name, href: '#' }
  ]

  // Load related products based on category/subcategory
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return
      
      setLoadingRelated(true)
      try {
        // Fetch products from the same category/subcategory
        const response = await fetchProducts({ pageParam: 1, pageSize: 16 })
        
        if (response?.data) {
          // Filter out the current product and products from the same category
          const filtered = response.data
            .filter(p => p.id !== product.id)
            .filter(p => {
              // Use Strapi category info if available
              if (product.categoria_global) {
                return p.categoria_global === product.categoria_global
              }
              
              // Fallback to intelligent detection
              const pCategory = detectProductCategory(p)
              const currentCategory = detectProductCategory(product)
              return pCategory === currentCategory
            })
            .slice(0, 4)
          
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error('Error loading related products:', error)
      } finally {
        setLoadingRelated(false)
      }
    }

    loadRelatedProducts()
  }, [product])

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.name}>
              {index > 0 && <span className="mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-gray-700">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              {product.isOnSale && (
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold rounded z-10">
                  OFERTA
                </div>
              )}
              
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <img
                src={images[currentImageIndex]?.url || product.image}
                alt={images[currentImageIndex]?.alternativeText || product.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alternativeText || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-4 sm:space-y-6 mt-6 lg:mt-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-base sm:text-lg text-red-500 font-semibold">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Characteristics */}
            {product.characteristics && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Características:</h3>
                <ul className="space-y-1">
                  {product.characteristics.split('\n').filter(char => char.trim()).map((characteristic, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {characteristic}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Image Selection */}
            {availableImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Variantes:
                  </h3>
              </div>
                <div className="flex flex-wrap gap-3">
                  {availableImages.map((imageData) => {
                    const isSelected = selectedImage?.id === imageData.id
                    
                    return (
                  <button
                        key={imageData.id}
                        onClick={() => handleImageSelection(imageData)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${
                          isSelected
                        ? 'ring-2 ring-red-500 ring-offset-2 border-red-500'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                        title={`Talla ${imageData.talla} - ${imageData.stock} en stock`}
                  >
                    <img
                      src={imageData.url}
                      alt={imageData.alternativeText || `Talla ${imageData.talla}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Talla: {selectedSize ? selectedSize : 'Selecciona una talla'}
                </h3>
                <SizeGuideDialog category={getSizeGuideCategory()}>
                  <button className="text-xs sm:text-sm text-red-500 hover:text-red-600 underline cursor-pointer">
                    Guía de tallas
                  </button>
                </SizeGuideDialog>
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {availableSizes.map((size) => {
                  const isAvailable = isSizeAvailable(size)
                  const isSelected = selectedSize === size
                  
                  return (
                                      <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-2 sm:py-3 px-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : isAvailable
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                    {size}
                  </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Cantidad</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={currentStock === 0 || quantity >= currentStock}
                    className={`p-2 transition-colors ${
                      currentStock === 0 || quantity >= currentStock
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    +
                  </button>
                </div>
                <span className={`text-sm ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedImage && selectedSize 
                    ? currentStock > 0 
                      ? `${currentStock} en stock`
                      : 'Sin stock'
                    : 'Selecciona variante y talla'
                  }
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button 
                onClick={handleBuyNow}
                disabled={currentStock === 0 || !selectedImage || !selectedSize}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-md transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  currentStock === 0 || !selectedImage || !selectedSize
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                <span>
                  {!selectedImage || !selectedSize 
                    ? 'Selecciona variante y talla' 
                    : currentStock === 0 
                    ? 'Sin stock' 
                    : 'Comprar Ahora'
                  }
                </span>
              </button>
              
              <button 
                onClick={handleAddToCart}
                disabled={currentStock === 0 || !selectedImage || !selectedSize}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-md transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  currentStock === 0 || !selectedImage || !selectedSize
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  {!selectedImage || !selectedSize 
                    ? 'Selecciona opciones' 
                    : currentStock === 0 
                    ? 'Sin stock' 
                    : 'Agregar al Carrito'
                  }
                </span>
              </button>
            </div>
            {/* Additional benefits section */}
            <div className="flex flex-col space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span>Envío gratis en compras mayores a $500</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                  <span>30 días para devoluciones</span>
                </div>
              </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="py-8 sm:py-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                También te podría <span className="text-red-500">gustar</span>
              </h2>
            </div>

            {loadingRelated ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-600">Cargando productos relacionados...</span>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500">No se encontraron productos relacionados</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
                             <img
                src={images[currentImageIndex]?.url || product.image}
                alt={images[currentImageIndex]?.alternativeText || product.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
} 