'use client'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '🔥', title: 'Clay Oven Cooked',   sub: 'Authentic charcoal flavour' },
  { icon: '🌿', title: 'Always Fresh',        sub: 'Prepared daily, never frozen' },
  { icon: '🚗', title: 'Fast Delivery',       sub: '30-45 min to your door' },
  { icon: '⭐', title: '5-Star Quality',       sub: 'Rated 4.9 by our regulars' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function FeaturesBar() {
  return (
    <section className="bg-brand-card/50 border-y border-brand-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {FEATURES.map(({ icon, title, sub }) => (
            <motion.div key={title} variants={itemAnim} className="flex items-center gap-3 py-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-xl">
                {icon}
              </div>
              <div>
                <p className="text-brand-text text-sm font-semibold">{title}</p>
                <p className="text-brand-dim text-xs">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
