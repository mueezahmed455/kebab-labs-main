'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Alperhan R.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Great team, professional boss — amazing place to eat. The food was fresh, hot and very tasty with generous portions. Honestly the best kebab spot in Burnley.',
    item: 'Kebab Platter',
    source: 'Google',
  },
  {
    name: 'James T.',
    rating: 5,
    date: '1 month ago',
    text: 'Ordered the party kebab for 6 people — well worth the money, top quality taste, plenty of it. The owner is passionate about his quality and it really shows.',
    item: 'Sharing Platter',
    source: 'TripAdvisor',
  },
  {
    name: 'Fatima K.',
    rating: 5,
    date: '3 weeks ago',
    text: 'Food was delicious and hot with big portions — real value for money. Delivery was quick with a lovely friendly driver who followed the instructions perfectly.',
    item: 'Chicken Tikka',
    source: 'Google',
  },
  {
    name: 'Mohammed A.',
    rating: 5,
    date: '5 days ago',
    text: 'Tried the Asian Special pizza — properly different from anything else in Burnley. Clay oven makes a huge difference to the base. Ordered twice this week already.',
    item: 'Asian Special Pizza',
    source: 'Uber Eats',
  },
  {
    name: 'Sarah P.',
    rating: 5,
    date: '2 months ago',
    text: 'Visited with friends for the Mix Shawarma Platter and we were all blown away. Food comes out piping hot and the portions are very generous. Nice and friendly service too.',
    item: 'Mix Shawarma Platter',
    source: 'TripAdvisor',
  },
  {
    name: 'Imran H.',
    rating: 5,
    date: '1 week ago',
    text: 'The kobeda is unreal — proper spiced and cooked over charcoal. You can actually taste the difference. Halal certified, consistently excellent, and the cheesy bites are addictive.',
    item: 'Double Kobeda',
    source: 'Google',
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
              4.3 Stars · 500+ Reviews
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
                  <span className="text-[10px] text-brand-dim">{review.source} Review</span>
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
            <span>500+ happy customers</span>
          </div>
          <div className="w-px h-4 bg-brand-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Stars />
            <span>4.3 average rating</span>
          </div>
          <div className="w-px h-4 bg-brand-border hidden sm:block" />
          <span>Google · Uber Eats · TripAdvisor</span>
        </motion.div>
      </div>
    </section>
  )
}
