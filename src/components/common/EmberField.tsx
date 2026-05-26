'use client'

/* Fixed ember positions — no Math.random() so hydration is safe */
const EMBERS = [
  { left: '4%',  delay: '0s',    dur: '4.2s', size: 3, color: '#c94d15' },
  { left: '9%',  delay: '2.1s',  dur: '3.6s', size: 2, color: '#e0b05a' },
  { left: '15%', delay: '0.7s',  dur: '5.1s', size: 4, color: '#b81c1c' },
  { left: '21%', delay: '3.4s',  dur: '3.8s', size: 2, color: '#c94d15' },
  { left: '27%', delay: '1.3s',  dur: '4.7s', size: 3, color: '#e0b05a' },
  { left: '33%', delay: '0.4s',  dur: '3.3s', size: 2, color: '#c94d15' },
  { left: '39%', delay: '2.8s',  dur: '5.4s', size: 4, color: '#e0b05a' },
  { left: '44%', delay: '1.0s',  dur: '3.9s', size: 2, color: '#b81c1c' },
  { left: '50%', delay: '4.2s',  dur: '4.4s', size: 3, color: '#c94d15' },
  { left: '56%', delay: '0.6s',  dur: '3.7s', size: 2, color: '#e0b05a' },
  { left: '62%', delay: '2.5s',  dur: '5.0s', size: 4, color: '#c94d15' },
  { left: '67%', delay: '1.7s',  dur: '3.5s', size: 2, color: '#b81c1c' },
  { left: '73%', delay: '3.1s',  dur: '4.6s', size: 3, color: '#e0b05a' },
  { left: '79%', delay: '0.3s',  dur: '4.1s', size: 2, color: '#c94d15' },
  { left: '84%', delay: '1.9s',  dur: '5.2s', size: 3, color: '#e0b05a' },
  { left: '90%', delay: '0.8s',  dur: '3.4s', size: 4, color: '#c94d15' },
  { left: '95%', delay: '2.6s',  dur: '4.8s', size: 2, color: '#b81c1c' },
  { left: '11%', delay: '4.5s',  dur: '4.3s', size: 2, color: '#e0b05a' },
  { left: '48%', delay: '3.7s',  dur: '3.6s', size: 3, color: '#c94d15' },
  { left: '72%', delay: '1.1s',  dur: '5.5s', size: 2, color: '#e0b05a' },
]

export function EmberField({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[15%] rounded-full"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 3}px ${e.color}, 0 0 ${e.size}px ${e.color}`,
            animationName: 'ember-float',
            animationDuration: e.dur,
            animationDelay: e.delay,
            animationTimingFunction: 'ease-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  )
}
