import type { MenuItem, Category } from '@/types/menu'
import { ItemCard } from './ItemCard'

interface CategorySectionProps {
  category: Category
  items: MenuItem[]
  onOpenModal: (item: MenuItem) => void
}

export function CategorySection({ category, items, onOpenModal }: CategorySectionProps) {
  if (items.length === 0) return null

  return (
    <section id={category.id} className="scroll-mt-36">
      {/* Category header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${category.accentColor}18` }}
          >
            {category.icon}
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-brand-white tracking-wider">{category.name.toUpperCase()}</h2>
            {category.description && (
              <p className="text-brand-dim text-xs">{category.description}</p>
            )}
          </div>
        </div>
        <span className="text-brand-dim text-sm">{items.length} items</span>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} category={category} onOpenModal={onOpenModal} />
        ))}
      </div>
    </section>
  )
}
