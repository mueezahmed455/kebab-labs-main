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
    text: 'As a vegetarian I was worried, but their veg kebab and halloumi options are brilliant. Finally a kebab shop that cares about quality.',
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
    <section className="py-16 md:py-24 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">What Our Customers Say</p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-text tracking-wider">
            LAB RATINGS
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -80 : 80 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-brand-card border border-brand-border rounded-3xl p-8 md:p-10 text-center"
            >
              <Quote className="w-8 h-8 text-brand-green/30 mx-auto mb-4" />
              <p className="text-brand-text text-lg leading-relaxed mb-6 italic">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-green text-brand-green" />
                ))}
              </div>
              <p className="text-brand-text font-semibold">{review.name}</p>
              <p className="text-brand-dim text-sm">{review.role}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-border hover:border-brand-green/40 text-brand-muted hover:text-brand-text transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === idx ? 'bg-brand-green w-6' : 'bg-brand-border hover:bg-brand-muted'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-border hover:border-brand-green/40 text-brand-muted hover:text-brand-text transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
