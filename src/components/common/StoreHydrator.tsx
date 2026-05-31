'use client'
import { useEffect } from 'react'
import { useCart } from '@/lib/store/cartStore'
import { useCheckout } from '@/lib/store/checkoutStore'

export function StoreHydrator() {
  useEffect(() => {
    // Rehydrate stores on the client side after mounting
    // to prevent hydration mismatch errors during Next.js SSR
    if (typeof window !== 'undefined') {
      useCart.persist.rehydrate()
      useCheckout.persist.rehydrate()
    }
  }, [])

  return null
}
