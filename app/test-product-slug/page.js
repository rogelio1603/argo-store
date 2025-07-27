import { fetchProductBySlugServer } from "@/lib/products-server"

export default async function TestProductSlugPage({ searchParams }) {
  const slug = searchParams?.slug || 'test-product'
  
  let productData = null
  let error = null
  
  try {
    productData = await fetchProductBySlugServer(slug)
  } catch (err) {
    error = err.message
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Slug Test</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Product Slug: "{slug}"</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              To test a different slug, add ?slug=your-product-slug to the URL
            </p>
            <p className="text-sm text-gray-600">
              Example: /test-product-slug?slug=playera-hugo-boss
            </p>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="text-green-800 font-semibold">Product Found!</h3>
              <p className="text-green-700">Name: {productData?.data?.name}</p>
              <p className="text-green-700">ID: {productData?.data?.id}</p>
              <p className="text-green-700">Slug: {productData?.data?.slug}</p>
              
              <div className="mt-4">
                <h4 className="font-semibold text-green-800">Category Info:</h4>
                <p className="text-green-700">categoria_global: {productData?.data?.categoria_global || 'Not set'}</p>
                <p className="text-green-700">categoria_nombre: {productData?.data?.categoria_nombre || 'Not set'}</p>
                <p className="text-green-700">categoria_slug: {productData?.data?.categoria_slug || 'Not set'}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-green-800">Full Product Data:</h4>
                <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto text-xs">
                  {JSON.stringify(productData?.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 