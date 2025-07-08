import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default async function CalzadoPage({ params }) {
  const { id } = await params
  
  return (
    <DynamicCategoryPage 
      category="calzado" 
      subcategory={id}
    />
  )
}

// Genera las rutas estáticas para calzado disponible
export async function generateStaticParams() {
  return [
    { id: 'SN' }, // Sneakers
    { id: 'CS' }, // Casual
    { id: 'BT' }, // Botas
  ]
} 