'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame, Zap, Users } from 'lucide-react'
import { PageTransition } from '@/components/common/PageTransition'

const DEALS = [
  {
    title: 'Shawarma Meal Deals',
    sub: 'Mix & match your favourite shawarma combinations',
    accent: '#c9953a',
    items: [
      { name: 'Mix Shawarma & Donner', price: '£12.00', badge: 'Popular', desc: '' },
      { name: 'Mix Shawarma & Chicken Tikka', price: '£13.00', desc: '' },
      { name: 'Mix Shawarma & Chicken Wings', price: '£13.00', desc: '' },
      { name: 'Mix Shawarma & Kobeda', price: '£13.00', desc: '' },
      { name: 'Chicken Shawarma, Donner & Tikka', price: '£15.00', desc: '' },
      { name: 'Chicken Shawarma, Donner & Wings', price: '£15.00', desc: '' },
      { name: 'Tikka, Donner & Kobeda', price: '£15.00', desc: '' },
      { name: 'Lamb Shawarma, Donner & Tikka', price: '£15.00', desc: '' },
      { name: 'Lamb Shawarma, Donner & Wings', price: '£15.00', desc: '' },
      { name: 'Lamb Shawarma, Donner & Kobeda', price: '£16.00', badge: 'Premium', desc: '' },
      { name: 'Chicken Tikka & Wings', price: '£13.00', desc: '' },
      { name: 'Tikka, Wings & Kobeda', price: '£15.00', desc: '' },
      { name: 'Tikka, Donner & Kobeda', price: '£15.00', desc: '' },
    ],
    icon: Flame,
  },
  {
    title: 'Kebab Lab Meal Deals',
    sub: 'Includes small chips & a drink',
    accent: '#c94d15',
    items: [
      { name: 'Chicken Shawarma Meal', price: '£10.00', desc: '' },
      { name: 'Lamb Shawarma Meal', price: '£11.00', desc: '' },
      { name: 'Mix Shawarma Meal', price: '£12.00', desc: '' },
      { name: 'Single Kobeda Meal', price: '£10.00', badge: 'Best Value', desc: '' },
      { name: 'Double Kobeda Meal', price: '£14.50', desc: '' },
      { name: 'Chicken Tikka Meal', price: '£9.00', desc: '' },
      { name: 'Double Tikka Meal', price: '£15.00', desc: '' },
    ],
    icon: Zap,
  },
  {
    title: 'Sharing Platters',
    sub: 'Feed the whole table',
    accent: '#c9953a',
    items: [
      { name: 'Duo Platter (Serves 2)', price: '£22.00', desc: 'Chicken Shawarma + choice of meat' },
      { name: 'Lamb Shawarma Platter', price: '£23.00', desc: 'Serves 2–3' },
      { name: 'Mix Shawarma Platter', price: '£25.00', desc: 'Serves 2–3' },
      { name: 'Kebab Lab Sizzler', price: '£17.00', desc: '1–2 people · Kobeda, Tikka, Wings, Donner on 12" naan', badge: 'Popular' },
      { name: 'Kebab Lab Special', price: '£34.00', desc: '4–5 people · 2 Kobeda, 5 Wings, 4 Shish, Shawarma, Donner on 18" naan', badge: 'Feast' },
      { name: 'Divine Platter', price: '£17.00', desc: 'Serves 2 · Lamb & Chicken Shawarma with chips & cheese' },
      { name: 'Sides Platter', price: '£12.00', desc: 'Nuggets, Onion Rings, Wings, Donner, Chips' },
      { name: 'Jumbo Size', price: '£45.00', desc: '5–6 people on Super Jumbo Naan', badge: 'Jumbo' },
    ],
    icon: Users,
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function DealsPage() {
  return (
    <PageTransition>
      <section className="py-16 md:py-24 bg-brand-bg min-h-screen relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-brand-glow) 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{
                border: '1px solid color-mix(in srgb, var(--color-brand-fire) 25%, transparent)',
                background: 'color-mix(in srgb, var(--color-brand-fire) 8%, transparent)',
                color: 'var(--color-brand-fire)',
              }}
            >
              <Flame className="w-3 h-3" />
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">Best Value</span>
            </div>
            <h1
              className="font-display italic text-brand-text tracking-tight leading-[0.9] mb-4"
              style={{ fontSize: 'clamp(2.8rem,8vw,5rem)' }}
            >
              Deals &amp; <span className="text-gradient-fire">Platters</span>
            </h1>
            <p className="text-brand-muted text-lg max-w-lg mx-auto">
              Unbeatable combinations designed to feed your appetite without emptying your wallet.
            </p>
          </motion.div>

          {/* Deal sections */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-14"
          >
            {DEALS.map((deal) => (
              <motion.div key={deal.title} variants={cardAnim}>
                {/* Section header */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${deal.accent}15`, border: `1px solid ${deal.accent}25` }}
                  >
                    <deal.icon className="w-5 h-5" style={{ color: deal.accent }} />
                  </div>
                  <div>
                    <h2 className="font-display italic text-2xl md:text-3xl text-brand-text tracking-tight">{deal.title}</h2>
                    {deal.sub && <p className="text-brand-dim text-sm mt-0.5">{deal.sub}</p>}
                  </div>
                </div>

                {/* Items table */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--color-brand-card)',
                    border: '1px solid var(--color-brand-border)',
                  }}
                >
                  <div className="divide-y divide-brand-border">
                    {deal.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--color-brand-hover)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = ''
                        }}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-brand-text text-sm font-medium">{item.name}</span>
                            {item.badge && (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                style={{
                                  background: `${deal.accent}15`,
                                  color: deal.accent,
                                  border: `1px solid ${deal.accent}25`,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <span className="text-brand-dim text-xs">{item.desc}</span>
                          )}
                        </div>
                        <span
                          className="font-display italic text-lg ml-4 flex-shrink-0"
                          style={{ color: deal.accent }}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 text-center"
          >
            <p className="text-brand-muted text-sm mb-5">All platters & deals can be ordered online for delivery or collection.</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-fire text-white font-bold text-lg hover:bg-brand-fire-dark transition-all active:scale-95 shadow-lg"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
