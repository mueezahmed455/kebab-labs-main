'use client'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

export function QuickOrderFAB() {
  return (
    <Link
      href="/menu"
      className="fixed bottom-24 left-4 z-30 md:bottom-8 md:left-8 group"
      aria-label="Quick order"
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-green text-white font-semibold text-sm shadow-lg shadow-brand-green/30 border border-white/10"
      >
        <Flame className="w-4 h-4 group-hover:animate-pulse" />
        <span className="hidden sm:inline">Order Now</span>
      </motion.div>
    </Link>
  )
}
