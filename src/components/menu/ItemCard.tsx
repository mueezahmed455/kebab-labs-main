'use client'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { MenuItem, Category } from '@/types/menu'
import { formatCurrency } from '@/lib/utils/formatting'
import { useCart } from '@/lib/store/cartStore'
import { toast } from 'sonner'

interface ItemCardProps {
  item: MenuItem
  category: Category
  onOpenModal: (item: MenuItem) => void
}

export function ItemCard({ item, category, onOpenModal }: ItemCardProps) {
  const { addItem } = useCart()

  function handleClick() {
    if (item.sizes && item.sizes.length > 0) {
      onOpenModal(item)
    } else {
      addItem({
        menuItemId: item.id,
        categoryId: item.cat,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
      toast.success(`${item.name} added`, { description: formatCurrency(item.price) })
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-green/30 hover:shadow-xl hover:shadow-black/30 transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Image area */}
      <div
        className="h-36 flex items-center justify-center text-5xl relative"
        style={{ background: `linear-gradient(135deg, ${category.accentColor}20, #07080f)` }}
      >
        {item.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-green/20 text-brand-green border border-brand-green/30 leading-tight">
            {item.badge}
          </span>
        )}
        {(item.vegetarian || item.spicy) && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.vegetarian ? 'bg-green-900/40 text-green-400 border-green-700/30' : 'bg-red-900/40 text-red-400 border-red-700/30'}`}>
            {item.vegetarian ? '🌿' : '🌶️'}
          </span>
        )}
        {category.icon}
      </div>

      {/* Body */}
      <div className="p-3 flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-brand-white font-semibold text-sm leading-tight mb-1 line-clamp-1">{item.name}</p>
          <p className="text-brand-dim text-xs leading-snug line-clamp-2">{item.desc}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="font-display text-lg text-brand-green leading-none">
            {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
          </span>
          <div className="w-7 h-7 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
            <Plus className="w-3.5 h-3.5 text-brand-green" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
