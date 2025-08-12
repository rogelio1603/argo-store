"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCartIcon, XIcon, PlusIcon, MinusIcon } from "lucide-react"
import useCartStore from "@/lib/cart-store"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Optimized cart item component with memo to prevent unnecessary re-renders
const CartItem = React.memo(({ item, updateQuantity, removeItem, isMobile = false }) => {
  const handleUpdateQuantity = React.useCallback((newQuantity) => {
    updateQuantity(item.id, newQuantity)
  }, [item.id, updateQuantity])

  const handleRemoveItem = React.useCallback(() => {
    removeItem(item.id)
  }, [item.id, removeItem])

  if (isMobile) {
    return (
      <div className="py-4 flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-900 mb-1">
            {item.name}
          </h4>
          <div className="text-sm text-gray-500 space-y-1 mb-2">
            {item.selectedImage && (
              <p>Variante seleccionada</p>
            )}
            {item.size && <p>Talla: {item.size}</p>}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          
          {/* Quantity Controls for Mobile */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-base font-medium w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemoveItem}
              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 flex items-center space-x-3">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            side="left" 
            className="w-80 h-80 p-2"
            sideOffset={10}
          >
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h4>
        <div className="text-xs text-gray-500 space-y-1">
          {item.selectedImage && (
            <p>Variante seleccionada</p>
          )}
          {item.size && <p>Talla: {item.size}</p>}
        </div>
        <p className="text-sm font-medium text-gray-900">
          ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          <MinusIcon className="h-3 w-3" />
        </button>
        <span className="text-sm font-medium w-8 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          <PlusIcon className="h-3 w-3" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemoveItem}
        className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  )
})

CartItem.displayName = 'CartItem'

export function CartDropdown() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore()
  const { totalItems, totalPrice } = getTotals()
  const [isMobile, setIsMobile] = React.useState(false)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [isHydrated, setIsHydrated] = React.useState(false)
  
  // Refs to maintain scroll position
  const desktopScrollRef = React.useRef(null)
  const mobileScrollRef = React.useRef(null)
  
  // Store scroll position before re-render
  const scrollPosition = React.useRef({ desktop: 0, mobile: 0 })
  
  // Memoize callback functions to prevent unnecessary re-renders
  const memoizedUpdateQuantity = React.useCallback((itemId, newQuantity) => {
    // Store scroll position before update
    if (desktopScrollRef.current) {
      scrollPosition.current.desktop = desktopScrollRef.current.scrollTop
    }
    if (mobileScrollRef.current) {
      scrollPosition.current.mobile = mobileScrollRef.current.scrollTop
    }
    
    updateQuantity(itemId, newQuantity)
  }, [updateQuantity])
  
  const memoizedRemoveItem = React.useCallback((itemId) => {
    // Store scroll position before removal
    if (desktopScrollRef.current) {
      scrollPosition.current.desktop = desktopScrollRef.current.scrollTop
    }
    if (mobileScrollRef.current) {
      scrollPosition.current.mobile = mobileScrollRef.current.scrollTop
    }
    
    removeItem(itemId)
  }, [removeItem])
  
  // Restore scroll position after render
  React.useEffect(() => {
    if (desktopScrollRef.current && scrollPosition.current.desktop > 0) {
      desktopScrollRef.current.scrollTop = scrollPosition.current.desktop
    }
    if (mobileScrollRef.current && scrollPosition.current.mobile > 0) {
      mobileScrollRef.current.scrollTop = scrollPosition.current.mobile
    }
  })

  // Handle hydration to prevent SSR mismatch
  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Detect mobile screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Cart content component that can be reused
  const CartContent = React.useCallback(({ onClose = () => {} }) => (
    <div className="bg-white rounded-lg shadow-lg border max-h-[500px] md:max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50 flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Carrito de Compras</h3>
      </div>

      {/* Cart Items */}
      <div ref={desktopScrollRef} className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <ShoppingCartIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={memoizedUpdateQuantity}
                removeItem={memoizedRemoveItem}
                isMobile={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Actions */}
      {items.length > 0 && (
        <div className="px-4 py-3 border-t bg-gray-50 flex-shrink-0">
          {/* Total */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-900">Total:</span>
            <span className="text-lg font-bold text-red-600">
              ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              href="/checkout"
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium text-center block"
              onClick={onClose}
            >
              Proceder al Pago
            </Link>
          </div>
        </div>
      )}
    </div>
  ), [items, totalPrice, memoizedUpdateQuantity, memoizedRemoveItem])

  return (
    <>
      {/* Desktop version with DropdownMenu */}
      {!isMobile && (
                 <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <button className="text-gray-600 hover:text-gray-900 relative focus:outline-none cursor-pointer">
               <ShoppingCartIcon className="h-6 w-6" />
               {isHydrated && totalItems > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                   {totalItems}
                 </span>
               )}
             </button>
           </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-[380px] p-0 max-h-[500px] overflow-hidden"
            sideOffset={8}
          >
            <CartContent />
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Mobile version with Sheet */}
      {isMobile && (
                 <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
           <SheetTrigger asChild>
             <button className="text-gray-600 hover:text-gray-900 relative focus:outline-none">
               <ShoppingCartIcon className="h-6 w-6" />
               {isHydrated && totalItems > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                   {totalItems}
                 </span>
               )}
             </button>
           </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-full sm:w-[400px] p-0"
          >
            <div className="h-full flex flex-col">
                             <SheetHeader className="px-4 py-3 border-b bg-gray-50">
                 <SheetTitle className="text-left">Carrito de Compras</SheetTitle>
                 <SheetDescription className="text-left text-sm text-gray-600">
                   {isHydrated ? `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en tu carrito` : 'Cargando carrito...'}
                 </SheetDescription>
               </SheetHeader>
              
              <div ref={mobileScrollRef} className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 h-full flex flex-col justify-center">
                    <ShoppingCartIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Tu carrito está vacío</p>
                    <p className="text-sm mt-2">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 px-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        updateQuantity={memoizedUpdateQuantity}
                        removeItem={memoizedRemoveItem}
                        isMobile={true}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer for Mobile */}
              {items.length > 0 && (
                <div className="px-4 py-4 border-t bg-gray-50 space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-red-600">
                      ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 text-base font-medium text-center block"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Proceder al Pago
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
} 