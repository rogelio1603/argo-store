"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCartIcon, XIcon, PlusIcon, MinusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock cart data - in a real app this would come from state management
const initialCartItems = [
  {
    id: 1,
    name: "Camiseta Premium",
    price: 59.99,
    image: "/api/placeholder/80/80",
    quantity: 2
  },
  {
    id: 2,
    name: "Cartera de Cuero",
    price: 89.99,
    image: "/api/placeholder/80/80",
    quantity: 1
  }
]

export function CartDropdown() {
  const [cartItems, setCartItems] = React.useState(initialCartItems)

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Remove item
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-600 hover:text-gray-900 relative focus:outline-none">
          <ShoppingCartIcon className="h-6 w-6" />
          {totalItems > 0 && (
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
        <div className="bg-white rounded-lg shadow-lg border">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Carrito de Compras</h3>
          </div>

          {/* Cart Items */}
          <div className="max-h-[300px] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <ShoppingCartIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Actions */}
          {cartItems.length > 0 && (
            <div className="px-4 py-3 border-t bg-gray-50">
              {/* Total */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-900">Total:</span>
                <span className="text-lg font-bold text-red-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/carrito"
                  className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-center block"
                >
                  Ver Carrito Completo
                </Link>
                <Link
                  href="/checkout"
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium text-center block"
                >
                  Proceder al Pago
                </Link>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 