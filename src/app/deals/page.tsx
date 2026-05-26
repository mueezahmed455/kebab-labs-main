'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Beer } from 'lucide-react'
import { PageTransition } from '@/components/common/PageTransition'

const DEALS = [
  {
    title: 'Shawarma Meal Deals',
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
    icon: Sparkles,
  },
  {
    title: 'Kebab Lab Meal Deals',
    sub: 'Includes small chips & a drink',
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
    items: [
      { name: 'Duo Platter (Serves 2)', price: '£22.00', desc: 'Chicken Shawarma + choice of meat' },
      { name: 'Lamb Shawarma Platter', price: '£23.00', desc: 'Serves 2-3' },
      { name: 'Mix Shawarma Platter', price: '£25.00', desc: 'Serves 2-3' },
      { name: 'Kebab Lab Sizzler', price: '£17.00', desc: '1-2 people · Kobeda, Tikka, Wings, Donner on 12" naan', badge: 'Popular' },
      { name: 'Kebab Lab Special', price: '£34.00', desc: '4-5 people · 2 Kobeda, 5 Wings, 4 Shish, Shawarma, Donner on 18" naan', badge: 'Feast' },
      { name: 'Divine Platter', price: '£17.00', desc: 'Serves 2 · Lamb & Chicken Shawarma with chips & cheese' },
      { name: 'Sides Platter', price: '£12.00', desc: 'Nuggets, Onion Rings, Wings, Donner, Chips' },
      { name: 'Jumbo Size', price: '£45.00', desc: '5-6 people on Super Jumbo Naan', badge: 'Jumbo' },
    ],
    icon: Beer,
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function DealsPage() {
  return (
    <PageTransition>
      <section className="py-16 md:py-24 bg-brand-bg min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Best Value</p>
            <h1 className="font-display italic text-5xl md:text-7xl text-brand-text tracking-tight leading-[0.9] mb-4">Deals &amp; Platters</h1>
            <p className="text-brand-muted text-lg max-w-lg mx-auto">
              Unbeatable combinations designed to feed your appetite without emptying your wallet.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {DEALS.map((deal) => (
              <motion.div key={deal.title} variants={cardAnim}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                    <deal.icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h2 className="font-display italic text-2xl md:text-3xl text-brand-text tracking-tight">{deal.title}</h2>
                    {deal.sub && <p className="text-brand-dim text-sm">{deal.sub}</p>}
                  </div>
                </div>

                <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
                  <div className="divide-y divide-brand-border">
                    {deal.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-brand-card-hover transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-brand-text text-sm font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green/15 text-brand-green border border-brand-green/20">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          {item.desc && item.desc.length > 0 && <span className="hidden md:block text-brand-dim text-xs text-right max-w-[200px]">{item.desc}</span>}
                          <span className="font-display italic text-lg text-brand-green">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-green text-brand-dark font-bold text-lg hover:bg-brand-green-dark transition-all active:scale-95"
            >
              View Full Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
