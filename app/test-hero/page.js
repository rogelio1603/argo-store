import { HeroCarouselServer } from "@/components/HeroCarouselServer"
import { fetchCategoriesServer } from "@/lib/categories-server"

export default async function TestHeroPage() {
  // Get all categories for debugging
  const categoriesData = await fetchCategoriesServer({ pageSize: 100 })
  const categories = categoriesData?.data || []
  
  // Find the "Bolsas" category for testing
  const bolsasCategory = categories.find(cat => cat.slug === 'bolsas')
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">HeroCarousel Test</h1>
        
        <div className="mb-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Test Data:</h2>
          <div className="text-sm">
            <p><strong>Categories found:</strong> {categories.length}</p>
            <p><strong>Bolsas category:</strong></p>
            {bolsasCategory ? (
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
                {JSON.stringify(bolsasCategory, null, 2)}
              </pre>
            ) : (
              <p className="text-red-500">Bolsas category not found</p>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 1: HeroCarousel with 'bolsas' slug</h2>
          <HeroCarouselServer categorySlug="bolsas" />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 2: HeroCarousel with 'accesorios' slug</h2>
          <HeroCarouselServer categorySlug="accesorios" />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 3: HeroCarousel with no slug (default)</h2>
          <HeroCarouselServer />
        </div>
      </div>
    </div>
  )
} 