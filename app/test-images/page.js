import { fetchProductsServer } from "@/lib/products-server"
import { ProductCard } from "@/components/ProductCard"

export default async function TestImagesPage() {
  // Get products for testing
  const productsData = await fetchProductsServer({ pageSize: 3 })
  const products = productsData?.data || []
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Product Images</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Cards Section */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Product Cards:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          {/* Debug Section */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Image Debug Info:</h2>
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Main Image:</p>
                      <p className="text-xs text-gray-600 break-all">{product.image}</p>
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-20 h-20 object-cover border rounded mt-1"
                        />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Product Images Array:</p>
                      <p className="text-xs text-gray-600">
                        {product.images?.length || 0} images
                      </p>
                      {product.images?.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {product.images.slice(0, 3).map((img, index) => (
                            <img 
                              key={index}
                              src={img.url} 
                              alt={img.alternativeText || `${product.name} ${index + 1}`}
                              className="w-16 h-16 object-cover border rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Stock Images:</p>
                      <div className="space-y-2">
                        {product.stock_por_color_talla?.map((stockItem, index) => (
                          <div key={stockItem.id || index} className="bg-gray-50 p-2 rounded">
                            <p className="text-xs font-medium">Talla {stockItem.talla} - Stock: {stockItem.stock}</p>
                            {stockItem.imagenes?.length > 0 ? (
                              <div className="flex gap-1 mt-1">
                                {stockItem.imagenes.map((imagen, imgIndex) => (
                                  <div key={imagen.id || imgIndex} className="text-center">
                                    <img 
                                      src={imagen.url} 
                                      alt={imagen.alternativeText || `${product.name} - ${stockItem.talla}`}
                                      className="w-12 h-12 object-cover border rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">ID: {imagen.id}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No images</p>
                            )}
                          </div>
                        )) || <p className="text-xs text-gray-500">No stock data</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Raw Product Data:</h2>
          {products.length > 0 && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(products[0], null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
} 