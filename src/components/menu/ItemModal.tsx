'use client'
import Image from 'next/image'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus } from 'lucide-react'
import type { MenuItem, Category } from '@/types/menu'
import { useCart } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/formatting'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { BLUR_PLACEHOLDER } from '@/lib/utils/blur'

interface ItemModalProps {
  item: MenuItem | null
  category: Category | null
  onClose: () => void
}

export function ItemModal({ item, category, onClose }: ItemModalProps) {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const modalRef = useRef<HTMLDivElement>(null)

  // Reset state when a different item opens
  useEffect(() => {
    setSelectedSizeIdx(0)
    setQuantity(1)
  }, [item?.id])

  // Focus trap
  useEffect(() => {
    if (!item) return
    const el = modalRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    el.addEventListener('keydown', handleTab)
    return () => el.removeEventListener('keydown', handleTab)
  }, [item])

  const selectedVariant = item?.sizes?.[selectedSizeIdx]
  const unitPrice = selectedVariant?.price ?? item?.price ?? 0
  const total = unitPrice * quantity

  const handleAdd = useCallback(() => {
    if (!item) return
    addItem({
      menuItemId: item.id,
      categoryId: item.cat,
      name: item.name,
      price: unitPrice,
      quantity,
      size: selectedVariant?.label,
    })
    toast.success(`${item.name} added to cart`, { description: formatCurrency(total) })
    onClose()
  }, [item, addItem, unitPrice, quantity, selectedVariant, total, onClose])

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label={item?.name ? `${item.name} — choose size and quantity` : 'Item details'}
          >
            <div ref={modalRef} className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl overflow-hidden pointer-events-auto shadow-2xl">
              {/* Header image area */}
              <div
                className="relative h-52 overflow-hidden"
                style={!item.image ? { background: `linear-gradient(135deg, ${category?.accentColor ?? '#84cc16'}22, var(--color-brand-bg))` } : undefined}
              >
                {item.image ? (
                  <>
                    <Image src={item.image} alt={item.name} fill sizes="448px" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-8xl">{category?.icon ?? '🥙'}</div>
                )}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {item.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-green text-brand-dark z-10">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Name + tags */}
                <div>
                  <h2 className="text-brand-white font-bold text-lg mb-1">{item.name}</h2>
                  <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.vegetarian && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-700/30">🌿 Vegetarian</span>
                    )}
                    {item.spicy && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-900/30 text-red-400 border border-red-700/30">🌶️ Spicy</span>
                    )}
                  </div>
                </div>

                {/* Size picker */}
                {item.sizes && item.sizes.length > 0 && (
                  <div>
                    <p className="text-brand-muted text-xs font-medium tracking-widest uppercase mb-2">Choose Size</p>
                    <div className="grid grid-cols-4 gap-2">
                      {item.sizes.map((size, idx) => (
                        <button
                          key={size.label}
                          onClick={() => setSelectedSizeIdx(idx)}
                          className={cn(
                            'flex flex-col items-center p-2 rounded-xl border transition-all',
                            idx === selectedSizeIdx
                              ? 'border-brand-green bg-brand-green/10 text-brand-green'
                              : 'border-brand-border text-brand-muted hover:border-brand-green/40'
                          )}
                        >
                          <span className="text-xs font-bold">{size.label}</span>
                          <span className="text-xs">{formatCurrency(size.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-green/40 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 text-brand-muted" />
                    </button>
                    <span className="w-6 text-center text-brand-white font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-full border border-brand-green/30 bg-brand-green/10 hover:bg-brand-green/20 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 text-brand-green" />
                    </button>
                  </div>
                </div>

                {/* Total + CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                  <div>
                    <p className="text-brand-muted text-xs">Total</p>
                    <p className="font-display text-2xl text-brand-green">{formatCurrency(total)}</p>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
