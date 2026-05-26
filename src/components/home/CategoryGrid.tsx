'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Explore Our Menu</p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider">
            FIND YOUR FORMULA
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {CATEGORIES.map((cat) => {
            const itemCount = MENU_ITEMS.filter((item) => item.cat === cat.id).length
            return (
              <motion.div key={cat.id} variants={itemAnim}>
                <Link
                  href={`/menu#${cat.id}`}
                  className="group flex flex-col items-center p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-green/40 hover:bg-brand-card-hover transition-all"
                  style={{ '--accent': cat.accentColor } as React.CSSProperties}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ background: `${cat.accentColor}18` }}
                  >
                    {cat.icon}
                  </div>
                  <p className="text-brand-text text-sm font-semibold text-center leading-tight mb-1">{cat.name}</p>
                  <p className="text-brand-dim text-xs">{itemCount} items</p>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
