'use client'
import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   FoodParticles — decorative food column beside the hero bio.
   Renders pre-mounted JSX spans then animates them with Anime.js.
   On mobile (< 1024px) it is hidden. On desktop, each item has
   an independent looping bob + spin + pulse cycle. Loop animation
   count is capped to avoid GPU overload on mid-range hardware.
   ───────────────────────────────────────────────────────────── */

const ITEMS = [
  { emoji: '🥙', size: 44, row: 0  },
  { emoji: '🍔', size: 36, row: 1  },
  { emoji: '🍟', size: 34, row: 2  },
  { emoji: '🌯', size: 40, row: 3  },
  { emoji: '🍕', size: 36, row: 4  },
  { emoji: '🧆', size: 32, row: 5  },
  { emoji: '🌮', size: 36, row: 6  },
  { emoji: '🔥', size: 30, row: 7  },
  { emoji: '🍗', size: 34, row: 8  },
  { emoji: '🫔', size: 38, row: 9  },
]

export function FoodParticles() {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    // ── Performance check: skip animation on small/mid screens ──
    // The component is hidden via CSS on < 1024px but we also skip
    // the Anime.js boot-up to save CPU on resize edge cases.
    if (window.innerWidth < 1024) return

    let cancelled = false
    const animInstances: { pause: () => void }[] = []

    import('animejs').then((mod) => {
      if (cancelled) return
      const anime = (mod as unknown as { default: typeof import('animejs') }).default
      const items = Array.from(container.querySelectorAll<HTMLElement>('[data-fp]'))

      items.forEach((el, i) => {
        const baseDelay  = i * 180
        const bobAmp     = 10 + (i % 4) * 4        // 10–22 px vertical travel (reduced from 12–27)
        const bobDur     = 3000 + (i % 5) * 500    // 3.0–5.5 s (slowed slightly = less CPU)
        const spinDeg    = i % 2 === 0 ? 14 : -10  // narrower tilt range
        const scalePeak  = 1.08 + (i % 3) * 0.04  // 1.08 – 1.16 (reduced scale range)

        // ── Entrance fade-in ──────────────────────────────
        anime({
          targets: el,
          opacity:    [0, 1],
          translateY: [24, 0],
          scale:      [0.6, 1],
          easing:     'easeOutBack',
          duration:   600,
          delay:      baseDelay,
        })

        // ── Continuous float loop (bob + tilt + breathe) ─
        // Using a single combined animation instead of 3 separate
        // loops to save frames and reduce compositor load
        const anim = anime({
          targets: el,
          translateY: [
            { value: -bobAmp, duration: bobDur / 2, easing: 'easeInOutSine' },
            { value: 0,       duration: bobDur / 2, easing: 'easeInOutSine' },
          ],
          rotate: [
            { value: spinDeg,          duration: bobDur / 2, easing: 'easeInOutSine' },
            { value: spinDeg * -0.5,   duration: bobDur / 2, easing: 'easeInOutSine' },
          ],
          opacity: [
            { value: 0.9, duration: bobDur / 2 },
            { value: 0.55, duration: bobDur / 2 },
          ],
          scale: [
            { value: scalePeak, duration: bobDur / 2, easing: 'easeInOutSine' },
            { value: 0.94,      duration: bobDur / 2, easing: 'easeInOutSine' },
          ],
          loop:  true,
          delay: baseDelay + 600,
        })
        
        // Track instance to clean up on unmount
        if (anim && typeof (anim as any).pause === 'function') {
          animInstances.push(anim as any)
        }
      })
    })

    return () => {
      cancelled = true
      // Pause all running anime instances on cleanup
      animInstances.forEach(a => {
        try { a.pause() } catch { /* noop */ }
      })
    }
  }, [])

  return (
    <div
      ref={listRef}
      className="hidden lg:flex flex-col items-center justify-center gap-5 select-none"
      aria-hidden="true"
      style={{ minWidth: 60 }}
    >
      {ITEMS.map((item) => (
        <span
          key={item.row}
          data-fp
          style={{
            fontSize:      item.size,
            lineHeight:    1,
            opacity:       0,            /* anime.js fades these in */
            display:       'block',
            pointerEvents: 'none',
            willChange:    'transform, opacity',
            filter:        'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}
