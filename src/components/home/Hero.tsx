'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Star, Clock, Truck, BadgeCheck } from 'lucide-react'
import { BRAND } from '@/lib/data/brand'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const STATS = [
  { icon: Star,       value: '4.9★',                        label: 'Rating' },
  { icon: Clock,      value: '30-45 min',                   label: 'Delivery' },
  { icon: Truck,      value: `£${BRAND.delivery.fee}`,      label: 'Delivery Fee' },
  { icon: BadgeCheck, value: `Free >£${BRAND.delivery.freeOver}`, label: 'Free Delivery' },
]

const FOOD_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=600&auto=format&fit=crop&q=85', alt: 'Chicken Shawarma wrap', rotate: '-rotate-3', delay: 0.3 },
  { src: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=85', alt: 'Kebab skewers', rotate: 'rotate-3', delay: 0.45 },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=85', alt: 'Stone-baked pizza', rotate: '-rotate-1', delay: 0.6 },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-green/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left — content */}
          <div>
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-sm font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              Clay Oven Specialist · Est. Burnley
            </motion.div>

            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="font-display leading-none tracking-wider"
            >
              <span className="block text-brand-white" style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}>THE</span>
              <span className="block text-brand-white" style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}>KEBAB</span>
              <span
                className="block"
                style={{
                  fontSize: 'clamp(64px, 10vw, 120px)',
                  background: 'linear-gradient(90deg, #84cc16, #a3e635)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >LAB</span>
            </motion.h1>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="mt-4 text-brand-muted text-lg leading-relaxed max-w-md"
            >
              Where fire meets flavour. Handcrafted kebabs, stone-baked pizzas & fresh shawarma — cooked over real clay oven coals in Burnley.
            </motion.p>

            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link
                href="/menu"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:brightness-110 transition-all hover:shadow-xl hover:shadow-brand-green/25 active:scale-95"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-brand-green/30 text-brand-white font-medium text-sm hover:bg-brand-green/5 hover:border-brand-green/60 transition-all"
              >
                View Full Menu
              </Link>
            </motion.div>

            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
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

          {/* Right — real food photos stacked */}
          <div className="hidden lg:block relative h-[520px]">
            {FOOD_IMAGES.map(({ src, alt, rotate, delay }, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className={`absolute rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${rotate}`}
                style={{
                  width: 260,
                  height: 320,
                  top: i === 0 ? 0 : i === 1 ? 120 : 200,
                  left: i === 0 ? 60 : i === 1 ? 200 : 20,
                  zIndex: 3 - i,
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="260px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            ))}
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute bottom-8 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-2xl bg-brand-card/90 backdrop-blur-sm border border-brand-green/30 shadow-xl"
            >
              <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-brand-green fill-brand-green" />
              </div>
              <div>
                <p className="text-brand-white text-xs font-bold">4.9 / 5 Stars</p>
                <p className="text-brand-dim text-[10px]">500+ reviews</p>
              </div>
            </motion.div>
            {/* Halal badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="absolute top-12 right-2 z-10 px-3 py-1.5 rounded-xl bg-brand-green text-brand-dark text-xs font-bold shadow-lg"
            >
              🥩 100% Halal
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
