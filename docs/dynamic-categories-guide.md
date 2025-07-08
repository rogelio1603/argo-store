# Sistema de Categorías Dinámicas - Argo Store

## Descripción General

Este sistema permite crear y gestionar categorías y subcategorías de manera completamente dinámica, sin necesidad de modificar múltiples archivos cada vez que se quiere agregar una nueva categoría o subcategoría.

## Estructura del Sistema

### 1. Configuración Central (`lib/categories.js`)

Toda la configuración se gestiona desde un solo archivo que contiene:

- **Categorías principales**: drops, ropa, accesorios, calzado
- **Subcategorías**: Cada categoría puede tener múltiples subcategorías
- **Configuración visual**: Colores, títulos, subtítulos, botones
- **Productos de ejemplo**: Lista de productos para cada subcategoría

### 2. Componente Dinámico (`components/DynamicCategoryPage.jsx`)

Un componente reutilizable que puede renderizar cualquier página de categoría o subcategoría basándose en los parámetros proporcionados.

### 3. Grid de Subcategorías (`components/SubcategoriesGrid.jsx`)

Muestra automáticamente todas las subcategorías disponibles para una categoría específica.

## Cómo Agregar una Nueva Categoría

### Paso 1: Actualizar la configuración

En `lib/categories.js`, agregar la nueva categoría al objeto `categoriesConfig`:

```javascript
export const categoriesConfig = {
  // ... categorías existentes ...
  
  nuevacategoria: {
    title: "Título de la Nueva Categoría",
    subtitle: "Descripción de la categoría",
    buttonText: "Ver Categoría",
    sectionTitle: "Nuestra Colección",
    sectionSubtitle: "Descripción detallada de la sección",
    color: "blue", // red, orange, blue, purple, green
    subcategories: [
      {
        id: "subcategoria-1",
        name: "Subcategoría 1",
        slug: "subcategoria-1",
        description: "Descripción de la subcategoría",
        image: "/api/placeholder/400/400?cat=nuevacategoria",
        featured: true,
        products: [
          "Producto 1",
          "Producto 2",
          "Producto 3",
          "Producto 4"
        ]
      }
      // ... más subcategorías
    ]
  }
}
```

### Paso 2: Crear la página principal

Crear `app/nuevacategoria/page.js`:

```javascript
import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default function NuevaCategoriaPage() {
  return (
    <DynamicCategoryPage 
      category="nuevacategoria" 
      showSubcategoriesGrid={true}
    />
  )
}
```

### Paso 3: Actualizar la navegación

En `components/Header.jsx`, agregar la nueva categoría al menú:

```jsx
<NavigationMenuItem>
  <NavigationMenuTrigger>
    <Link href="/nuevacategoria">Nueva Categoría</Link>
  </NavigationMenuTrigger>
  <NavigationMenuContent>
    <ul className="grid w-[300px] gap-3 p-4">
      <ListItem href="/nuevacategoria/subcategoria-1" title="Subcategoría 1">
        Descripción breve
      </ListItem>
      // ... más subcategorías
    </ul>
  </NavigationMenuContent>
</NavigationMenuItem>
```

### Paso 4: Agregar imágenes del carousel

En `components/HeroCarousel.jsx`, agregar las imágenes para la nueva categoría:

```javascript
const heroSlidesData = {
  // ... categorías existentes ...
  
  nuevacategoria: [
    {
      id: 1,
      backgroundImage: "/api/placeholder/1200/600?type=nuevacategoria1"
    },
    {
      id: 2,
      backgroundImage: "/api/placeholder/1200/601?type=nuevacategoria2"
    },
    {
      id: 3,
      backgroundImage: "/api/placeholder/1200/602?type=nuevacategoria3"
    }
  ]
}
```

## Cómo Agregar una Nueva Subcategoría

### Paso 1: Actualizar la configuración

En `lib/categories.js`, agregar la subcategoría al array de subcategorías de la categoría correspondiente:

```javascript
subcategories: [
  // ... subcategorías existentes ...
  {
    id: "nueva-subcategoria",
    name: "Nueva Subcategoría",
    slug: "nueva-subcategoria",
    description: "Descripción de la nueva subcategoría",
    image: "/api/placeholder/400/400?subcat=nueva",
    featured: false, // true si quieres que aparezca destacada
    products: [
      "Producto A",
      "Producto B",
      "Producto C"
    ]
  }
]
```

### Paso 2: Crear la página de la subcategoría

Crear `app/categoria/nueva-subcategoria/page.js`:

```javascript
import DynamicCategoryPage from "@/components/DynamicCategoryPage"

export default function NuevaSubcategoriaPage() {
  return (
    <DynamicCategoryPage 
      category="categoria" 
      subcategory="nueva-subcategoria"
    />
  )
}
```

### Paso 3: Actualizar el menú de navegación

Agregar el link en `components/Header.jsx` dentro del menú correspondiente.

## Sistema de Colores

Colores disponibles y sus códigos:

- **red**: #ef4444 (hover: #dc2626)
- **orange**: #f97316 (hover: #ea580c)
- **blue**: #3b82f6 (hover: #2563eb)
- **purple**: #8b5cf6 (hover: #7c3aed)
- **green**: #22c55e (hover: #16a34a)

## Características del Sistema

### ✅ Ventajas

1. **Escalabilidad**: Fácil agregar nuevas categorías sin tocar múltiples archivos
2. **Consistencia**: Mismo diseño y comportamiento para todas las páginas
3. **Mantenibilidad**: Un solo lugar para configurar todo
4. **Flexibilidad**: Soporte para subcategorías ilimitadas
5. **SEO Friendly**: URLs limpias y organizadas
6. **Responsive**: Diseño que se adapta a todos los dispositivos

### 🔧 API y Datos

- Los productos se generan automáticamente basándose en la configuración
- React Query maneja el cache y la paginación
- Soporte para filtrado por categoría y subcategoría
- Fácil integración con APIs reales (Strapi, etc.)

### 🎨 Personalización

- Colores personalizables por categoría
- Títulos y descripciones configurables
- Imágenes específicas por categoría/subcategoría
- Grid de subcategorías opcional

## Estructura de Archivos

```
app/
├── [categoria]/
│   ├── page.js                    # Página principal de categoría
│   └── [subcategoria]/
│       └── page.js                # Página de subcategoría
components/
├── CategoryContext.jsx            # Context para estado global
├── DynamicCategoryPage.jsx        # Componente de página reutilizable
├── SubcategoriesGrid.jsx          # Grid de subcategorías
├── HeroCarousel.jsx               # Carousel hero
├── ProductsSection.jsx            # Sección de productos
└── Header.jsx                     # Navegación
lib/
├── categories.js                  # Configuración principal
└── api.js                         # API y generación de datos
```

Este sistema permite un crecimiento orgánico del ecommerce sin complejidad técnica adicional. 