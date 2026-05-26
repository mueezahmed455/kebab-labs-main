'use client'
import { motion } from 'framer-motion'
import { FlaskConical, Flame, Leaf, Award, Star, Clock, Truck, Users } from 'lucide-react'
import Link from 'next/link'
import { BRAND } from '@/lib/data/brand'
import { PageTransition } from '@/components/common/PageTransition'

const VALUES = [
  { icon: Flame, title: 'Clay Oven Tradition', desc: 'We cook exclusively over real clay oven coals. No gas, no shortcuts — just intense, dry heat that gives our food its signature char and smoky depth.' },
  { icon: Leaf, title: 'Fresh Daily', desc: 'Every ingredient is prepared fresh on the day. Our meats are marinated in house, our salads are chopped to order, and our bread is baked throughout service.' },
  { icon: Award, title: 'Quality First', desc: 'We source premium cuts, use authentic spice blends, and never compromise on portion size. Our 4.9★ rating reflects a commitment that never wavers.' },
  { icon: FlaskConical, title: 'The Lab Method', desc: 'Every recipe is developed through rigorous testing — precise ratios, controlled variables, repeatable results. We treat cooking like science because flavour deserves precision.' },
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
      <section className="relative py-24 md:py-32 bg-brand-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-green/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-green text-sm font-medium tracking-widest uppercase mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-brand-text tracking-wider mb-6"
          >
            THE SCIENCE<br />OF FLAVOUR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-lg leading-relaxed max-w-xl mx-auto"
          >
            We&apos;re not just another kebab shop. The Kebab Lab is a purpose-built kitchen where traditional clay oven cooking meets modern flavour science — right here in Burnley.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-brand-bg border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider">WHAT WE STAND FOR</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="bg-brand-card border border-brand-border rounded-2xl p-6 hover:border-brand-green/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-brand-green" />
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
              { icon: Star, value: '4.9★', label: 'Average Rating' },
              { icon: Clock, value: '4PM–12:40AM', label: 'Open 6 Days' },
              { icon: Truck, value: '3 miles', label: 'Delivery Radius' },
              { icon: Users, value: '500+', label: 'Happy Customers' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <s.icon className="w-5 h-5 text-brand-green" />
                <span className="font-display text-3xl text-brand-text">{s.value}</span>
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
            className="font-display text-4xl md:text-5xl text-brand-text tracking-wider text-center mb-12"
          >
            OUR JOURNEY
          </motion.h2>
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 border-l-2 border-brand-border"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-green border-2 border-brand-bg" />
                <span className="text-brand-green text-sm font-bold">{t.year}</span>
                <h3 className="text-brand-text font-semibold text-lg mt-1">{t.title}</h3>
                <p className="text-brand-muted text-sm mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-green/5 border-y border-brand-green/20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider mb-4">
            READY TO EXPERIENCE<br />THE LAB?
          </h2>
          <p className="text-brand-muted mb-8">Order now for delivery across Burnley or swing by for collection.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-green text-brand-dark font-bold text-lg hover:bg-brand-green-dark transition-all hover:shadow-xl active:scale-95"
          >
            Order Now
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
