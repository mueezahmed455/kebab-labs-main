'use client'
import Image from 'next/image'
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
    toast.success(`${item.name} added to cart`, { description: formatCurrency(item.price) })
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
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-green/40 hover:shadow-2xl hover:shadow-black/40 transition-all cursor-pointer"
                onClick={() => handleAdd(item)}
              >
                {/* Image */}
                <div
                  className="h-48 relative overflow-hidden"
                  style={!item.image ? { background: `linear-gradient(135deg, ${cat?.accentColor}22, #07080f)` } : undefined}
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
                    <div className="h-full flex items-center justify-center text-6xl">{cat?.icon}</div>
                  )}
                  {item.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  )}
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-green text-brand-dark z-10">
                      {item.badge}
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/80 text-green-300 border border-green-700/40 z-10">
                      🌿 Veg
                    </span>
                  )}
                  {/* Price overlay at bottom */}
                  {item.image && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="font-display text-2xl text-white drop-shadow-lg">
                        {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex items-end justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-brand-white font-semibold text-sm leading-tight mb-1">{item.name}</p>
                    <p className="text-brand-dim text-xs leading-snug line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!item.image && (
                      <span className="font-display text-xl text-brand-green">
                        {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all">
                      <Plus className="w-4 h-4 text-brand-green group-hover:text-brand-dark transition-colors" />
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
