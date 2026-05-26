'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Contact', 'Delivery', 'Payment']

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto mb-10">
      {STEPS.map((label, idx) => {
        const step = idx + 1
        const isComplete = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                  isComplete ? 'bg-brand-green border-brand-green' :
                  isActive   ? 'border-brand-green bg-brand-green/10' :
                               'border-brand-border bg-brand-card'
                )}
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-brand-dark" />
                ) : (
                  <span className={cn('text-sm font-bold', isActive ? 'text-brand-green' : 'text-brand-dim')}>
                    {step}
                  </span>
                )}
              </div>
              <span className={cn('text-xs mt-1 font-medium', isActive ? 'text-brand-green' : 'text-brand-dim')}>
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-brand-border overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-brand-green"
                  initial={{ width: '0%' }}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
