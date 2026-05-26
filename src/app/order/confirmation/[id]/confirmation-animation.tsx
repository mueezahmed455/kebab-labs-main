'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function ConfirmationAnimation() {
  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-green/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
        />
        <motion.div
          className="w-20 h-20 rounded-full bg-brand-green/10 border-2 border-brand-green flex items-center justify-center"
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Check className="w-8 h-8 text-brand-green" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
