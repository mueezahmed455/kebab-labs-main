'use client'
import { useId } from 'react'

interface KebabLabLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

export function KebabLabLogo({ size = 40, showWordmark = true, className = '' }: KebabLabLogoProps) {
  const uid = useId().replace(/:/g, 'x')
  const iw = Math.round(size * 0.72)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iw}
        height={size}
        viewBox="0 0 36 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}fg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c94d15" />
            <stop offset="100%" stopColor="#c9953a" />
          </linearGradient>
          <linearGradient id={`${uid}glass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9953a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c94d15" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={`${uid}flame`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#c9953a" />
            <stop offset="100%" stopColor="#c94d15" />
          </linearGradient>
          <filter id={`${uid}glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d="M14 1H22V15L34 44Q36 50 18 50Q0 50 2 44L14 15V1Z" fill={`url(#${uid}glass)`} />
        <path d="M14 1H22V15L34 44Q36 50 18 50Q0 50 2 44L14 15V1Z"
          stroke={`url(#${uid}fg)`} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        <rect x="11" y="0" width="14" height="2.5" rx="1.25" fill={`url(#${uid}fg)`} />

        <path d="M18 46C11 42 11 31 14.5 25C16 22 18 18 18 18C18 18 20 22 21.5 25C25 31 25 42 18 46Z"
          fill={`url(#${uid}flame)`} filter={`url(#${uid}glow)`} />
        <path d="M18 43C15 40 15 33 17 28C17.5 26 18 24 18 24C18 24 18.5 26 19 28C21 33 21 40 18 43Z"
          fill="#fde68a" opacity="0.5" />
        <path d="M11.5 17L7 36" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {showWordmark && (
        <div style={{ lineHeight: 1 }}>
          <div className="font-sans text-[10px] font-medium"
            style={{
              fontSize: size * 0.28,
              color: 'var(--color-brand-muted)',
              letterSpacing: '0.25em',
              lineHeight: 1.1,
            }}>
            THE KEBAB
          </div>
          <div className="font-display italic leading-none"
            style={{
              fontSize: size * 0.45,
              background: 'linear-gradient(120deg, #c94d15 20%, #c9953a 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              lineHeight: 0.9,
            }}>
            Lab
          </div>
        </div>
      )}
    </div>
  )
}
