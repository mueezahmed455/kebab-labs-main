'use client'
import { motion } from 'framer-motion'
import type { MenuItem, Category } from '@/types/menu'
import { ItemCard } from './ItemCard'
import { Sparkles } from 'lucide-react'

interface CategorySectionProps {
  category: Category
  items: MenuItem[]
  onOpenModal: (item: MenuItem) => void
}

const container = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 } 
  },
}

const itemAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  },
}

export function CategorySection({ category, items, onOpenModal }: CategorySectionProps) {
  if (items.length === 0) return null

  return (
    <section id={category.id} className="scroll-mt-44 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-brand-border/40">
        <div className="flex items-center gap-6">
          <div
            className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-4xl shadow-xl transition-transform hover:scale-110 duration-500"
            style={{ 
              background: `linear-gradient(135deg, ${category.accentColor}25, ${category.accentColor}05)`,
              border: `1px solid ${category.accentColor}30`
            }}
          >
            {category.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3 h-3 text-brand-gold opacity-50" />
              <p className="text-brand-dim text-[10px] font-semibold uppercase tracking-[0.2em]">Signature Selection</p>
            </div>
              <h2 className="font-display italic text-4xl md:text-5xl text-brand-text tracking-tight leading-none">
                  {category.name}
            </h2>
            {category.description && (
              <p className="text-brand-muted text-sm mt-2 max-w-lg leading-relaxed font-medium">{category.description}</p>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface border border-brand-border shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-brand-dim text-[10px] font-semibold uppercase tracking-wider">{items.length} Items</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={itemAnim}>
            <ItemCard item={item} category={category} onOpenModal={onOpenModal} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
