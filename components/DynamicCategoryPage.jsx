"use client"

import { Header } from "@/components/Header"
import { HeroCarousel } from "@/components/HeroCarousel"
import { ProductsSection } from "@/components/ProductsSection"
import { SubcategoriesGrid } from "@/components/SubcategoriesGrid"
import { Footer } from "@/components/Footer"
import { CategoryProvider } from "@/components/CategoryContext"

export default function DynamicCategoryPage({ 
  category, 
  subcategory = null, 
  showSubcategoriesGrid = false 
}) {
  return (
    <CategoryProvider initialCategory={category} initialSubcategory={subcategory}>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroCarousel />
          {showSubcategoriesGrid && !subcategory && (
            <SubcategoriesGrid />
          )}
          <ProductsSection />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  )
} 