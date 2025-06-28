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
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                ArgoStore
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
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
                        <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Nuevos Lanzamientos
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Descubre las últimas tendencias en moda urbana
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/drops/camisetas" title="Camisetas Premium">
                      Diseños exclusivos y ediciones limitadas
                    </ListItem>
                    <ListItem href="/drops/sudaderas" title="Sudaderas">
                      Comodidad y estilo para cualquier ocasión
                    </ListItem>
                    <ListItem href="/drops/accesorios" title="Accesorios">
                      Complementa tu look con nuestros accesorios
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Ropa</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/ropa/camisetas" title="Camisetas">
                      Camisetas básicas y con diseños únicos
                    </ListItem>
                    <ListItem href="/ropa/pantalones" title="Pantalones">
                      Jeans, chinos y pantalones deportivos
                    </ListItem>
                    <ListItem href="/ropa/sudaderas" title="Sudaderas">
                      Hoodies y crewnecks de alta calidad
                    </ListItem>
                    <ListItem href="/ropa/chaquetas" title="Chaquetas">
                      Outerwear para todas las temporadas
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Accesorios</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <ListItem href="/accesorios/gorras" title="Gorras">
                      Snapbacks, dad hats y beanies
                    </ListItem>
                    <ListItem href="/accesorios/bolsos" title="Bolsos">
                      Mochilas, riñoneras y tote bags
                    </ListItem>
                    <ListItem href="/accesorios/joyeria" title="Joyería">
                      Collares, anillos y pulseras
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
                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50">
                        <span className="font-medium text-red-600">Drops 🔥</span>
                      </div>
                      <div className="ml-4 space-y-2">
                        <Link href="/drops/camisetas" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Camisetas Premium
                        </Link>
                        <Link href="/drops/sudaderas" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Sudaderas
                        </Link>
                        <Link href="/drops/accesorios" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Accesorios
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50">
                        <span className="font-medium">Ropa</span>
                      </div>
                      <div className="ml-4 space-y-2">
                        <Link href="/ropa/camisetas" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Camisetas
                        </Link>
                        <Link href="/ropa/pantalones" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Pantalones
                        </Link>
                        <Link href="/ropa/sudaderas" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Sudaderas
                        </Link>
                        <Link href="/ropa/chaquetas" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Chaquetas
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50">
                        <span className="font-medium">Accesorios</span>
                      </div>
                      <div className="ml-4 space-y-2">
                        <Link href="/accesorios/gorras" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Gorras
                        </Link>
                        <Link href="/accesorios/bolsos" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Bolsos
                        </Link>
                        <Link href="/accesorios/joyeria" className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          Joyería
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