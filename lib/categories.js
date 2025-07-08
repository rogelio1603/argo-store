// Dynamic categories configuration
export const categoriesConfig = {
  all: {
    title: "Moda que Define tu Estilo",
    subtitle: "Descubre nuestra colección exclusiva de ropa y accesorios",
    buttonText: "Explorar Colección",
    sectionTitle: "Productos Destacados",
    sectionSubtitle: "Una selección curada de nuestros mejores productos en todas las categorías",
    color: "red",
    subcategories: []
  },
  drops: {
    title: "Drops Exclusivos",
    subtitle: "Ediciones limitadas que definen las tendencias del momento",
    buttonText: "Comprar Drops 🔥",
    sectionTitle: "Colección de Drops",
    sectionSubtitle: "Piezas únicas y ediciones limitadas que no encontrarás en ningún otro lugar",
    color: "orange",
    subcategories: [
      {
        id: "1",
        name: "Drop Verano 2024",
        slug: "1",
        description: "Colección especial para la temporada de verano",
        image: "/api/placeholder/400/400?drop=verano2024",
        featured: true,
        products: [
          "Camiseta Summer Vibes",
          "Shorts Beach Style", 
          "Gorra Sun Protection",
          "Tank Top Cool Breeze"
        ]
      },
      {
        id: "2",
        name: "Drop Urban Night",
        slug: "2",
        description: "Piezas para la vida nocturna urbana",
        image: "/api/placeholder/400/400?drop=urbannight",
        featured: true,
        products: [
          "Hoodie Midnight Black",
          "Joggers Street Style",
          "Sneakers Night Runner",
          "Cap Urban Legend"
        ]
      },
      {
        id: "3",
        name: "Drop Retro Wave",
        slug: "3",
        description: "Inspirado en los años 80 y 90",
        image: "/api/placeholder/400/400?drop=retrowave",
        featured: false,
        products: [
          "Camiseta Neon Dreams",
          "Windbreaker Retro Style",
          "Snapback Vintage Vibes",
          "Sudadera Throwback"
        ]
      }
    ]
  },
  ropa: {
    title: "Ropa de Calidad Superior",
    subtitle: "Encuentra las mejores piezas para completar tu guardarropa perfecto",
    buttonText: "Ver Ropa",
    sectionTitle: "Nuestra Colección de Ropa",
    sectionSubtitle: "Desde básicos atemporales hasta piezas statement que expresan tu personalidad única",
    color: "blue",
    subcategories: [
      {
        id: "AE",
        name: "Camisetas",
        slug: "AE",
        description: "Camisetas básicas y con diseños únicos",
        image: "/api/placeholder/400/400?ropa=camisetas",
        featured: true,
        products: [
          "Camiseta Básica Premium",
          "Polo Clásico",
          "Tank Top Deportivo",
          "Camiseta Oversized"
        ]
      },
      {
        id: "PT",
        name: "Pantalones",
        slug: "PT",
        description: "Jeans, chinos y pantalones deportivos",
        image: "/api/placeholder/400/400?ropa=pantalones",
        featured: true,
        products: [
          "Jeans Slim Fit",
          "Chinos Casual",
          "Joggers Deportivos",
          "Cargo Urbanos"
        ]
      },
      {
        id: "SD",
        name: "Sudaderas",
        slug: "SD",
        description: "Hoodies y crewnecks de alta calidad",
        image: "/api/placeholder/400/400?ropa=sudaderas",
        featured: true,
        products: [
          "Hoodie Premium",
          "Crewneck Classic",
          "Sudadera Crop",
          "Hoodie Oversized"
        ]
      },
      {
        id: "CH",
        name: "Chaquetas",
        slug: "CH",
        description: "Outerwear para todas las temporadas",
        image: "/api/placeholder/400/400?ropa=chaquetas",
        featured: false,
        products: [
          "Chaqueta Denim",
          "Bomber Jacket",
          "Windbreaker",
          "Parka Invierno"
        ]
      }
    ]
  },
  accesorios: {
    title: "Accesorios que Completan tu Look",
    subtitle: "Los detalles perfectos para elevar cualquier outfit al siguiente nivel",
    buttonText: "Explorar Accesorios",
    sectionTitle: "Accesorios Premium",
    sectionSubtitle: "Complementos cuidadosamente seleccionados que transforman tu estilo",
    color: "purple",
    subcategories: [
      {
        id: "GR",
        name: "Gorras",
        slug: "GR",
        description: "Snapbacks, dad hats y beanies",
        image: "/api/placeholder/400/400?accesorios=gorras",
        featured: true,
        products: [
          "Snapback Classic",
          "Dad Hat Vintage",
          "Beanie Wool",
          "Bucket Hat Summer"
        ]
      },
      {
        id: "BG",
        name: "Bolsos",
        slug: "BG",
        description: "Mochilas, riñoneras y tote bags",
        image: "/api/placeholder/400/400?accesorios=bolsos",
        featured: true,
        products: [
          "Mochila Urbana",
          "Riñonera Deportiva",
          "Tote Bag Canvas",
          "Messenger Bag"
        ]
      },
      {
        id: "JY",
        name: "Joyería",
        slug: "JY",
        description: "Collares, anillos y pulseras",
        image: "/api/placeholder/400/400?accesorios=joyeria",
        featured: false,
        products: [
          "Collar Cadena Silver",
          "Pulsera Leather",
          "Anillo Statement",
          "Pendientes Hoop"
        ]
      }
    ]
  },
  calzado: {
    title: "Calzado de Tendencia",
    subtitle: "Zapatillas y zapatos que complementan perfectamente tu estilo urbano",
    buttonText: "Ver Calzado",
    sectionTitle: "Nuestra Colección de Calzado",
    sectionSubtitle: "Desde sneakers urbanos hasta calzado casual para cada ocasión",
    color: "green",
    subcategories: [
      {
        id: "SN",
        name: "Sneakers",
        slug: "SN",
        description: "Zapatillas urbanas y deportivas",
        image: "/api/placeholder/400/400?calzado=sneakers",
        featured: true,
        products: [
          "Sneakers Classic White",
          "High Top Urban",
          "Running Shoes Sport",
          "Basketball Street"
        ]
      },
      {
        id: "CS",
        name: "Casual",
        slug: "CS",
        description: "Zapatos casuales para el día a día",
        image: "/api/placeholder/400/400?calzado=casual",
        featured: true,
        products: [
          "Loafers Leather",
          "Canvas Shoes",
          "Slip On Comfort",
          "Oxford Casual"
        ]
      },
      {
        id: "BT",
        name: "Botas",
        slug: "BT",
        description: "Botas para todas las temporadas",
        image: "/api/placeholder/400/400?calzado=botas",
        featured: false,
        products: [
          "Chelsea Boots",
          "Combat Boots",
          "Desert Boots",
          "Winter Boots"
        ]
      }
    ]
  }
}

// Helper functions
export const getAllCategories = () => {
  return Object.keys(categoriesConfig).filter(key => key !== 'all')
}

export const getCategoryConfig = (category) => {
  return categoriesConfig[category] || categoriesConfig.all
}

export const getSubcategories = (category) => {
  const config = getCategoryConfig(category)
  return config.subcategories || []
}

export const getSubcategoryBySlug = (category, slug) => {
  const subcategories = getSubcategories(category)
  return subcategories.find(sub => sub.slug === slug)
}

export const getFeaturedSubcategories = (category) => {
  const subcategories = getSubcategories(category)
  return subcategories.filter(sub => sub.featured)
}

// Generate dynamic routes
export const generateDynamicRoutes = () => {
  const routes = []
  
  getAllCategories().forEach(category => {
    // Add main category route
    routes.push(`/${category}`)
    
    // Add subcategory routes
    getSubcategories(category).forEach(subcategory => {
      routes.push(`/${category}/${subcategory.slug}`)
    })
  })
  
  return routes
} 