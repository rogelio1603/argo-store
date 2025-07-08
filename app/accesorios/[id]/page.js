import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default async function AccesoriosPage({ params }) {
  const { id } = await params
  
  return (
    <DynamicCategoryPage 
      category="accesorios" 
      subcategory={id}
    />
  )
}

// Genera las rutas estáticas para accesorios disponibles
export async function generateStaticParams() {
  return [
    { id: 'GR' }, // Gorras
    { id: 'BG' }, // Bolsos
    { id: 'JY' }, // Joyería
  ]
} 