'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/cartStore'
import { CartItem } from './CartItem'
import { OrderTypeToggle } from './OrderTypeToggle'
import { formatCurrency } from '@/lib/utils/formatting'
import { BRAND } from '@/lib/data/brand'

export function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, deliveryFee, total, orderType } = useCart()
  const sub = subtotal()
  const fee = deliveryFee()
  const tot = total()
  const minOrder = BRAND.delivery.minimumOrder
  const belowMin = orderType === 'delivery' && sub < minOrder && items.length > 0
  const toFreeDelivery = BRAND.delivery.freeOver - sub

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, setOpen])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-brand-surface border-l border-brand-border flex flex-col shadow-2xl"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-green" />
                <span className="font-display text-xl tracking-wider text-brand-white">YOUR ORDER</span>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-green text-brand-dark text-xs font-bold">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-brand-card flex items-center justify-center transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4 text-brand-muted" />
              </button>
            </div>

            {/* Order type toggle */}
            <div className="px-5 pt-4 pb-2 border-b border-brand-border">
              <OrderTypeToggle />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-5 bg-brand-surface border border-brand-border/60 text-brand-dim relative shadow-lg">
                    <ShoppingCart className="w-6 h-6 stroke-[1.2] text-brand-dim" />
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  </div>
                  <p className="text-brand-text font-bold text-sm tracking-wide">Your basket is empty</p>
                  <p className="text-brand-dim text-xs mt-1">Add items from the menu to get started</p>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="mt-4 px-4 py-2 rounded-xl border border-brand-green/30 text-brand-green text-sm hover:bg-brand-green/10 transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer totals + CTA */}
            {items.length > 0 && (
              <div className="px-5 pb-5 pt-3 border-t border-brand-border space-y-3">
                {/* Min order warning */}
                {belowMin && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-400 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Minimum delivery order is {formatCurrency(minOrder)}</span>
                  </div>
                )}

                {/* Free delivery nudge */}
                {orderType === 'delivery' && toFreeDelivery > 0 && sub >= minOrder && (
                  <p className="text-brand-green text-xs text-center">
                    Add {formatCurrency(toFreeDelivery)} more for free delivery!
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-brand-muted">
                    <span>Subtotal</span>
                    <span className="text-brand-white">{formatCurrency(sub)}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>Delivery</span>
                    <span className={fee === 0 ? 'text-brand-green' : 'text-brand-white'}>
                      {orderType === 'collection' ? 'Free (collection)' : fee === 0 ? 'Free' : formatCurrency(fee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-brand-white border-t border-brand-border pt-2">
                    <span>Total</span>
                    <span className="font-display text-xl text-brand-green">{formatCurrency(tot)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    belowMin
                      ? 'bg-brand-border text-brand-dim cursor-not-allowed pointer-events-none'
                      : 'bg-brand-green text-brand-dark hover:bg-brand-green-dark hover:shadow-lg hover:shadow-brand-green/20 active:scale-95'
                  }`}
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
