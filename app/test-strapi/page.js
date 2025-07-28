export default async function TestStrapiPage() {
  const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST
  const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN
  
  let categoriesError = null
  let categoriesData = null
  let productsError = null
  let productsData = null
  
  try {
    // Test categories
    const categoriesResponse = await fetch(`${STRAPI_HOST}/api/categorias?populate=*`, {
      headers: {
        'Authorization': `${STRAPI_TOKEN}`
      }
    })
    
    if (!categoriesResponse.ok) {
      throw new Error(`HTTP error! status: ${categoriesResponse.status}`)
    }
    
    categoriesData = await categoriesResponse.json()
  } catch (error) {
    categoriesError = error.message
  }
  
  try {
    // Test products with new inventario populate
    const productsResponse = await fetch(`${STRAPI_HOST}/api/productos?populate[inventario][populate][imagenes][fields][0]=url&populate[inventario][populate][stock_por_talla][populate][talla][fields][0]=talla&populate[inventario][fields]=*&populate[categoria][fields]=*&pagination[pageSize]=3`, {
      headers: {
        'Authorization': `${STRAPI_TOKEN}`
      }
    })
    
    if (!productsResponse.ok) {
      throw new Error(`HTTP error! status: ${productsResponse.status}`)
    }
    
    productsData = await productsResponse.json()
  } catch (error) {
    productsError = error.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Test Strapi Connection</h1>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>STRAPI_HOST:</strong> {STRAPI_HOST || 'Not set'}</p>
            <p><strong>STRAPI_TOKEN:</strong> {STRAPI_TOKEN ? 'Set' : 'Not set'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Categories Test</h2>
          {categoriesError ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">Error: {categoriesError}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800">✅ Categories loaded successfully!</p>
              <p className="text-sm text-green-700 mt-2">
                Found {categoriesData?.data?.length || 0} categories
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Products Test (New Populate)</h2>
          {productsError ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">Error: {productsError}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800">✅ Products loaded successfully!</p>
              <p className="text-sm text-green-700 mt-2">
                Found {productsData?.data?.length || 0} products
              </p>
              
              {/* Show sample product data */}
              {productsData?.data?.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-semibold">Sample Product:</h3>
                  <div className="bg-white p-4 rounded border">
                    <p><strong>Name:</strong> {productsData.data[0].nombre}</p>
                    <p><strong>Stock Items:</strong> {productsData.data[0].stock_por_color_talla?.length || 0}</p>
                    
                    {productsData.data[0].stock_por_color_talla?.map((stockItem, index) => (
                      <div key={stockItem.id || index} className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm"><strong>Talla:</strong> {stockItem.talla} | <strong>Stock:</strong> {stockItem.stock}</p>
                        <p className="text-sm"><strong>Images:</strong> {stockItem.imagenes?.length || 0}</p>
                        {stockItem.imagenes?.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {stockItem.imagenes.map((imagen, imgIndex) => (
                              <div key={imagen.id || imgIndex} className="text-center">
                                <img 
                                  src={`${STRAPI_HOST}${imagen.url}`}
                                  alt={`Talla ${stockItem.talla}`}
                                  className="w-16 h-16 object-cover border rounded"
                                />
                                <p className="text-xs text-gray-500 mt-1">ID: {imagen.id}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Used</h2>
          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
            {STRAPI_HOST}/api/productos?populate[stock_por_color_talla][populate][imagenes][fields][0]=url&populate[stock_por_color_talla][fields]=*&populate[categoria][fields]=*
          </code>
        </div>
        
        {productsData && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Response (First Product)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(productsData.data?.[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 