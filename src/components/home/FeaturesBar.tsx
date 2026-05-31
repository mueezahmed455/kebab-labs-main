'use client'
import { Flame, ShieldCheck, Star, Clock, Truck, Award, Leaf, Zap } from 'lucide-react'

const STATS = [
  { icon: Flame,        label: 'Clay Oven Fired',   value: '100% Charcoal' },
  { icon: Star,         label: 'Google Rating',      value: '4.3★ · 500+ Reviews' },
  { icon: ShieldCheck,  label: 'Food Hygiene',       value: 'FHRS 5 Rating' },
  { icon: Award,        label: 'Halal Certified',    value: '100% Halal' },
  { icon: Truck,        label: 'Delivery',           value: 'From £1.99 · 45 min' },
  { icon: Clock,        label: 'Open',               value: '4PM – 12:40AM · 6 Days' },
  { icon: Leaf,         label: 'Fresh Daily',        value: 'No Frozen Shortcuts' },
  { icon: Zap,          label: 'Order Online',       value: 'Live Menu · Fast Checkout' },
]

/* Doubles the list so the seamless loop works */
const TICKER = [...STATS, ...STATS]

export function FeaturesBar() {
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(to right, var(--color-brand-bg) 0%, var(--color-brand-surface) 50%, var(--color-brand-bg) 100%)',
        borderTop:    '1px solid var(--color-brand-border)',
        borderBottom: '1px solid var(--color-brand-border)',
      }}
    >
      {/* Gold shimmer line at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,164,74,0.5), transparent)' }} />

      {/* Left / right gradient fades to mask loop seam */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-brand-bg), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--color-brand-bg), transparent)' }} />

      {/* Scrolling ticker */}
      <div className="ticker-track py-3.5" aria-hidden="true">
        {TICKER.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-7 flex-shrink-0"
          >
            {/* Divider dot */}
            {i > 0 && (
              <span className="w-1 h-1 rounded-full flex-shrink-0 mr-4 opacity-25"
                style={{ background: 'var(--color-brand-gold)' }} />
            )}

            {/* Icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(201,77,21,0.07)',
                border: '1px solid rgba(201,77,21,0.12)',
              }}
            >
              <s.icon className="w-3.5 h-3.5" style={{ color: 'var(--color-brand-fire)' }} />
            </div>

            <div className="whitespace-nowrap">
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-dim mr-2">
                {s.label}
              </span>
              <span className="text-[11px] font-bold text-brand-text">
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
