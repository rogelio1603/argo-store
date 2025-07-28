"use client"

import { useState, useEffect } from "react"
import { fetchProducts } from "@/lib/products"
import { fetchProductsServer } from "@/lib/products-server"
import { detectProductCategory, detectProductSubcategory } from "@/lib/product-utils"

export default function TestRelatedProductsPage() {
  const [serverProducts, setServerProducts] = useState([])
  const [clientProducts, setClientProducts] = useState([])
  const [serverError, setServerError] = useState(null)
  const [clientError, setClientError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  
  // Test server-side fetch
  useEffect(() => {
    const testServerFetch = async () => {
      try {
        const response = await fetchProductsServer({ pageSize: 10 })
        setServerProducts(response?.data || [])
      } catch (error) {
        setServerError(error.message)
      }
    }
    
    testServerFetch()
  }, [])
  
  // Test client-side fetch
  useEffect(() => {
    const testClientFetch = async () => {
      try {
        const response = await fetchProducts({ pageParam: 1, pageSize: 10 })
        setClientProducts(response?.data || [])
      } catch (error) {
        setClientError(error.message)
      }
    }
    
    testClientFetch()
  }, [])
  
  // Get related products for selected product
  const getRelatedProducts = async (product) => {
    if (!product) return
    
    try {
      const response = await fetchProducts({ pageParam: 1, pageSize: 12 })
      
      if (response?.data) {
        const filtered = response.data
          .filter(p => p.id !== product.id)
          .filter(p => {
            // Use Strapi category info if available
            if (product.categoria_global && product.categoria_nombre) {
              const matchesGlobal = p.categoria_global === product.categoria_global
              const matchesNombre = p.categoria_nombre === product.categoria_nombre
              return matchesGlobal || matchesNombre
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
      console.error('Error getting related products:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Related Products</h1>
        
        {/* Server vs Client Fetch Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Server Fetch Results */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Server-side Fetch</h2>
            {serverError ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700">Error: {serverError}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Products fetched: {serverProducts.length}
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {serverProducts.map(product => (
                    <div key={product.id} className="border p-2 rounded text-sm">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        Global: {product.categoria_global || 'N/A'} | 
                        Nombre: {product.categoria_nombre || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Client Fetch Results */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Client-side Fetch</h2>
            {clientError ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700">Error: {clientError}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Products fetched: {clientProducts.length}
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {clientProducts.map(product => (
                    <div key={product.id} className="border p-2 rounded text-sm">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        Global: {product.categoria_global || 'N/A'} | 
                        Nombre: {product.categoria_nombre || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Selection for Related Products Test */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Related Products Logic</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select a product to test:</label>
            <select 
              onChange={(e) => {
                const product = clientProducts.find(p => p.id === parseInt(e.target.value))
                setSelectedProduct(product)
                if (product) getRelatedProducts(product)
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a product...</option>
              {clientProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.categoria_global || 'No category'})
                </option>
              ))}
            </select>
          </div>
          
          {selectedProduct && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Selected Product:</h3>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="font-medium">{selectedProduct.name}</p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>categoria_global:</strong> {selectedProduct.categoria_global || 'Not set'}</p>
                  <p><strong>categoria_nombre:</strong> {selectedProduct.categoria_nombre || 'Not set'}</p>
                  <p><strong>categoria_slug:</strong> {selectedProduct.categoria_slug || 'Not set'}</p>
                  <p><strong>category (legacy):</strong> {selectedProduct.category || 'Not set'}</p>
                  <p><strong>Detected category:</strong> {detectProductCategory(selectedProduct)}</p>
                  <p><strong>Detected subcategory:</strong> {detectProductSubcategory(selectedProduct)}</p>
                </div>
              </div>
              
              <h3 className="font-semibold mb-3">Related Products ({relatedProducts.length}):</h3>
              {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedProducts.map(product => (
                    <div key={product.id} className="border p-3 rounded">
                      <p className="font-medium">{product.name}</p>
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <p>Global: {product.categoria_global || 'N/A'}</p>
                        <p>Nombre: {product.categoria_nombre || 'N/A'}</p>
                        <p>Detected: {detectProductCategory(product)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No related products found</p>
              )}
            </div>
          )}
        </div>
        
        {/* API Endpoints Test */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">API Endpoints Test</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Client-side Products API:</h3>
              <p className="text-sm text-gray-600 mb-2">URL: /api/products</p>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/products?page=1&pageSize=5')
                    const data = await response.json()
                    alert(`API Response: ${data.data?.length || 0} products`)
                  } catch (error) {
                    console.error('API test error:', error)
                    alert('API Error: ' + error.message)
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                Test Direct API Call
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">fetchProducts Function:</h3>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetchProducts({ pageParam: 1, pageSize: 5 })
                    alert(`fetchProducts: ${response?.data?.length || 0} products`)
                  } catch (error) {
                    console.error('fetchProducts error:', error)
                    alert('fetchProducts Error: ' + error.message)
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
              >
                Test fetchProducts Function
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 