'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import { PageTransition } from '@/components/common/PageTransition'
import { cn } from '@/lib/utils'

interface FAQItem {
  q: string
  a: string
}

export function FAQContent({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = items.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageTransition>
      <section className="min-h-screen bg-brand-bg relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,149,58,0.04),transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <p className="text-brand-gold text-[10px] font-semibold uppercase mb-4 tracking-[0.4em]">
              Help Centre
            </p>
            <h1 className="font-display italic text-5xl md:text-7xl text-brand-text tracking-tight leading-none mb-4">
              Frequently Asked{' '}
              <span className="text-gradient-gold">Questions</span>
            </h1>
            <p className="text-brand-muted text-sm mt-4 max-w-lg mx-auto">
              Everything you need to know about ordering from The Kebab Lab.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-brand-card border border-brand-border text-brand-text text-sm placeholder:text-brand-dim focus:outline-none focus:border-brand-gold/40 transition-colors"
            />
          </motion.div>

          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={cn(
                    'w-full text-left p-5 rounded-xl border transition-all duration-200',
                    openIndex === i
                      ? 'bg-brand-card border-brand-gold/20'
                      : 'bg-brand-surface border-brand-border hover:border-brand-gold/10'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-text font-medium text-sm leading-snug">
                        {item.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-brand-dim flex-shrink-0 transition-transform duration-200',
                        openIndex === i && 'rotate-180'
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-muted text-sm leading-relaxed mt-3 ml-7">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-brand-dim text-sm text-center py-10">
                No matching questions found.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
