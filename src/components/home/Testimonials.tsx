'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Sarah M.',
    text: 'Best kebabs in Burnley, hands down. The lamb shawarma is incredible — you can taste the charcoal. My family orders at least once a week!',
    rating: 5,
    role: 'Regular Customer',
  },
  {
    name: 'James T.',
    text: 'The mixed shawarma platter is unreal. Perfect for sharing (or not sharing, no judgement). Delivery is always fast and food arrives hot.',
    rating: 5,
    role: 'Verified Order',
  },
  {
    name: 'Priya K.',
    text: 'Finally, a place that does proper clay oven cooking. The kobeda is next level — juicy, spiced perfectly, and that char is everything.',
    rating: 5,
    role: 'Local Foodie',
  },
  {
    name: 'Dave R.',
    text: 'Tried the Kebab Lab Special pizza. 18-inch naan base loaded with kobeda, shawarma, donner… it should be illegal. 10/10.',
    rating: 5,
    role: 'Verified Order',
  },
  {
    name: 'Aisha H.',
    text: 'As a vegetarian I was worried, but their veg kebab options are brilliant. Finally a kebab shop that cares about quality for everyone.',
    rating: 5,
    role: 'Regular Customer',
  },
]

export function Testimonials() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(0)

  function next() {
    setDir(1)
    setIdx((i) => (i + 1) % REVIEWS.length)
  }
  function prev() {
    setDir(-1)
    setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)
  }

  const review = REVIEWS[idx]

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#070402' }}>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[100px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,149,58,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[100px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-semibold uppercase mb-4 tracking-[0.3em] text-brand-gold">
            Voices of Burnley
          </p>
          <h2 className="font-display italic leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}>
            <span className="text-brand-text">Lab </span>
            <span className="text-gradient-gold">Ratings</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={idx}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 50 : -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir > 0 ? -50 : 50, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[2rem] p-10 md:p-16 text-center overflow-hidden group"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,77,21,0.04), transparent 60%)' }} />

                <Quote className="w-10 h-10 mx-auto mb-8 transition-transform duration-500 group-hover:scale-110"
                  style={{ color: 'rgba(201,149,58,0.2)' }} />

                <p className="text-xl md:text-2xl leading-relaxed mb-10 font-normal italic text-brand-text">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-brand-gold"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(201,149,58,0.4))' }} />
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-lg tracking-tight text-brand-text">{review.name}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-dim">{review.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-14 lg:-left-20">
              <button onClick={prev}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all shadow-lg group active:scale-95"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                  color: 'var(--color-brand-dim)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(201,149,58,0.3)'
                  el.style.color = '#c9953a'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--color-brand-border)'
                  el.style.color = 'var(--color-brand-dim)'
                }}
                aria-label="Previous review">
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-14 lg:-right-20">
              <button onClick={next}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all shadow-lg group active:scale-95"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                  color: 'var(--color-brand-dim)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(201,149,58,0.3)'
                  el.style.color = '#c9953a'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--color-brand-border)'
                  el.style.color = 'var(--color-brand-dim)'
                }}
                aria-label="Next review">
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-12">
            {REVIEWS.map((_, i) => (
              <button key={i}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  background: i === idx ? '#c9953a' : 'var(--color-brand-border)',
                  width: i === idx ? '3rem' : '1rem',
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
