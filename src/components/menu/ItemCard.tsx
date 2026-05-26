'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Star, Zap } from 'lucide-react'
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
      toast.success(`${item.name} added`, { 
        description: formatCurrency(item.price),
        className: "bg-brand-card border-brand-green/20 text-brand-text"
      })
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-brand-card border border-brand-border rounded-[2rem] overflow-hidden hover:border-brand-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(201,149,58,0.08)] transition-all duration-500 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className="h-44 relative overflow-hidden"
        style={!item.image ? { background: `linear-gradient(135deg, ${category.accentColor}15, var(--color-brand-bg))` } : undefined}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-5xl bg-brand-surface/50">{category.icon}</div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-brand-gold border border-brand-gold/20">
            <Star className="w-2.5 h-2.5 fill-brand-gold" /> 4.9
          </div>
          {item.badge && (
            <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-gold text-brand-dark shadow-xl">
              {item.badge}
            </div>
          )}
        </div>

        {/* Dietary/Spicy Icons */}
        {(item.vegetarian || item.spicy) && (
          <div className="absolute top-3 right-3 z-20">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border ${
              item.vegetarian 
                ? 'bg-brand-green/20 border-brand-green/30 text-brand-green' 
                : 'bg-red-500/20 border-red-500/30 text-red-500'
            }`}>
              {item.vegetarian ? '🌿' : <Zap className="w-4 h-4 fill-current" />}
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-brand-text font-bold text-base group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
            {item.name}
          </h3>
          <div className="w-9 h-9 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all duration-300">
            <Plus className="w-4 h-4 text-brand-green group-hover:text-brand-dark transition-colors" />
          </div>
        </div>
        
        <p className="text-brand-dim text-xs leading-relaxed line-clamp-2 mb-4 group-hover:text-brand-muted transition-colors">
          {item.desc}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="px-3 py-1 rounded-lg bg-brand-surface border border-brand-border">
            <span className="font-display text-xl text-brand-gold">
              {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
            </span>
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-brand-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Add to Order
          </span>
        </div>
      </div>

      {/* Luxury Hover Border */}
      <div className="absolute inset-0 border-2 border-brand-gold/0 group-hover:border-brand-gold/10 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
    </motion.div>
  )
}
