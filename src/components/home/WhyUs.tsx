'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FlaskConical, Flame, Leaf, Award, ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/data/brand'

const REASONS = [
  {
    icon: FlaskConical,
    title: 'The Lab Formula',
    desc: 'We treat every recipe like a scientific formula. Precise spice ratios, controlled cooking temperatures, and consistent technique — every single time.',
    color: '#c94d15',
  },
  {
    icon: Flame,
    title: 'Real Clay Oven Cooking',
    desc: 'Not a gas grill. Not a flat-top. A genuine clay oven. The intense, dry heat creates a char and smoke infusion you simply cannot replicate any other way.',
    color: '#b81c1c',
  },
  {
    icon: Leaf,
    title: 'Fresh Every Day',
    desc: 'Meats marinated fresh daily. Salads prepared to order. We never use frozen shortcuts — if we run out, we run out.',
    color: '#0f9b5e',
  },
  {
    icon: Award,
    title: "Burnley's Best Since Day One",
    desc: 'Trusted by hundreds of local families. 4.3★ average across 500+ reviews. FHRS 5 food hygiene. We earned our reputation one kebab at a time.',
    color: '#c9953a',
  },
]

const STATS = [
  { value: '4.3★', label: 'Avg Rating',       color: '#c9953a' },
  { value: '6',    label: 'Days Open',         color: '#c94d15' },
  { value: '3mi',  label: 'Delivery Radius',   color: '#b81c1c' },
  { value: '500+', label: 'Happy Customers',   color: '#c9953a' },
]

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

export function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-brand-bg">
      {/* Parallax glow */}
      <motion.div style={{ y: bgY, background: 'linear-gradient(to top, var(--color-brand-glow), transparent)' }}
        className="absolute bottom-0 left-0 w-full h-[500px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left — Reasons */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <h2 className="font-display italic leading-[0.9] tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
                <span className="text-brand-text">Why people</span>
                <br />
                <span className="text-gradient-fire">keep coming back</span>
              </h2>
              <p className="text-brand-muted text-base leading-relaxed mb-12 max-w-sm">
                We cook with a real clay oven, fresh ingredients daily, and obsess over every detail.
              </p>
            </motion.div>

            <div className="space-y-8">
              {REASONS.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeInLeft}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-base mb-1 text-brand-text">{title}</h3>
                    <p className="text-sm leading-relaxed max-w-md text-brand-muted">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Stats & CTA */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label, color }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={scaleIn}
                  className="relative group p-7 rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--color-brand-card)',
                    border: '1px solid var(--color-brand-border)',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${color}08, transparent 70%)` }} />
                  <div className="relative z-10 text-center">
                    <div className="font-display italic text-3xl md:text-4xl mb-1 tracking-tighter" style={{ color }}>
                      {value}
                    </div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-dim">{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="relative p-8 md:p-10 rounded-2xl overflow-hidden group"
              style={{
                background: 'var(--color-brand-card)',
                border: '1px solid rgba(201,77,21,0.2)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(201,77,21,0.06), transparent 55%)' }} />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #c94d15, #a83c0a)',
                    boxShadow: '0 0 24px rgba(201,77,21,0.2)',
                  }}>
                  <Flame className="w-7 h-7 text-white" style={{ animation: 'flame-flicker 2s ease-in-out infinite' }} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-display italic text-2xl leading-none mb-1.5 tracking-tight text-brand-text">
                    Order Tonight
                  </h4>
                  <p className="text-sm leading-relaxed mb-3 text-brand-muted">
                    Open 4PM &ndash; 12:40AM. Delivery from &pound;{BRAND.delivery.fee.toFixed(2)}.
                    Burnley&apos;s finest, delivered to your door.
                  </p>
                  <Link href="/menu"
                    className="inline-flex items-center gap-2 font-medium text-xs uppercase tracking-widest text-brand-gold hover:text-brand-gold-light transition-colors">
                    Start Your Order <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
