import { fetchProductsServer } from "@/lib/products-server"

export default async function TestInventarioPage() {
  let productsData = null
  let error = null
  
  try {
    productsData = await fetchProductsServer({ pageSize: 5 })
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test New Inventario Structure</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Inventario Structure Analysis</h2>
          <p className="text-gray-600 mb-4">
            Testing the new inventario structure where each image variant can have different stock per size.
          </p>
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">New Structure:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Each product has <code>inventario</code> array</li>
              <li>• Each inventario item has <code>imagenes</code> array</li>
              <li>• Each inventario item has <code>stock_por_talla</code> array</li>
              <li>• Each stock_por_talla has specific <code>talla</code> and <code>stock</code></li>
            </ul>
          </div>
          
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
                      <h4 className="font-medium text-gray-800 mb-2">Main Product Image</h4>
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-32 h-32 object-cover border rounded"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Inventario Analysis */}
                  <div className="bg-purple-50 p-4 rounded">
                    <h4 className="font-medium text-purple-800 mb-3">Inventario Analysis</h4>
                    
                    {product.inventario?.length > 0 ? (
                      <div className="space-y-6">
                        {product.inventario.map((inventarioItem, inventarioIndex) => (
                          <div key={inventarioItem.id || inventarioIndex} className="bg-white p-4 rounded border">
                            <h5 className="font-medium text-purple-800 mb-3">
                              Inventario Item #{inventarioIndex + 1} (ID: {inventarioItem.id})
                            </h5>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              
                              {/* Images for this inventario item */}
                              <div>
                                <h6 className="font-medium text-gray-800 mb-2">
                                  Images ({inventarioItem.imagenes?.length || 0})
                                </h6>
                                {inventarioItem.imagenes?.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    {inventarioItem.imagenes.map((imagen, imgIndex) => (
                                      <div key={imagen.id || imgIndex} className="text-center">
                                        <img 
                                          src={imagen.url} 
                                          alt={imagen.alternativeText || `Variant ${imgIndex + 1}`}
                                          className="w-16 h-16 object-cover border rounded mx-auto"
                                        />
                                        <p className="text-xs text-purple-600 mt-1">ID: {imagen.id}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No images</p>
                                )}
                              </div>
                              
                              {/* Stock por talla for this inventario item */}
                              <div className="lg:col-span-2">
                                <h6 className="font-medium text-gray-800 mb-2">
                                  Stock por Talla ({inventarioItem.stock_por_talla?.length || 0})
                                </h6>
                                {inventarioItem.stock_por_talla?.length > 0 ? (
                                  <div className="space-y-2">
                                    {inventarioItem.stock_por_talla.map((stockTalla, stockIndex) => (
                                      <div key={stockTalla.id || stockIndex} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                          <span className="font-medium">Talla: {stockTalla.talla}</span>
                                          <span className={`px-2 py-1 rounded text-xs ${
                                            stockTalla.stock > 10 ? 'bg-green-100 text-green-800' :
                                            stockTalla.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            Stock: {stockTalla.stock}
                                          </span>
                                        </div>
                                        <span className="text-xs text-gray-500">ID: {stockTalla.id}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No stock data</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Summary for this inventario item */}
                            <div className="mt-4 pt-3 border-t border-purple-200">
                              <div className="text-sm text-purple-700 space-y-1">
                                <p><strong>Total Images:</strong> {inventarioItem.imagenes?.length || 0}</p>
                                <p><strong>Available Sizes:</strong> {
                                  inventarioItem.stock_por_talla?.map(st => st.talla).join(', ') || 'None'
                                }</p>
                                <p><strong>Total Stock:</strong> {
                                  inventarioItem.stock_por_talla?.reduce((sum, st) => sum + (st.stock || 0), 0) || 0
                                }</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Overall Product Summary */}
                        <div className="bg-green-50 p-4 rounded border border-green-200">
                          <h5 className="font-medium text-green-800 mb-2">Product Summary</h5>
                          <div className="text-sm text-green-700 space-y-1">
                            <p><strong>Total Inventario Items:</strong> {product.inventario.length}</p>
                            <p><strong>Total Unique Images:</strong> {
                              [...new Set(product.inventario.flatMap(item => 
                                item.imagenes?.map(img => img.id) || []
                              ))].length
                            }</p>
                            <p><strong>Total Unique Sizes:</strong> {
                              [...new Set(product.inventario.flatMap(item => 
                                item.stock_por_talla?.map(st => st.talla) || []
                              ))].length
                            }</p>
                            <p><strong>Total Stock Units:</strong> {
                              product.inventario.reduce((sum, item) => 
                                sum + (item.stock_por_talla?.reduce((subSum, st) => subSum + (st.stock || 0), 0) || 0), 0
                              )
                            }</p>
                          </div>
                        </div>
                        
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                        <p className="text-yellow-800 mb-2"><strong>No inventario data found</strong></p>
                        <p className="text-sm text-yellow-700">
                          This product might be using the old stock_por_color_talla structure.
                        </p>
                        
                        {/* Show compatibility fallback */}
                        {product.stock_por_color_talla?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-yellow-700 mb-2">
                              <strong>Legacy structure detected:</strong>
                            </p>
                            <div className="text-xs space-y-1">
                              <p>Stock items: {product.stock_por_color_talla.length}</p>
                              <p>Total images: {
                                product.stock_por_color_talla.reduce((sum, item) => 
                                  sum + (item.imagenes?.length || 0), 0
                                )
                              }</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Test Links */}
                  <div className="mt-6 pt-4 border-t flex gap-2">
                    <a 
                      href={`/test-single-product?slug=${product.slug}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Single Product Test
                    </a>
                    <a 
                      href={`/${product.categoria_global?.toLowerCase().replace(/\s+/g, '-') || 'ropa'}/${product.categoria_slug || 'general'}/${product.slug}`}
                      className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Product Page
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        {/* API Endpoint Info */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Information</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-700 mb-2"><strong>Current endpoint:</strong></p>
            <code className="text-xs bg-white p-2 rounded block break-all">
              /api/productos?populate[inventario][populate][imagenes][fields][0]=url&populate[inventario][populate][stock_por_talla][populate][talla][fields][0]=talla&populate[inventario][fields]=*&populate[categoria][fields][0]=nombre
            </code>
          </div>
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