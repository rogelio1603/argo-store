import { fetchProductsServer } from "@/lib/products-server"
import { generateProductUrl } from "@/lib/product-utils"
import { fetchCategoriesServer } from "@/lib/categories-server"
import Link from "next/link"

export default async function TestProductsPage() {
  // Get products and categories for testing
  const [productsData, categoriesData] = await Promise.all([
    fetchProductsServer({ pageSize: 20 }),
    fetchCategoriesServer({ pageSize: 100 })
  ])
  
  const products = productsData?.data || []
  const categories = categoriesData?.data || []
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product URLs Test</h1>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Products and their generated URLs:</h2>
          <div className="space-y-4">
            {products.map((product) => {
              const generatedUrl = generateProductUrl(product)
              
              return (
                <div key={product.id} className="border-b pb-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">ID: {product.id} | Slug: {product.slug}</p>
                  
                  <div className="mt-2 text-sm">
                    <p><strong>Category Info:</strong></p>
                    <p>categoria_global: {product.categoria_global || 'Not set'}</p>
                    <p>categoria_nombre: {product.categoria_nombre || 'Not set'}</p>
                    <p>categoria_slug: {product.categoria_slug || 'Not set'}</p>
                    <p>category (legacy): {product.category || 'Not set'}</p>
                    {product.categoria && (
                      <p>categoria object: {JSON.stringify(product.categoria)}</p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p><strong>Generated URL:</strong> 
                      <Link href={generatedUrl} className="text-blue-500 hover:underline ml-2">
                        {generatedUrl}
                      </Link>
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <Link 
                      href={generatedUrl}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                    >
                      Test Product Page
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories Debug:</h2>
          <div className="text-sm">
            <p><strong>Total categories found:</strong> {categories.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {categories.map((category) => (
                <div key={category.id} className="border p-3 rounded">
                  <h4 className="font-semibold">{category.nombre}</h4>
                  <p><strong>Slug:</strong> {category.slug}</p>
                  <p><strong>Global:</strong> {category.categoria_global}</p>
                  <p><strong>URL:</strong> /{category.categoria_global?.toLowerCase().replace(/\s+/g, '-')}/{category.slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Products Debug Info:</h2>
          <div className="text-sm">
            <p><strong>Total products found:</strong> {products.length}</p>
            <p><strong>Sample product data:</strong></p>
            {products.length > 0 && (
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(products[0], null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 