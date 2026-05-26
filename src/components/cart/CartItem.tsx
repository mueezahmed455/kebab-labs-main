'use client'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/lib/store/cartStore'
import { useCart } from '@/lib/store/cartStore'
import { formatCurrency } from '@/lib/utils/formatting'
import { CATEGORIES } from '@/lib/data/menu'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const cat = CATEGORIES.find((c) => c.id === item.categoryId)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-3 border-b border-brand-border last:border-0"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: cat ? `${cat.accentColor}18` : '#0d1526' }}
      >
        {cat?.icon ?? '🥙'}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-brand-white text-sm font-medium line-clamp-1">{item.name}</p>
        {item.size && (
          <p className="text-brand-dim text-xs">{item.size}</p>
        )}
        <p className="text-brand-green text-sm font-semibold">{formatCurrency(item.price)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="w-7 h-7 rounded-full border border-brand-border hover:border-red-500/40 flex items-center justify-center transition-colors"
          aria-label="Decrease quantity"
        >
          {item.quantity === 1 ? (
            <Trash2 className="w-3 h-3 text-red-400" />
          ) : (
            <Minus className="w-3 h-3 text-brand-muted" />
          )}
        </button>
        <span className="w-5 text-center text-brand-white text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="w-7 h-7 rounded-full border border-brand-green/30 bg-brand-green/10 hover:bg-brand-green/20 flex items-center justify-center transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3 text-brand-green" />
        </button>
      </div>

      {/* Line total */}
      <div className="text-brand-white text-sm font-semibold flex-shrink-0 w-12 text-right">
        {formatCurrency(item.price * item.quantity)}
      </div>
    </motion.div>
  )
}
