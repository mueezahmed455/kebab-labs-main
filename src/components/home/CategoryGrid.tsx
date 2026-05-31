'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

const card = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 bg-brand-bg border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="font-display italic leading-none tracking-tight text-brand-text"
              style={{ fontSize: 'clamp(1.9rem,5vw,3rem)' }}
            >
              What are you after?
            </h2>
            <p className="text-brand-dim text-sm mt-1.5">
              {MENU_ITEMS.length}+ items across {CATEGORIES.length} categories
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden sm:flex text-[11px] font-semibold uppercase tracking-wider text-brand-dim hover:text-brand-gold transition-colors pb-0.5"
            style={{ borderBottom: '1px solid rgba(201,149,58,0.3)' }}
          >
            Full menu →
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3"
        >
          {CATEGORIES.map((cat) => {
            const itemCount = MENU_ITEMS.filter((item) => item.cat === cat.id).length
            return (
              <motion.div key={cat.id} variants={card}>
                <Link
                  href={`/menu#${cat.id}`}
                  className="group relative flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--color-brand-card)',
                    border: '1px solid var(--color-brand-border)',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = `${cat.accentColor}40`
                    el.style.transform = 'translateY(-4px)'
                    el.style.boxShadow = `0 16px 32px rgba(0,0,0,0.15), 0 0 24px ${cat.accentColor}12`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--color-brand-border)'
                    el.style.transform = ''
                    el.style.boxShadow = ''
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${cat.accentColor}10, transparent 65%)` }}
                  />

                   <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      background: `color-mix(in srgb, ${cat.accentColor} 8%, transparent)`, 
                      border: `1px solid color-mix(in srgb, ${cat.accentColor} 20%, transparent)`,
                      color: cat.accentColor
                    }}
                  >
                    <CategoryIcon id={cat.id} size={22} className="transition-transform duration-300 group-hover:rotate-6" />
                  </div>

                  <div className="text-center z-10">
                    <p className="text-sm font-semibold text-brand-text group-hover:text-brand-gold transition-colors leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-brand-dim mt-0.5">{itemCount} items</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
