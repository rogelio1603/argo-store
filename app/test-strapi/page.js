import { fetchCategoriesServer } from "@/lib/categories-server"

export default async function TestStrapiPage() {
  let categoriesData = null
  let error = null
  
  try {
    categoriesData = await fetchCategoriesServer({ pageSize: 100 })
  } catch (e) {
    error = e.message
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Strapi Connection</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          NEXT_PUBLIC_STRAPI_HOST: {process.env.NEXT_PUBLIC_STRAPI_HOST || 'Not set'}
          NEXT_PUBLIC_STRAPI_TOKEN: {process.env.NEXT_PUBLIC_STRAPI_TOKEN ? 'Set (hidden)' : 'Not set'}
        </pre>
      </div>

      {error && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error:</h2>
          <pre className="bg-red-100 p-4 rounded text-sm text-red-800">
            {error}
          </pre>
        </div>
      )}

      {categoriesData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Success! Categories Data:</h2>
          <pre className="bg-green-50 p-4 rounded text-sm max-h-96 overflow-auto">
            {JSON.stringify(categoriesData, null, 2)}
          </pre>
        </div>
      )}

      {categoriesData?.data && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories Summary:</h2>
          <div className="grid gap-4">
            {categoriesData.data.map((category, index) => (
              <div key={category.id || index} className="border p-4 rounded">
                <h3 className="font-semibold">{category.nombre || category.name}</h3>
                <p className="text-sm text-gray-600">
                  Category Global: {category.categoria_global || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  Document ID: {category.documentId || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  Slug: {category.slug || 'Not set'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 