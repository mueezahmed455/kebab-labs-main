'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BRAND } from '@/lib/data/brand'

export interface CartItem {
  id: string
  menuItemId: string
  categoryId: string
  name: string
  price: number
  quantity: number
  size?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  orderType: 'delivery' | 'collection'
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void
  setOrderType: (type: 'delivery' | 'collection') => void
  subtotal: () => number
  deliveryFee: () => number
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      orderType: 'delivery',

      addItem: (item) => {
        const id = `${item.menuItemId}-${item.size || 'default'}`
        const existing = get().items.find((i) => i.id === id)
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          }))
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id }],
            isOpen: true,
          }))
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, delta) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return
        const newQty = item.quantity + delta
        if (newQty <= 0) {
          get().removeItem(id)
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: newQty } : i
            ),
          }))
        }
      },

      clearCart: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      setOrderType: (type) => set({ orderType: type }),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      deliveryFee: () => {
        const { orderType, subtotal } = get()
        if (orderType === 'collection') return 0
        return subtotal() >= BRAND.delivery.freeOver ? 0 : BRAND.delivery.fee
      },

      total: () => get().subtotal() + get().deliveryFee(),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'kebab-lab-cart', skipHydration: true }
  )
)
