import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default async function RopaPage({ params }) {
  const { id } = await params
  
  return (
    <DynamicCategoryPage 
      category="ropa" 
      subcategory={id}
    />
  )
}

// Genera las rutas estáticas para las subcategorías de ropa disponibles
export async function generateStaticParams() {
  return [
    { id: 'AE' }, // Camisetas
    { id: 'PT' }, // Pantalones
    { id: 'SD' }, // Sudaderas
    { id: 'CH' }, // Chaquetas
  ]
} 