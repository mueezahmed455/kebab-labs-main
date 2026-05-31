'use client'
import { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PROMOS = [
  'Free delivery on orders over £25!',
  'Try our new Kebab Lab Special — loaded with flavour!',
  'Mix Shawarma & Kobeda combo now £10',
]

export function PromoBanner() {
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROMOS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div className="relative w-full bg-brand-fire/10 border-b border-brand-fire/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 py-2.5">
          <Tag className="w-3.5 h-3.5 text-brand-fire shrink-0" />
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 text-xs font-semibold text-brand-fire text-center whitespace-nowrap"
              >
                {PROMOS[index]}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-fire/60 hover:text-brand-fire transition-colors"
            aria-label="Dismiss promo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
