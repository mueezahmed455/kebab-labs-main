'use client'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Star, Clock, Truck, BadgeCheck } from 'lucide-react'
import { OrbBackground } from '@/components/common/OrbBackground'
import { BRAND } from '@/lib/data/brand'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const STATS = [
  { icon: Star,      value: '4.9★',        label: 'Rating' },
  { icon: Clock,     value: '30-45 min',   label: 'Delivery' },
  { icon: Truck,     value: `£${BRAND.delivery.fee}`, label: 'Delivery Fee' },
  { icon: BadgeCheck,value: `Free >£${BRAND.delivery.freeOver}`, label: 'Free Delivery' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      <OrbBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — content */}
          <div>
            {/* Eyebrow */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-sm font-medium mb-6"
            >
              <span>⚗️</span>
              <span>Clay Oven Specialist · Est. Burnley</span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden">
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-display text-[80px] sm:text-[100px] md:text-[120px] leading-none tracking-wider"
              >
                <span className="block text-brand-white">THE</span>
                <span className="block text-brand-white">KEBAB</span>
                <span className="block text-brand-green">LAB</span>
              </motion.h1>
            </div>

            {/* Sub */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-4 text-brand-muted text-lg leading-relaxed max-w-md"
            >
              Where fire meets flavour. Handcrafted kebabs, stone-baked pizzas & fresh shawarma — cooked over real clay oven coals.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link
                href="/menu"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all hover:shadow-lg hover:shadow-brand-green/20 active:scale-95"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-green/30 text-brand-white font-medium text-sm hover:bg-brand-green/5 hover:border-brand-green/60 transition-all"
              >
                View Full Menu
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-6 gap-y-3 mt-10 pt-6 border-t border-brand-border"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-green" />
                  <div>
                    <div className="font-display text-lg leading-none text-brand-white">{value}</div>
                    <div className="text-xs text-brand-dim leading-none mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — decorative */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-green/20 animate-spin"
                style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full border border-brand-green/10 animate-spin"
                style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              {/* Centre */}
              <div className="absolute inset-8 rounded-full bg-brand-green/5 border border-brand-green/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-2">🥙</div>
                  <div className="font-display text-2xl text-brand-green tracking-wider">THE LAB</div>
                  <div className="text-xs text-brand-muted tracking-widest uppercase">Clay Oven</div>
                </div>
              </div>
              {/* Floating badges */}
              {[
                { emoji: '🔥', label: 'Clay Oven', pos: 'top-4 -right-4' },
                { emoji: '🍕', label: 'Stone Baked', pos: 'bottom-4 -left-4' },
                { emoji: '⭐', label: '4.9 Stars', pos: 'top-1/2 -left-8' },
              ].map(({ emoji, label, pos }) => (
                <div
                  key={label}
                  className={`absolute ${pos} flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass border border-brand-green/20 text-xs font-medium text-brand-white`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
