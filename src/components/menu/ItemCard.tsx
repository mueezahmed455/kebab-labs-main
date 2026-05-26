'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
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
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-[var(--color-brand-glow-gold)] cursor-pointer"
      onClick={handleClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      <div
        className="h-40 relative overflow-hidden"
        style={!item.image ? { background: `linear-gradient(135deg, ${category.accentColor}25, #08080e)` } : undefined}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-5xl">{category.icon}</div>
        )}
        {item.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        )}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 backdrop-blur-sm text-brand-gold leading-tight">
            <Star className="w-2.5 h-2.5 fill-brand-gold" /> 4.9
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-bg leading-tight">
              {item.badge}
            </span>
          )}
        </div>
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

      <div className="p-3 flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-brand-text font-semibold text-sm leading-tight mb-1 line-clamp-1">{item.name}</p>
          <p className="text-brand-dim text-xs leading-snug line-clamp-2">{item.desc}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="font-display text-lg text-brand-gold leading-none">
            {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
          </span>
          <motion.div
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-brand-green)', borderColor: 'var(--color-brand-green)' }}
            className="w-7 h-7 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-green transition-colors" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
