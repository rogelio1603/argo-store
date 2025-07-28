# Sistema Dinámico de Categorías - ArgoStore

## 🎯 Descripción General

El sistema ahora es **completamente dinámico** y se adapta automáticamente a cualquier nueva categoría que agregues en Strapi, sin necesidad de modificar código.

## 🔄 Cómo Funciona

### 1. **Categorías Dinámicas**
- El sistema lee automáticamente todas las categorías de Strapi
- Genera rutas basadas en el campo `categoria_global`
- Convierte nombres a URLs amigables (ej: "Nueva Categoria" → "/nueva-categoria")

### 2. **URLs Generadas Automáticamente**
```
Strapi: categoria_global = "Electrónicos"
URL generada: /electronicos

Strapi: categoria_global = "Ropa Deportiva" 
URL generada: /ropa-deportiva

Strapi: categoria_global = "Artículos del Hogar"
URL generada: /articulos-del-hogar
```

### 3. **Estructura de Rutas Universal**
```
/[categoria]/                    - Lista de subcategorías
/[categoria]/[subcategoria]/     - Productos de la subcategoría  
/[categoria]/[subcategoria]/[producto]/ - Detalle del producto
```

## 📋 Qué Necesitas en Strapi

### Campos Requeridos por Categoría:
```json
{
  "nombre": "Smartphones",              // Nombre de la subcategoría
  "slug": "smartphones",               // Slug para URLs
  "categoria_global": "Electrónicos",  // Categoría principal (genera la ruta)
  "descripcion_menu": "...",           // Descripción para el menú
  "imagenes_destacadas": [...]         // Imágenes para el carousel
}
```

## 🎨 Colores Automáticos

El sistema asigna colores automáticamente a nuevas categorías usando un algoritmo de hash:
- **Consistente**: La misma categoría siempre tendrá el mismo color
- **Variado**: 8 colores diferentes disponibles
- **Sin código**: No necesitas definir colores manualmente

## 🚀 Agregar Nueva Categoría

### Pasos:
1. **En Strapi Admin:**
   - Crear nueva categoría
   - Llenar campos: `nombre`, `slug`, `categoria_global`
   - Agregar `imagenes_destacadas` (opcional)

2. **Resultado Automático:**
   - Nueva sección aparece en el Header
   - Página de categoría creada automáticamente  
   - URLs amigables generadas
   - Filtrado de productos funcionando
   - Colores asignados automáticamente

### Ejemplo:
```bash
# Agregar en Strapi:
categoria_global: "Mascotas"
nombre: "Collares para Perros"
slug: "collares-perros"

# URLs generadas automáticamente:
/mascotas                    # Lista de productos de mascotas
/mascotas/collares-perros    # Productos de collares para perros
```

## 🔧 Características del Sistema

### ✅ Completamente Dinámico
- No requiere modificar código para nuevas categorías
- URLs generadas automáticamente
- Menús actualizados en tiempo real

### ✅ SEO Optimizado  
- URLs amigables para SEO
- Metadata generada automáticamente
- Rutas estáticas pre-generadas

### ✅ Filtrado Inteligente
- Productos filtrados por categoría real de Strapi
- HeroCarousel muestra imágenes de la categoría seleccionada
- Breadcrumbs dinámicos

### ✅ Escalabilidad
- Soporta categorías con espacios y caracteres especiales
- Sistema de cache para rendimiento
- Validación automática de rutas

## 🚨 Casos Edge Manejados

### Categorías con Espacios:
```
"Artículos del Hogar" → "/articulos-del-hogar" ✅
"Ropa y Accesorios" → "/ropa-y-accesorios" ✅
```

### Validación de Rutas:
- Rutas inexistentes → 404 automático
- Subcategorías inválidas → 404 automático
- Productos no encontrados → 404 automático

## 📁 Archivos del Sistema

### Nuevos archivos creados:
- `lib/dynamic-routes.js` - Generador de rutas dinámicas
- `app/[category]/page.js` - Página universal de categorías
- `app/[category]/[slug]/page.js` - Página universal de subcategorías
- `app/[category]/[slug]/[productSlug]/page.js` - Página universal de productos

### Archivos actualizados:
- `components/Header.jsx` - Menú completamente dinámico
- `components/HeroCarouselServer.jsx` - Filtrado dinámico
- `components/DynamicCategoryPage.jsx` - Mapeo dinámico
- `lib/categories.js` - Funciones dinámicas
- `next.config.mjs` - Configuración para rutas dinámicas

## 🎉 Beneficios

1. **Cero Mantenimiento**: Agregar categorías no requiere tocar código
2. **Escalabilidad**: Soporta crecimiento ilimitado de categorías  
3. **Consistencia**: Todas las categorías siguen el mismo patrón
4. **Performance**: Rutas estáticas pre-generadas para SEO
5. **UX Mejorada**: URLs legibles y navegación intuitiva

## 🔮 Próximos Pasos

El sistema está listo para:
- Cualquier número de nuevas categorías
- Categorías con nombres complejos
- Múltiples niveles de anidación (si se requiere en el futuro)
- Internacionalización (i18n) sin cambios de arquitectura 