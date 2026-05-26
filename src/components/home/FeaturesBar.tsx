'use client'

const ITEMS = [
  { label: 'Clay Oven Fired' },
  { label: 'Fresh Every Day' },
  { label: 'Burnley Delivery' },
  { label: '4.9 Star Rated' },
  { label: '100% Halal' },
  { label: 'Authentic Charcoal' },
  { label: '30–45 Min Delivery' },
  { label: 'Stone Baked Pizza' },
  { label: 'Real Shawarma' },
  { label: "Burnley's Best" },
]

const TRACK = [...ITEMS, ...ITEMS]

export function FeaturesBar() {
  return (
    <div className="relative overflow-hidden py-[14px] select-none"
      style={{
        background: 'var(--color-brand-surface)',
        borderTop: '1px solid var(--color-brand-border)',
        borderBottom: '1px solid var(--color-brand-border)',
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-brand-surface), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--color-brand-surface), transparent)' }} />

      <div className="ticker-track gap-0">
        {TRACK.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'var(--color-brand-gold)', opacity: 0.5 }} />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase whitespace-nowrap text-brand-muted">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
