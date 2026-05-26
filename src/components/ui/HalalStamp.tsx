'use client'
import { motion } from 'framer-motion'

interface HalalStampProps {
  size?: number
  className?: string
}

export function HalalStamp({ size = 120, className = '' }: HalalStampProps) {
  const s = size
  const cx = s / 2
  const cy = s / 2

  const outerR  = s / 2 - 2.5
  const dotR    = outerR - 5
  const midR    = outerR - 9
  const fillR   = midR - 3

  /* Decorative ring dots */
  const DOT_COUNT = 32
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i * 360) / DOT_COUNT
    const rad   = (angle * Math.PI) / 180
    const x     = cx + dotR * Math.cos(rad - Math.PI / 2)
    const y     = cy + dotR * Math.sin(rad - Math.PI / 2)
    const big   = i % 4 === 0
    return { x, y, r: big ? 1.6 : 0.85, fill: big ? '#4ade80' : '#166534' }
  })

  /* 8-point star at cardinal / diagonal positions */
  const starPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180
    const r     = outerR - 2
    return { x: cx + r * Math.cos(angle - Math.PI / 2), y: cy + r * Math.sin(angle - Math.PI / 2) }
  })

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        filter:
          'drop-shadow(0 0 18px rgba(16,185,129,0.55)) drop-shadow(0 0 6px rgba(16,185,129,0.3)) drop-shadow(0 4px 14px rgba(0,0,0,0.6))',
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Certified Halal"
      >
        {/* Outer dark ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="#0a1f0e" stroke="#166534" strokeWidth={1.5} />

        {/* Decorative dot ring */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />
        ))}

        {/* Mid ring */}
        <circle cx={cx} cy={cy} r={midR} fill="none" stroke="#16a34a" strokeWidth={1} />

        {/* Inner green fill circle */}
        <circle cx={cx} cy={cy} r={fillR} fill="#14532d" />

        {/* Inner ring accent */}
        <circle
          cx={cx}
          cy={cy}
          r={fillR}
          fill="none"
          stroke="#4ade80"
          strokeWidth={0.8}
          opacity={0.6}
        />

        {/* Subtle radial gradient inside */}
        <defs>
          <radialGradient id={`hg-${s}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#166534" stopOpacity="1" />
            <stop offset="100%" stopColor="#052e16" stopOpacity="1" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={fillR} fill={`url(#hg-${s})`} />

        {/* Arabic حلال — large centrepiece */}
        <text
          x={cx}
          y={cy - s * 0.04}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={s * 0.26}
          fill="#4ade80"
          fontFamily="'Noto Naskh Arabic', 'Traditional Arabic', 'Arabic Typesetting', serif"
          fontWeight="bold"
          style={{ letterSpacing: '0.02em' }}
        >
          حلال
        </text>

        {/* HALAL in English below Arabic */}
        <text
          x={cx}
          y={cy + s * 0.22}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={s * 0.095}
          fill="#22c55e"
          fontFamily="sans-serif"
          fontWeight="900"
          style={{ letterSpacing: '0.22em' }}
        >
          HALAL
        </text>

        {/* CERTIFIED arcs around the mid ring — top */}
        <path
          id={`top-${s}`}
          d={`M ${cx - midR + 1} ${cy} A ${midR - 1} ${midR - 1} 0 0 1 ${cx + midR - 1} ${cy}`}
          fill="none"
        />
        <text
          fontSize={s * 0.082}
          fontFamily="sans-serif"
          fontWeight="800"
          fill="#4ade80"
          style={{ letterSpacing: '0.18em' }}
        >
          <textPath href={`#top-${s}`} startOffset="50%" textAnchor="middle">
            ✦ CERTIFIED ✦
          </textPath>
        </text>

        {/* QUALITY arcs — bottom */}
        <path
          id={`bot-${s}`}
          d={`M ${cx - midR + 3} ${cy + 1} A ${midR - 3} ${midR - 3} 0 0 0 ${cx + midR - 3} ${cy + 1}`}
          fill="none"
        />
        <text
          fontSize={s * 0.075}
          fontFamily="sans-serif"
          fontWeight="700"
          fill="#22c55e"
          style={{ letterSpacing: '0.12em' }}
        >
          <textPath href={`#bot-${s}`} startOffset="50%" textAnchor="middle">
            ✦ QUALITY ASSURED ✦
          </textPath>
        </text>

        {/* Gold star ornaments left & right of mid ring */}
        {[-1, 1].map((side) => {
          const sx = cx + side * (midR - 0.5)
          const sy = cy
          return (
            <g key={side} transform={`translate(${sx},${sy})`}>
              <polygon
                points="0,-3.5 0.8,-1.2 3.5,-1.2 1.4,0.8 2.2,3.5 0,2 -2.2,3.5 -1.4,0.8 -3.5,-1.2 -0.8,-1.2"
                fill="#c9953a"
                opacity={0.9}
                transform="scale(0.75)"
              />
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}
