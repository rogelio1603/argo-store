import { fetchProductsServer } from "@/lib/products-server"
import Link from "next/link"

export default async function TestNewSystemPage() {
  // Get products for testing
  const productsData = await fetchProductsServer({ pageSize: 5 })
  const products = productsData?.data || []
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test New Image-Based System</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Products with New Stock System:</h2>
          <div className="space-y-8">
            {products.map((product) => (
              <div key={product.id} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  ID: {product.id} | Slug: {product.slug} | Price: ${product.price}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Category Info:</h4>
                  <div className="text-sm text-gray-600">
                    <p>categoria_global: {product.categoria_global || 'Not set'}</p>
                    <p>categoria_nombre: {product.categoria_nombre || 'Not set'}</p>
                    <p>categoria_slug: {product.categoria_slug || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Stock por Color Talla (New System):</h4>
                  {product.stock_por_color_talla?.length > 0 ? (
                    <div className="space-y-3">
                      {product.stock_por_color_talla.map((stockItem, index) => (
                        <div key={stockItem.id || index} className="border rounded p-3 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm"><strong>Talla:</strong> {stockItem.talla}</p>
                              <p className="text-sm"><strong>Stock:</strong> {stockItem.stock}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Imágenes ({stockItem.imagenes?.length || 0}):</p>
                              {stockItem.imagenes?.length > 0 ? (
                                <div className="flex gap-2">
                                  {stockItem.imagenes.map((imagen, imgIndex) => (
                                    <div key={imagen.id || imgIndex} className="w-16 h-16 border rounded overflow-hidden">
                                      <img
                                        src={imagen.url}
                                        alt={imagen.alternativeText || `${product.name} - ${stockItem.talla}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">No hay imágenes</p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 break-all">
                                <strong>URLs:</strong><br/>
                                {stockItem.imagenes?.map(img => img.url).join(', ') || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No stock data available</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link 
                    href={`/test-product-slug?slug=${product.slug}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 mr-2"
                  >
                    Test Product API
                  </Link>
                  <Link 
                    href={`/${product.categoria_global?.toLowerCase().replace(/\s+/g, '-') || 'ropa'}/${product.categoria_slug || product.categoria_nombre?.toLowerCase().replace(/\s+/g, '-') || 'general'}/${product.slug}`}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                  >
                    View Product Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">API URL Used:</h2>
          <code className="text-sm bg-gray-100 p-2 rounded block">
            productos?populate[stock_por_color_talla][populate][imagenes][fields][0]=url&populate[stock_por_color_talla][fields]=*&populate[categoria][fields]=*
          </code>
        </div>
      </div>
    </div>
  )
} 