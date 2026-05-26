'use client'
import Image from 'next/image'
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

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-green/40 hover:shadow-2xl hover:shadow-black/40 transition-all cursor-pointer"
      onClick={handleClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* Image area */}
      <div
        className="h-40 relative overflow-hidden"
        style={!item.image ? { background: `linear-gradient(135deg, ${category.accentColor}25, #07080f)` } : undefined}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-5xl">{category.icon}</div>
        )}
        {/* Gradient overlay */}
        {item.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        )}
        {item.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green text-brand-dark leading-tight z-10">
            {item.badge}
          </span>
        )}
        {(item.vegetarian || item.spicy) && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border z-10 ${
            item.vegetarian
              ? 'bg-green-900/80 text-green-300 border-green-700/40'
              : 'bg-red-900/80 text-red-300 border-red-700/40'
          }`}>
            {item.vegetarian ? '🌿' : '🌶️'}
          </span>
        )}
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
          <div className="w-7 h-7 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all">
            <Plus className="w-3.5 h-3.5 text-brand-green group-hover:text-brand-dark transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
