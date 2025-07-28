import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: (product, selectedImage, selectedSize, quantity = 1) => {
        const cartItem = {
          id: `${product.id}-${selectedImage?.id || 'default'}-${selectedSize}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: selectedImage?.url || product.image,
          selectedImage: selectedImage,
          size: selectedSize,
          quantity: quantity
        }

        set((state) => {
          const existingItem = state.items.find(item => item.id === cartItem.id)
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map(item =>
                item.id === cartItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          } else {
            // Add new item
            return {
              items: [...state.items, cartItem]
            }
          }
        })
      },

      // Remove item from cart
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      // Update item quantity
      updateQuantity: (itemId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, quantity: newQuantity }
              : item
          )
        }))
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] })
      },

      // Get cart totals
      getTotals: () => {
        const items = get().items
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        return {
          totalItems,
          totalPrice: parseFloat(totalPrice.toFixed(2))
        }
      }
    }),
    {
      name: 'cart-storage', // name of the item in localStorage
      partialize: (state) => ({ items: state.items }) // only persist the items array
    }
  )
)

export default useCartStore 