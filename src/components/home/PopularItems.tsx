'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cartStore'
import { MENU_ITEMS, CATEGORIES, POPULAR_ITEM_IDS } from '@/lib/data/menu'
import { formatCurrency } from '@/lib/utils/formatting'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function PopularItems() {
  const router = useRouter()
  const { addItem } = useCart()
  const items = POPULAR_ITEM_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)).filter(Boolean) as typeof MENU_ITEMS

  function handleAdd(item: typeof MENU_ITEMS[number]) {
    if (item.sizes && item.sizes.length > 0) {
      toast.info(`Choose your size for ${item.name}`, {
        action: { label: 'View Menu', onClick: () => router.push('/menu') },
      })
      return
    }
    addItem({
      menuItemId: item.id,
      categoryId: item.cat,
      name: item.name,
      price: item.price,
      quantity: 1,
    })
    toast.success(`${item.name} added to cart`, {
      description: formatCurrency(item.price),
    })
  }

  return (
    <section className="py-16 md:py-24 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Most Ordered</p>
            <h2 className="font-display text-4xl md:text-5xl text-brand-white tracking-wider">LAB FAVOURITES</h2>
          </div>
          <Link href="/menu" className="hidden sm:inline-flex text-brand-green text-sm font-medium hover:text-brand-green-light transition-colors">
            View all →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => {
            const cat = CATEGORIES.find((c) => c.id === item.cat)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-green/30 hover:shadow-xl hover:shadow-black/30 transition-all cursor-pointer"
                onClick={() => handleAdd(item)}
              >
                {/* Image area */}
                <div
                  className="h-40 flex items-center justify-center text-6xl relative"
                  style={{ background: `linear-gradient(135deg, ${cat?.accentColor}22, #07080f)` }}
                >
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-green/20 text-brand-green border border-brand-green/30">
                      {item.badge}
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-900/40 text-green-400 border border-green-700/30">
                      🌿 Veg
                    </span>
                  )}
                  {cat?.icon}
                </div>

                {/* Body */}
                <div className="p-4 flex items-end justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-brand-white font-semibold text-sm leading-tight mb-1">{item.name}</p>
                    <p className="text-brand-dim text-xs leading-snug line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-display text-xl text-brand-green">
                      {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                      <Plus className="w-4 h-4 text-brand-green" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
