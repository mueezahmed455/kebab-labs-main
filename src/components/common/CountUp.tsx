'use client'
import { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  to: number
  duration?: number
  suffix?: string
  decimals?: number
  className?: string
}

export function CountUp({ to, duration = 1.8, suffix = '', decimals = 0, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  useEffect(() => {
    if (!isInView || started.current || !ref.current) return
    started.current = true

    const startTime = performance.now()
    const ms = duration * 1000

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / ms, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      const value = (eased * to).toFixed(decimals)
      if (ref.current) ref.current.textContent = value + suffix
      if (t < 1) requestAnimationFrame(tick)
      else if (ref.current) ref.current.textContent = to.toFixed(decimals) + suffix
    }

    requestAnimationFrame(tick)
  }, [isInView, to, duration, suffix, decimals])

  return (
    <span ref={ref} className={className}>
      {to.toFixed(decimals)}{suffix}
    </span>
  )
}
