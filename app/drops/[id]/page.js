import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default async function DropPage({ params }) {
  const { id } = await params
  
  return (
    <DynamicCategoryPage 
      category="drops" 
      subcategory={id}
    />
  )
}

// Genera las rutas estáticas para los drops disponibles
export async function generateStaticParams() {
  // Esto podría venir de una API o base de datos en el futuro
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
} 