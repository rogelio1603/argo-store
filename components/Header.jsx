"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon, ChevronRightIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { CartDropdown } from "@/components/CartDropdown"

export function Header({ categories = [] }) {
  // Group categories by categoria_global
  const groupedCategories = React.useMemo(() => {
    const groups = {}
    
    categories.forEach(category => {
      if (category.categoria_global) {
        if (!groups[category.categoria_global]) {
          groups[category.categoria_global] = []
        }
        groups[category.categoria_global].push(category)
      }
    })
    
    return groups
  }, [categories])

  // Function to get href based on categoria_global (dynamic)
  const getCategoryBasePath = (categoriaGlobal) => {
    if (!categoriaGlobal) return '/'
    // Convert to URL-friendly slug
    return `/${categoriaGlobal.toLowerCase().replace(/\s+/g, '-')}`
  }

  // Function to get specific subcategory href
  const getSubcategoryHref = (category) => {
    const basePath = getCategoryBasePath(category.categoria_global)
    // Use slug instead of documentId for more friendly URLs
    return `${basePath}/${category.slug}`
  }

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.avif"
                alt="ArgoStore"
                className="h-13 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex" viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Inicio</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* Generate menus dynamically */}
              {Object.entries(groupedCategories).map(([categoriaGlobal, subcategories]) => {
                const basePath = getCategoryBasePath(categoriaGlobal)
                const isDrops = categoriaGlobal.toLowerCase() === 'drops'
                
                return (
                  <NavigationMenuItem key={categoriaGlobal}>
                    <NavigationMenuTrigger>
                      {/* <Link href={basePath}> */}
                        {isDrops ? `${categoriaGlobal} 🔥` : categoriaGlobal}
                      {/* </Link> */}
                    </NavigationMenuTrigger>
                <NavigationMenuContent>
                      <ul className={`grid gap-3 p-4 ${subcategories.length > 3 ? 'md:w-[500px] md:grid-cols-2 lg:w-[600px]' : 'w-[300px]'}`}>
                        {isDrops && subcategories.length > 0 && (
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link 
                                href={basePath}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orange-50 to-orange-100 p-6 no-underline outline-none focus:shadow-md hover:bg-gradient-to-b hover:from-orange-100 hover:to-orange-200 transition-all"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-orange-800">
                            Nuevos Lanzamientos
                          </div>
                          <p className="text-sm leading-tight text-orange-600">
                            Descubre las últimas tendencias en moda urbana
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                        )}
                        {subcategories.map((subcategory) => (
                          <ListItem 
                            key={subcategory.documentId}
                            href={getSubcategoryHref(subcategory)} 
                            title={subcategory.nombre}
                          >
                            {subcategory.descripcion_menu || `Descubre nuestra colección de ${subcategory.nombre.toLowerCase()}`}
                    </ListItem>
                        ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
                )
              })}

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/sobre-nosotros">Sobre Nosotros</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <CartDropdown />
            
            {/* Mobile menu sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden text-gray-600 hover:text-gray-900" aria-label="Toggle mobile menu">
                  <MenuIcon className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold inline-block">
                      ArgoStore
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Explora nuestra colección de moda y accesorios
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {/* Main Navigation */}
                  <div className="space-y-3">
                    <Link
                      href="/"
                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">Inicio</span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </Link>
                    
                    {/* Generate mobile menu dynamically */}
                    {Object.entries(groupedCategories).map(([categoriaGlobal, subcategories]) => {
                      const basePath = getCategoryBasePath(categoriaGlobal)
                      const isDrops = categoriaGlobal.toLowerCase() === 'drops'
                      
                                             // Define dynamic color classes based on name hash
                       const getColorClasses = (categoria) => {
                         // Available color options
                         const colorOptions = [
                           { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', text: 'text-blue-600' },
                           { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', text: 'text-purple-600' },
                           { bg: 'bg-green-50', hover: 'hover:bg-green-100', text: 'text-green-600' },
                           { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', text: 'text-orange-600' },
                           { bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-600' },
                           { bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', text: 'text-indigo-600' },
                           { bg: 'bg-pink-50', hover: 'hover:bg-pink-100', text: 'text-pink-600' },
                           { bg: 'bg-teal-50', hover: 'hover:bg-teal-100', text: 'text-teal-600' }
                         ]
                         
                                                   // Use simple hash of name to select consistent color
                         const hash = categoria.split('').reduce((a, b) => {
                           a = ((a << 5) - a) + b.charCodeAt(0)
                           return a & a
                         }, 0)
                         
                         const colorIndex = Math.abs(hash) % colorOptions.length
                         return colorOptions[colorIndex]
                       }
                      
                      const colorClasses = getColorClasses(categoriaGlobal)
                      
                      return (
                        <div key={categoriaGlobal} className="space-y-2">
                      <Link
                            href={basePath}
                            className={`flex items-center justify-between py-3 px-4 rounded-lg ${colorClasses.bg} ${colorClasses.hover} transition-colors`}
                      >
                            <span className={`font-medium ${colorClasses.text}`}>
                              {isDrops ? `${categoriaGlobal} 🔥` : categoriaGlobal}
                            </span>
                      </Link>
                      <div className="ml-4 space-y-2">
                            {subcategories.map((subcategory) => (
                      <Link
                                key={subcategory.documentId}
                                href={getSubcategoryHref(subcategory)} 
                                className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      >
                                {subcategory.nombre}
                      </Link>
                            ))}
                      </div>
                    </div>
                      )
                    })}

                    <Link
                       href="/sobre-nosotros"
                       className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                     >
                       <span className="font-medium">Sobre Nosotros</span>
                       <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                     </Link>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
} 