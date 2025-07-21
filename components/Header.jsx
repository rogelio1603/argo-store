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

export function Header() {

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
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Drops 🔥</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link 
                          href="/drops"
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
                    <ListItem href="/drops/1" title="Drop Verano 2024">
                      Colección especial para la temporada de verano
                    </ListItem>
                    <ListItem href="/drops/2" title="Drop Urban Night">
                      Piezas para la vida nocturna urbana
                    </ListItem>
                    <ListItem href="/drops/3" title="Drop Retro Wave">
                      Inspirado en los años 80 y 90
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/ropa">Ropa</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/ropa/AE" title="Camisetas">
                      Camisetas básicas y con diseños únicos
                    </ListItem>
                    <ListItem href="/ropa/PT" title="Pantalones">
                      Jeans, chinos y pantalones deportivos
                    </ListItem>
                    <ListItem href="/ropa/SD" title="Sudaderas">
                      Hoodies y crewnecks de alta calidad
                    </ListItem>
                    <ListItem href="/ropa/CH" title="Chaquetas">
                      Outerwear para todas las temporadas
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/accesorios">Accesorios</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <ListItem href="/accesorios/GR" title="Gorras">
                      Snapbacks, dad hats y beanies
                    </ListItem>
                    <ListItem href="/accesorios/BG" title="Bolsos">
                      Mochilas, riñoneras y tote bags
                    </ListItem>
                    <ListItem href="/accesorios/JY" title="Joyería">
                      Collares, anillos y pulseras
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/calzado">Calzado</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <ListItem href="/calzado/SN" title="Sneakers">
                      Zapatillas urbanas y deportivas
                    </ListItem>
                    <ListItem href="/calzado/CS" title="Casual">
                      Zapatos casuales para el día a día
                    </ListItem>
                    <ListItem href="/calzado/BT" title="Botas">
                      Botas para todas las temporadas
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

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
                    
                    <div className="space-y-2">
                      <Link
                        href="/drops"
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                      >
                        <span className="font-medium text-orange-600">Drops 🔥</span>
                      </Link>
                      <div className="ml-4 space-y-2">
                        <Link href="/drops/1" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Drop Verano 2024
                        </Link>
                        <Link href="/drops/2" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Drop Urban Night
                        </Link>
                        <Link href="/drops/3" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Drop Retro Wave
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/ropa"
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <span className="font-medium text-blue-600">Ropa</span>
                      </Link>
                      <div className="ml-4 space-y-2">
                        <Link href="/ropa/AE" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Camisetas
                        </Link>
                        <Link href="/ropa/PT" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Pantalones
                        </Link>
                        <Link href="/ropa/SD" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Sudaderas
                        </Link>
                        <Link href="/ropa/CH" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Chaquetas
                        </Link>
                      </div>
                    </div>

                                        <div className="space-y-2">
                      <Link
                        href="/accesorios"
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <span className="font-medium text-purple-600">Accesorios</span>
                      </Link>
                      <div className="ml-4 space-y-2">
                        <Link href="/accesorios/GR" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Gorras
                        </Link>
                        <Link href="/accesorios/BG" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Bolsos
                        </Link>
                        <Link href="/accesorios/JY" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Joyería
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/calzado"
                        className="flex items-center justify-between py-3 px-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <span className="font-medium text-green-600">Calzado</span>
                      </Link>
                      <div className="ml-4 space-y-2">
                        <Link href="/calzado/SN" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Sneakers
                        </Link>
                        <Link href="/calzado/CS" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Casual
                        </Link>
                        <Link href="/calzado/BT" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Botas
                        </Link>
                      </div>
                    </div>

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