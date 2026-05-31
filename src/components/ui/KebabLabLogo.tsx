'use client'

interface KebabLabLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

export function KebabLabLogo({ size = 40, showWordmark = true, className = '' }: KebabLabLogoProps) {
  const iw = Math.round(size * 0.72)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iw}
        height={size}
        viewBox="0 0 40 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Flask outline gradient */}
          <linearGradient id="kl-flask" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#d46b35" />
            <stop offset="100%" stopColor="#c9953a" />
          </linearGradient>
          {/* Flask glass fill */}
          <linearGradient id="kl-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(212,164,74,0.07)" />
            <stop offset="100%" stopColor="rgba(201,77,21,0.03)" />
          </linearGradient>
          {/* Outer flame */}
          <linearGradient id="kl-flame-outer" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#fff8a0" />
            <stop offset="30%"  stopColor="#ffb040" />
            <stop offset="70%"  stopColor="#e05520" />
            <stop offset="100%" stopColor="#c93810" />
          </linearGradient>
          {/* Inner flame core */}
          <linearGradient id="kl-flame-inner" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#fff5c0" />
            <stop offset="100%" stopColor="#ffe080" />
          </linearGradient>
          {/* Flame glow filter */}
          <filter id="kl-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flask body — glass fill */}
        <path
          d="M15,2 H25 L28,18 Q38,27 38,43 Q38,52 20,52 Q2,52 2,43 Q2,27 12,18 Z"
          fill="url(#kl-glass)"
        />

        {/* Flask body — outline */}
        <path
          d="M15,2 H25 L28,18 Q38,27 38,43 Q38,52 20,52 Q2,52 2,43 Q2,27 12,18 Z"
          stroke="url(#kl-flask)"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Neck rim (top lip) */}
        <line x1="13" y1="2" x2="27" y2="2" stroke="url(#kl-flask)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Measurement marks inside neck */}
        <line x1="17" y1="8"  x2="21" y2="8"  stroke="rgba(201,149,58,0.35)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="17" y1="13" x2="23" y2="13" stroke="rgba(201,149,58,0.25)" strokeWidth="0.8" strokeLinecap="round" />

        {/* Outer flame */}
        <path
          d="M20,50 C14,46 11.5,37 15,28 C17,23 19.5,19.5 20,19.5 C20.5,19.5 23,23 25,28 C28.5,37 26,46 20,50 Z"
          fill="url(#kl-flame-outer)"
          filter="url(#kl-glow)"
          opacity="0.92"
        />

        {/* Inner flame core */}
        <path
          d="M20,47 C17,44 16,39 18.5,32 C19.5,29 20,27 20,27 C20,27 20.5,29 21.5,32 C24,39 23,44 20,47 Z"
          fill="url(#kl-flame-inner)"
          opacity="0.85"
        />

        {/* Glass highlight (left side) */}
        <path
          d="M10,17 L7,30"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: size * 0.265,
              fontWeight: 600,
              color: 'var(--color-brand-muted)',
              letterSpacing: '0.24em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            The Kebab
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic',
              fontSize: size * 0.5,
              background: 'linear-gradient(120deg, #d46b35 15%, #c9953a 55%, #e0b05a 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.03em',
              lineHeight: 0.88,
            }}
          >
            Lab
          </div>
        </div>
      )}
    </div>
  )
}
