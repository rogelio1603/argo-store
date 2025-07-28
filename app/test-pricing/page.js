import { fetchProductsServer } from "@/lib/products-server"
import { ProductCard } from "@/components/ProductCard"

export default async function TestPricingPage() {
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
        <h1 className="text-3xl font-bold mb-6">Test Pricing & Discounts</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Pricing Logic Verification</h2>
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">New Pricing Logic:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>price:</strong> Shows discounted price (precio_descuento) if on sale, otherwise original price (precio)</li>
              <li>• <strong>originalPrice:</strong> Shows original price (precio) only when on sale</li>
              <li>• <strong>isOnSale:</strong> True when descuento=true AND precio_descuento &lt; precio</li>
              <li>• <strong>discount:</strong> Percentage calculation: (precio - precio_descuento) / precio * 100</li>
            </ul>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : productsData?.data ? (
            <div>
              <p className="text-gray-600 mb-6">
                Products loaded: {productsData.data.length}
              </p>
              
              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {productsData.data.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Detailed Pricing Analysis */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Detailed Pricing Analysis</h3>
                {productsData.data.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 text-blue-800">
                      {product.name}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Raw Strapi Data (simulated) */}
                      <div className="bg-gray-50 p-4 rounded">
                        <h5 className="font-medium text-gray-800 mb-2">Expected Strapi Fields:</h5>
                        <div className="text-sm space-y-1">
                          <p><strong>precio (original):</strong> ${product.originalPrice || product.price}</p>
                          <p><strong>precio_descuento:</strong> ${product.isOnSale ? product.price : 'N/A'}</p>
                          <p><strong>descuento (flag):</strong> {product.isOnSale ? 'true' : 'false'}</p>
                        </div>
                      </div>
                      
                      {/* Transformed Data */}
                      <div className="bg-green-50 p-4 rounded">
                        <h5 className="font-medium text-green-800 mb-2">Transformed Data:</h5>
                        <div className="text-sm space-y-1">
                          <p><strong>price (display):</strong> ${product.price}</p>
                          <p><strong>originalPrice:</strong> {product.originalPrice ? `$${product.originalPrice}` : 'null'}</p>
                          <p><strong>isOnSale:</strong> {product.isOnSale ? 'true' : 'false'}</p>
                          <p><strong>discount:</strong> {product.discount ? `${product.discount}%` : 'null'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual Price Display */}
                    <div className="mt-4 p-4 bg-white border rounded">
                      <h5 className="font-medium mb-2">Price Display:</h5>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                            <span className="text-lg text-red-500 font-semibold">
                              -{product.discount}%
                            </span>
                          </>
                        )}
                        {product.isOnSale && (
                          <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                            OFERTA
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Calculation Details */}
                    {product.isOnSale && product.discount && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h5 className="font-medium text-yellow-800 mb-2">Discount Calculation:</h5>
                        <div className="text-sm text-yellow-700">
                          <p>Formula: (original_price - discounted_price) / original_price * 100</p>
                          <p>Calculation: ({product.originalPrice} - {product.price}) / {product.originalPrice} * 100 = {product.discount}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Raw Data Section */}
        {productsData && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Products Data (First Product)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(productsData.data[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 