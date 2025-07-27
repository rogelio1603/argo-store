import { fetchProductsServer } from "@/lib/products-server"

export default async function TestNewSizesPage() {
  let productsData = null
  let error = null
  
  try {
    productsData = await fetchProductsServer({ pageSize: 5 })
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test New Sizes Structure</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">New Tallas Array Structure</h2>
          <p className="text-gray-600 mb-4">
            Testing the new structure where each stock item can have multiple sizes (tallas array) instead of a single size.
          </p>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : productsData?.data ? (
            <div className="space-y-8">
              {productsData.data.map((product, index) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
                  
                  {/* Product Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Product Info</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>ID:</strong> {product.id}</p>
                        <p><strong>Slug:</strong> {product.slug}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Category:</strong> {product.categoria_nombre || product.category}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Product Image</h4>
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-32 h-32 object-cover border rounded"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Stock Analysis */}
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-medium text-blue-800 mb-3">Stock & Sizes Analysis</h4>
                    
                    {product.stock_por_color_talla?.length > 0 ? (
                      <div className="space-y-4">
                        {product.stock_por_color_talla.map((stockItem, stockIndex) => (
                          <div key={stockItem.id || stockIndex} className="bg-white p-4 rounded border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              
                              {/* Stock Info */}
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Stock Item #{stockIndex + 1}</h5>
                                <div className="text-sm space-y-1">
                                  <p><strong>Stock:</strong> {stockItem.stock}</p>
                                  <p><strong>Single Talla:</strong> {stockItem.talla || 'None'}</p>
                                  <p><strong>Tallas Array:</strong> {stockItem.tallas ? `[${stockItem.tallas.join(', ')}]` : 'None'}</p>
                                  <p><strong>Images:</strong> {stockItem.imagenes?.length || 0}</p>
                                </div>
                              </div>
                              
                              {/* Available Sizes Display */}
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Available Sizes</h5>
                                <div className="flex flex-wrap gap-1">
                                  {stockItem.tallas && stockItem.tallas.length > 0 ? (
                                    stockItem.tallas.map((talla, tallaIndex) => (
                                      <span key={tallaIndex} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                        {talla}
                                      </span>
                                    ))
                                  ) : stockItem.talla ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                      {stockItem.talla} (legacy)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      No sizes
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Images */}
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Images</h5>
                                {stockItem.imagenes?.length > 0 ? (
                                  <div className="flex gap-2">
                                    {stockItem.imagenes.slice(0, 3).map((imagen, imgIndex) => (
                                      <div key={imagen.id || imgIndex} className="text-center">
                                        <img 
                                          src={imagen.url} 
                                          alt={imagen.alternativeText || `Variant ${imgIndex + 1}`}
                                          className="w-12 h-12 object-cover border rounded"
                                        />
                                        <p className="text-xs text-blue-600 mt-1">#{imgIndex + 1}</p>
                                      </div>
                                    ))}
                                    {stockItem.imagenes.length > 3 && (
                                      <span className="text-xs text-gray-500 self-center">
                                        +{stockItem.imagenes.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No images</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Overall Summary */}
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <h5 className="font-medium text-green-800 mb-2">Summary</h5>
                          <div className="text-sm text-green-700 space-y-1">
                            <p><strong>Total Stock Items:</strong> {product.stock_por_color_talla.length}</p>
                            <p><strong>Total Unique Sizes:</strong> {
                              [...new Set(
                                product.stock_por_color_talla.flatMap(item => 
                                  item.tallas && item.tallas.length > 0 ? item.tallas : (item.talla ? [item.talla] : [])
                                )
                              )].length
                            }</p>
                            <p><strong>Total Images:</strong> {
                              product.stock_por_color_talla.reduce((sum, item) => sum + (item.imagenes?.length || 0), 0)
                            }</p>
                          </div>
                        </div>
                        
                      </div>
                    ) : (
                      <p className="text-gray-500">No stock data available</p>
                    )}
                  </div>
                  
                  {/* Test Link */}
                  <div className="mt-4 pt-4 border-t">
                    <a 
                      href={`/test-single-product?slug=${product.slug}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 mr-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Single Product Test
                    </a>
                    <a 
                      href={`/${product.categoria_global?.toLowerCase().replace(/\s+/g, '-') || 'ropa'}/${product.categoria_slug || 'general'}/${product.slug}`}
                      className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Product Page
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Raw Data Section */}
        {productsData && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Products Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(productsData.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 