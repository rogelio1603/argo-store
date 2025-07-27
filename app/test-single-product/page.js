import { fetchProductBySlugServer } from "@/lib/products-server"

export default async function TestSingleProductPage({ searchParams }) {
  const slug = searchParams?.slug || 'playera-hugo-boss'
  
  let productData = null
  let error = null
  
  try {
    productData = await fetchProductBySlugServer(slug)
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Single Product</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Testing Product: "{slug}"</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              To test a different product, add ?slug=your-product-slug to the URL
            </p>
            <p className="text-sm text-gray-600">
              Example: /test-single-product?slug=playera-hugo-boss
            </p>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : productData?.data ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="text-green-800 font-semibold">✅ Product Found!</h3>
                <div className="mt-2 space-y-1 text-green-700">
                  <p><strong>Name:</strong> {productData.data.name}</p>
                  <p><strong>ID:</strong> {productData.data.id}</p>
                  <p><strong>Slug:</strong> {productData.data.slug}</p>
                  <p><strong>Price:</strong> ${productData.data.price}</p>
                </div>
              </div>
              
              {/* Images Analysis */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="text-blue-800 font-semibold">🖼️ Images Analysis</h3>
                <div className="mt-4 space-y-4">
                  
                  {/* Main Image */}
                  <div>
                    <h4 className="font-medium text-blue-800">Main Image:</h4>
                    <p className="text-sm text-blue-700 break-all mb-2">{productData.data.image || 'No main image'}</p>
                    {productData.data.image && (
                      <img 
                        src={productData.data.image} 
                        alt={productData.data.name}
                        className="w-24 h-24 object-cover border rounded"
                      />
                    )}
                  </div>
                  
                  {/* Regular Images Array */}
                  <div>
                    <h4 className="font-medium text-blue-800">Regular Images Array:</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Count: {productData.data.images?.length || 0}
                    </p>
                    {productData.data.images?.length > 0 && (
                      <div className="flex gap-2">
                        {productData.data.images.map((img, index) => (
                          <div key={index} className="text-center">
                            <img 
                              src={img.url} 
                              alt={img.alternativeText || `Image ${index + 1}`}
                              className="w-20 h-20 object-cover border rounded"
                            />
                            <p className="text-xs text-blue-600 mt-1">#{index + 1}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Images */}
                  <div>
                    <h4 className="font-medium text-blue-800">Stock Images (stock_por_color_talla):</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Stock Items: {productData.data.stock_por_color_talla?.length || 0}
                    </p>
                    
                    {productData.data.stock_por_color_talla?.length > 0 ? (
                      <div className="space-y-3">
                        {productData.data.stock_por_color_talla.map((stockItem, index) => (
                          <div key={stockItem.id || index} className="bg-white p-3 rounded border">
                                                         <div className="flex items-start gap-4">
                               <div className="text-sm">
                                 <p><strong>Tallas:</strong> {stockItem.tallas ? stockItem.tallas.join(', ') : (stockItem.talla || 'No sizes')}</p>
                                 <p><strong>Stock:</strong> {stockItem.stock}</p>
                                 <p><strong>Images:</strong> {stockItem.imagenes?.length || 0}</p>
                               </div>
                              
                              {stockItem.imagenes?.length > 0 && (
                                <div className="flex gap-2">
                                  {stockItem.imagenes.map((imagen, imgIndex) => (
                                    <div key={imagen.id || imgIndex} className="text-center">
                                                                             <img 
                                         src={imagen.url} 
                                         alt={imagen.alternativeText || `Variant ${imgIndex + 1}`}
                                         className="w-16 h-16 object-cover border rounded"
                                       />
                                       <p className="text-xs text-blue-600 mt-1">ID: {imagen.id}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No stock data with images</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Category Info */}
              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <h3 className="text-purple-800 font-semibold">📂 Category Info</h3>
                <div className="mt-2 space-y-1 text-purple-700 text-sm">
                  <p><strong>categoria_global:</strong> {productData.data.categoria_global || 'Not set'}</p>
                  <p><strong>categoria_nombre:</strong> {productData.data.categoria_nombre || 'Not set'}</p>
                  <p><strong>categoria_slug:</strong> {productData.data.categoria_slug || 'Not set'}</p>
                </div>
              </div>
              
              {/* Test Product Page Link */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-semibold mb-2">🔗 Test Product Page</h3>
                <a 
                  href={`/${productData.data.categoria_global?.toLowerCase().replace(/\s+/g, '-') || 'ropa'}/${productData.data.categoria_slug || productData.data.categoria_nombre?.toLowerCase().replace(/\s+/g, '-') || 'general'}/${productData.data.slug}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Product Detail Page
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Raw Data */}
        {productData && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Product Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(productData.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 