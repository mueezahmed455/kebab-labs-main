'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FlaskConical, Flame, Leaf, Award, Star, Clock, Truck, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BRAND } from '@/lib/data/brand'
import { PageTransition } from '@/components/common/PageTransition'

const VALUES = [
  {
    icon: Flame,
    title: 'Clay Oven Tradition',
    desc: 'We cook exclusively over real clay oven coals. No gas, no shortcuts — just intense, dry heat that gives our food its signature char and smoky depth.',
    color: '#c94d15',
  },
  {
    icon: Leaf,
    title: 'Fresh Daily',
    desc: 'Every ingredient is prepared fresh on the day. Our meats are marinated in house, our salads are chopped to order, and our bread is baked throughout service.',
    color: '#0f9b5e',
  },
  {
    icon: Award,
    title: 'Quality First',
    desc: "We source premium cuts, use authentic spice blends, and never compromise on portion size. Our 4.9★ rating reflects a commitment that never wavers.",
    color: '#c9953a',
  },
  {
    icon: FlaskConical,
    title: 'The Lab Method',
    desc: 'Every recipe is developed through rigorous testing — precise ratios, controlled variables, repeatable results. We treat cooking like science because flavour deserves precision.',
    color: '#c9953a',
  },
]

const TIMELINE = [
  { year: '2022', title: 'The Vision', desc: 'The Kebab Lab was born from a simple idea — Burnley deserved better takeaway. Not just food, but an experience.' },
  { year: '2023', title: 'Clay Oven Installed', desc: 'We imported and installed a traditional clay oven, committing to authentic cooking methods over convenience.' },
  { year: '2024', title: 'Community Favourite', desc: 'Rated 4.9★ with hundreds of 5-star reviews. Expanded our menu based on customer requests and seasonal ingredients.' },
  { year: '2025', title: 'Online Launch', desc: 'Launched our full online ordering platform with real-time tracking, making it easier than ever to enjoy The Kebab Lab at home.' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-24 pb-0 md:pt-32 bg-brand-bg overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full blur-[180px] pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(ellipse, var(--color-brand-glow) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-brand-fire text-sm font-semibold tracking-[0.22em] uppercase mb-4"
              >
                Our Story
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display italic text-5xl md:text-6xl lg:text-7xl text-brand-text tracking-tight mb-6 leading-[0.9]"
              >
                The Science<br />
                <span className="text-gradient-fire">of Flavour</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-brand-muted text-lg leading-relaxed mb-8 max-w-lg"
              >
                We&apos;re not just another kebab shop. The Kebab Lab is a purpose-built kitchen where traditional clay oven cooking meets modern flavour science — right here in Burnley.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-fire text-white font-semibold text-sm hover:bg-brand-fire-dark transition-all active:scale-95"
                >
                  Explore the Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden"
              style={{ border: '1px solid var(--color-brand-border)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=900&q=85&auto=format&fit=crop"
                alt="Clay oven cooking at The Kebab Lab"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(7,4,2,0.7) 0%, rgba(7,4,2,0.1) 50%, transparent 100%)',
              }} />
              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-6 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(7,4,2,0.85)',
                  border: '1px solid rgba(201,149,58,0.25)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-brand-gold font-display italic text-2xl">4.9★</p>
                <p className="text-brand-muted text-xs">200+ Google Reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-brand-bg border-t border-brand-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display italic text-4xl md:text-5xl text-brand-text tracking-tight leading-[0.9]">What We Stand For</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="rounded-2xl p-6 transition-colors duration-300"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${v.color}30`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand-border)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${v.color}15`, border: `1px solid ${v.color}25` }}
                >
                  <v.icon className="w-6 h-6" style={{ color: v.color }} />
                </div>
                <h3 className="text-brand-text font-semibold mb-2">{v.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-brand-border bg-brand-card/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Star,  value: '4.9★',        label: 'Average Rating',   color: '#c9953a' },
              { icon: Clock, value: '4PM–12:40AM', label: 'Open 6 Days',      color: '#c94d15' },
              { icon: Truck, value: '3 miles',      label: 'Delivery Radius',  color: '#0f9b5e' },
              { icon: Users, value: '500+',         label: 'Happy Customers',  color: '#c9953a' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                <span className="font-display italic text-3xl text-brand-text">{s.value}</span>
                <span className="text-brand-dim text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-4xl md:text-5xl text-brand-text tracking-tight leading-[0.9] text-center mb-12"
          >
            Our Journey
          </motion.h2>
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8"
                style={{ borderLeft: '2px solid var(--color-brand-border)' }}
              >
                <div
                  className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2"
                  style={{ background: '#c94d15', borderColor: 'var(--color-brand-bg)' }}
                />
                <span className="text-brand-fire text-sm font-bold">{t.year}</span>
                <h3 className="text-brand-text font-semibold text-lg mt-1">{t.title}</h3>
                <p className="text-brand-muted text-sm mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-y border-brand-border"
        style={{ background: 'rgba(201,77,21,0.04)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display italic text-4xl md:text-5xl text-brand-text tracking-tight leading-[0.9] mb-4">
            Ready to Experience<br />
            <span className="text-gradient-fire">The Lab?</span>
          </h2>
          <p className="text-brand-muted mb-8">Order now for delivery across Burnley or swing by for collection.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-fire text-white font-bold text-lg hover:bg-brand-fire-dark transition-all hover:shadow-xl active:scale-95"
          >
            Order Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
