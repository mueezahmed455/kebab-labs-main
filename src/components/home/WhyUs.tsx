'use client'
import { motion } from 'framer-motion'
import { FlaskConical, Flame, Leaf, Award } from 'lucide-react'
import { BRAND } from '@/lib/data/brand'

const REASONS = [
  {
    icon: FlaskConical,
    title: 'The Lab Formula',
    desc: 'We treat every recipe like a scientific formula. Precise spice ratios, controlled cooking temperatures, and consistent technique — every single time.',
  },
  {
    icon: Flame,
    title: 'Real Clay Oven Cooking',
    desc: "Not a gas grill. Not a flat-top. A genuine clay oven. The intense, dry heat creates a char and smoke infusion you simply can't replicate any other way.",
  },
  {
    icon: Leaf,
    title: 'Fresh Every Day',
    desc: 'Meats marinated fresh daily. Salads prepared to order. We never use frozen shortcuts — if we run out, we run out.',
  },
  {
    icon: Award,
    title: 'Burnley\'s Best Since Day One',
    desc: 'Trusted by thousands of local families and rated 4.9 stars. We earned our reputation one kebab at a time.',
  },
]

const STATS = [
  { value: '4.9★', label: 'Average Rating' },
  { value: '6', label: 'Days a Week' },
  { value: '3mi', label: 'Delivery Radius' },
  { value: '100+', label: 'Menu Items' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const reasonAnim = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const statAnim = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function WhyUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — reasons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider mb-8">
              THE SCIENCE<br />OF FLAVOUR
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {REASONS.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={reasonAnim} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-brand-text font-semibold mb-1">{title}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pt-16"
          >
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={statAnim}
                  className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center hover:border-brand-green/30 transition-colors"
                >
                  <div className="font-display text-4xl text-brand-green mb-1">{value}</div>
                  <div className="text-brand-muted text-sm">{label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 p-6 rounded-2xl bg-brand-green/5 border border-brand-green/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <h4 className="text-brand-text font-semibold mb-1">Order Tonight</h4>
                  <p className="text-brand-muted text-sm">Open 4PM – 12:40AM (Tuesday closed). Delivery from £{BRAND.delivery.fee.toFixed(2)}. Free over £{BRAND.delivery.freeOver}.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
