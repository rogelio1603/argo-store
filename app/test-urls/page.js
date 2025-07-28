import { fetchProductsServer } from "@/lib/products-server"
import { generateProductUrl } from "@/lib/product-utils"
import Link from "next/link"

export default async function TestUrlsPage() {
  let productsData = null
  let error = null
  
  try {
    productsData = await fetchProductsServer({ pageSize: 10 })
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product URLs Debug</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">URL Generation Analysis</h2>
          <p className="text-gray-600 mb-4">
            Debugging why product card links are not working correctly.
          </p>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : productsData?.data ? (
            <div className="space-y-6">
              {productsData.data.map((product, index) => {
                const generatedUrl = generateProductUrl(product)
                
                return (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800">
                      Product #{index + 1}: {product.name}
                    </h3>
                    
                    {/* Basic Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Basic Info</h4>
                        <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                          <p><strong>ID:</strong> {product.id}</p>
                          <p><strong>Slug:</strong> {product.slug || 'NOT SET'}</p>
                          <p><strong>Name:</strong> {product.name}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Product Image</h4>
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-24 h-24 object-cover border rounded"
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Category Information Analysis */}
                    <div className="bg-blue-50 p-4 rounded mb-4">
                      <h4 className="font-medium text-blue-800 mb-3">Category Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Direct Fields */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Direct Fields:</h5>
                          <div className="text-sm space-y-1">
                            <p className={`${product.categoria_global ? 'text-green-700' : 'text-red-700'}`}>
                              <strong>categoria_global:</strong> {product.categoria_global || 'NOT SET'}
                            </p>
                            <p className={`${product.categoria_nombre ? 'text-green-700' : 'text-red-700'}`}>
                              <strong>categoria_nombre:</strong> {product.categoria_nombre || 'NOT SET'}
                            </p>
                            <p className={`${product.categoria_slug ? 'text-green-700' : 'text-red-700'}`}>
                              <strong>categoria_slug:</strong> {product.categoria_slug || 'NOT SET'}
                            </p>
                            <p className={`${product.category ? 'text-green-700' : 'text-red-700'}`}>
                              <strong>category (legacy):</strong> {product.category || 'NOT SET'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Categoria Object */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Categoria Object:</h5>
                          {product.categoria ? (
                            <div className="text-sm space-y-1">
                              <p className="text-green-700"><strong>✅ Object exists</strong></p>
                              <p><strong>ID:</strong> {product.categoria.id}</p>
                              <p><strong>nombre:</strong> {product.categoria.nombre || 'NOT SET'}</p>
                              <p><strong>slug:</strong> {product.categoria.slug || 'NOT SET'}</p>
                              <p><strong>categoria_global:</strong> {product.categoria.categoria_global || 'NOT SET'}</p>
                            </div>
                          ) : (
                            <p className="text-red-700 text-sm">❌ No categoria object found</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* URL Generation Analysis */}
                    <div className="bg-green-50 p-4 rounded mb-4">
                      <h4 className="font-medium text-green-800 mb-3">URL Generation</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Generated URL:</strong> 
                          <code className="bg-white px-2 py-1 rounded ml-2 text-blue-600">
                            {generatedUrl}
                          </code>
                        </p>
                        
                        {/* URL Validation */}
                        <div className="flex gap-2 mt-3">
                          <Link 
                            href={generatedUrl}
                            className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🔗 Test This URL
                          </Link>
                          
                          <Link 
                            href={`/test-single-product?slug=${product.slug}`}
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🔍 Debug Product Data
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logic Explanation */}
                    <div className="bg-yellow-50 p-4 rounded">
                      <h4 className="font-medium text-yellow-800 mb-2">URL Generation Logic:</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        {product.categoria_nombre && product.categoria_global ? (
                          <p>✅ Using direct fields: categoria_global + categoria_nombre/slug + product.slug</p>
                        ) : product.categoria && product.categoria.categoria_global && product.categoria.slug ? (
                          <p>✅ Using categoria object: categoria.categoria_global + categoria.slug + product.slug</p>
                        ) : (
                          <p>⚠️ Using fallback detection and hardcoded mapping</p>
                        )}
                        
                        <p className="mt-2">
                          <strong>Expected pattern:</strong> /categoria-global/subcategory-slug/product-slug
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Raw API Response */}
        {productsData && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Raw API Response (First Product)</h2>
            <p className="text-sm text-gray-600 mb-4">
              This shows the exact data structure returned from Strapi:
            </p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(productsData.data[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 