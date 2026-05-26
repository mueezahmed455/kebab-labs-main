'use client'
import { motion } from 'framer-motion'

export function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Green orb — top right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 800,
          height: 800,
          background: 'rgba(132, 204, 22, 0.06)',
          filter: 'blur(110px)',
          top: '-20%',
          right: '-15%',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blue orb — bottom left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background: 'rgba(59, 130, 246, 0.04)',
          filter: 'blur(110px)',
          bottom: '-10%',
          left: '-10%',
        }}
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -30, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Amber orb — centre */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'rgba(249, 115, 22, 0.035)',
          filter: 'blur(110px)',
          top: '40%',
          left: '40%',
        }}
        animate={{ x: [0, 20, -30, 0], y: [0, -15, 25, 0], scale: [1, 1.08, 0.94, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
    </div>
  )
}
