'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Explore Our Menu</p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-white tracking-wider">
            FIND YOUR FORMULA
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => {
            const itemCount = MENU_ITEMS.filter((item) => item.cat === cat.id).length
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/menu#${cat.id}`}
                  className="group flex flex-col items-center p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-green/40 hover:bg-brand-card-hover transition-all"
                  style={{ '--accent': cat.accentColor } as React.CSSProperties}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-110"
                    style={{ background: `${cat.accentColor}18` }}
                  >
                    {cat.icon}
                  </div>
                  <p className="text-brand-white text-sm font-semibold text-center leading-tight mb-1">{cat.name}</p>
                  <p className="text-brand-dim text-xs">{itemCount} items</p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
