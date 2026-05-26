'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'
import { ChevronRight } from 'lucide-react'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const card = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function CategoryGrid() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-brand-bg">
      {/* Warm centre glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-14"
        >
          <p
            className="text-[10px] font-semibold uppercase mb-3 tracking-[0.3em] text-brand-gold"
          >
            Curated Categories
          </p>
          <h2
            className="font-display italic leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}
          >
            <span className="text-brand-text">Find Your </span>
            <span className="text-gradient-fire">Formula</span>
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
              <motion.div key={cat.id} variants={card}>
                <Link
                  href={`/menu#${cat.id}`}
                  className="group relative flex flex-col items-center p-5 md:p-6 rounded-[1.75rem] overflow-hidden"
                  style={{
                    background:  'var(--color-brand-card)',
                    border:      '1px solid var(--color-brand-border)',
                    transition:  'transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = `${cat.accentColor}45`
                    el.style.transform   = 'translateY(-5px) scale(1.02)'
                    el.style.boxShadow   = `0 20px 40px rgba(0,0,0,0.2), 0 0 30px ${cat.accentColor}18`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--color-brand-border)'
                    el.style.transform   = ''
                    el.style.boxShadow   = ''
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${cat.accentColor}12, transparent 65%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 z-10 flex-shrink-0"
                    style={{
                      background: `${cat.accentColor}15`,
                      border:     `1px solid ${cat.accentColor}28`,
                    }}
                  >
                    {cat.icon}
                  </div>

                  <div className="text-center z-10">
                    <p
                      className="text-sm font-medium tracking-tight mb-0.5 group-hover:text-brand-gold transition-colors text-brand-text"
                    >
                      {cat.name}
                    </p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-brand-dim">
                      {itemCount} items
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: cat.accentColor }} />
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
