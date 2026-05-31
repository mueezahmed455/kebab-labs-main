'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/formatting'

export function MobileFloatingCart() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { items, setOpen: setCartOpen, itemCount, total } = useCart()

  const count = itemCount()
  const tot = total()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Hide the floating cart on checkout, track, confirmation, and admin pages
  const isHiddenPage = 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/order') || 
    pathname.startsWith('/track') ||
    pathname.startsWith('/admin')

  // Only show if there are items in the cart, on mobile, and not on hidden pages
  const shouldShow = count > 0 && !isHiddenPage

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
          className="fixed bottom-[5.5rem] left-4 right-4 z-40 md:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-brand-green/30 text-white shadow-2xl relative overflow-hidden"
            style={{
              backdropFilter: 'blur(16px)',
              background: 'linear-gradient(135deg, rgba(37, 160, 106, 0.95), rgba(29, 133, 86, 0.95))',
              boxShadow: '0 8px 30px rgba(37, 160, 106, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
            }}
          >
            {/* Ambient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

            {/* Left part: Icon & Title */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/10">
                <ShoppingCart className="w-4.5 h-4.5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">View Basket</h4>
                <p className="text-[10px] text-white/80 mt-0.5">
                  {count} {count === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            {/* Right part: Price and Arrow */}
            <div className="flex items-center gap-2.5 relative z-10">
              <span className="font-display italic text-lg text-white font-bold bg-black/15 px-3 py-1 rounded-xl border border-white/10">
                {formatCurrency(tot)}
              </span>
              <ArrowRight className="w-4 h-4 text-white animate-pulse" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
