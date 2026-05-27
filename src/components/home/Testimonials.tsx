'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Aisha R.',
    rating: 5,
    date: '2 weeks ago',
    text: "Honestly the best kebab I've had in Burnley. The lamb shawarma is something else — perfectly seasoned, falling apart tender. The naan was fresh and the chilli sauce has a proper kick to it. Won't be going anywhere else.",
    item: 'Lamb Shawarma',
  },
  {
    name: 'James T.',
    rating: 5,
    date: '1 month ago',
    text: 'Ordered the Kebab Lab Special for the family — absolutely loaded with kobeda, shish, donner, both shawarmas all on the same naan. The quality is consistent every single time. 10/10.',
    item: 'Kebab Lab Special',
  },
  {
    name: 'Fatima K.',
    rating: 5,
    date: '3 weeks ago',
    text: 'The chicken tikka shish is incredible — you can taste the charcoal. Everything comes out fresh, hot and generous. The online ordering is dead easy. Delivery was quicker than expected.',
    item: 'Chicken Tikka',
  },
  {
    name: 'Mohammed A.',
    rating: 5,
    date: '5 days ago',
    text: 'Tried the Asian Special pizza and it was properly different — not your typical takeaway pizza. Clay oven makes a real difference to the base. Ordered twice this week already.',
    item: 'Asian Special Pizza',
  },
  {
    name: 'Sarah P.',
    rating: 5,
    date: '2 months ago',
    text: 'Visited with friends for the sharing platter and we were all blown away. The food comes out piping hot and the portions are very generous. This is proper quality takeaway food.',
    item: 'Mix Shawarma Platter',
  },
  {
    name: 'Imran H.',
    rating: 5,
    date: '1 week ago',
    text: 'The kobeda is the best in town — proper spiced minced lamb cooked perfectly over coal. The cheesy kobeda bites are addictive. Halal certified and always consistent. A gem.',
    item: 'Double Kobeda',
  },
]

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#c9953a' }} />
      ))}
    </div>
  )
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-brand-bg">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[200px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, var(--color-brand-glow-gold) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              border: '1px solid rgba(201,149,58,0.2)',
              background: 'rgba(201,149,58,0.06)',
            }}
          >
            <Stars />
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: '#c9953a' }}>
              4.9 Stars · 200+ Reviews
            </span>
          </div>
          <h2
            className="font-display italic leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}
          >
            <span className="text-brand-text">What Burnley </span>
            <span className="text-gradient-gold">Is Saying</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.name}
              variants={cardAnim}
              className="group relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 cursor-default"
              style={{
                background: 'var(--color-brand-card)',
                border: '1px solid var(--color-brand-border)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(201,149,58,0.25)'
                el.style.boxShadow = '0 16px 40px -12px rgba(0,0,0,0.3)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--color-brand-border)'
                el.style.boxShadow = ''
              }}
            >
              <Quote className="w-6 h-6 opacity-15 flex-shrink-0" style={{ color: '#c9953a' }} />

              <p className="text-brand-muted text-sm leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: 'rgba(201,149,58,0.1)',
                      color: '#c9953a',
                      border: '1px solid rgba(201,149,58,0.18)',
                    }}
                  >
                    {review.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-brand-text text-sm font-medium leading-tight">{review.name}</p>
                    <p className="text-brand-dim text-xs">{review.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Stars count={review.rating} />
                  <span className="text-[10px] text-brand-dim">Google Review</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-brand-muted"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {['A', 'J', 'F', 'M'].map((l) => (
                <div
                  key={l}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                  style={{
                    background: 'rgba(201,149,58,0.1)',
                    color: '#c9953a',
                    borderColor: 'var(--color-brand-bg)',
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <span>200+ happy customers</span>
          </div>
          <div className="w-px h-4 bg-brand-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Stars />
            <span>4.9 average rating</span>
          </div>
          <div className="w-px h-4 bg-brand-border hidden sm:block" />
          <span>Verified Google Reviews</span>
        </motion.div>
      </div>
    </section>
  )
}
