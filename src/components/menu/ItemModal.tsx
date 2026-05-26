'use client'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus } from 'lucide-react'
import type { MenuItem, Category } from '@/types/menu'
import { useCart } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/formatting'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ItemModalProps {
  item: MenuItem | null
  category: Category | null
  onClose: () => void
}

export function ItemModal({ item, category, onClose }: ItemModalProps) {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  // Reset state when a different item opens
  useEffect(() => {
    setSelectedSizeIdx(0)
    setQuantity(1)
  }, [item?.id])

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
          >
            <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl overflow-hidden pointer-events-auto shadow-2xl">
              {/* Header image area */}
              <div
                className="relative h-44 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${category?.accentColor ?? '#84cc16'}22, #07080f)` }}
              >
                <span className="text-8xl">{category?.icon ?? '🥙'}</span>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-brand-muted" />
                </button>
                {item.badge && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-green/20 text-brand-green border border-brand-green/30">
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
