'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowRight, MapPin, Star, Timer, ChefHat } from 'lucide-react'

const containerV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemV: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const revealV: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const STEAM = [
  { left: '12%', delay: '0s',    dur: '4s'   },
  { left: '28%', delay: '1.4s',  dur: '3.5s' },
  { left: '46%', delay: '0.7s',  dur: '4.6s' },
  { left: '63%', delay: '2.1s',  dur: '3.8s' },
  { left: '80%', delay: '1s',    dur: '4.2s' },
]

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-brand-bg">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-[20%] w-[900px] h-[900px] rounded-full blur-[250px] opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[200px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(184,28,28,0.04) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(201,149,58,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* Background image with parallax */}
      <motion.div
        style={{ y: imageY, opacity }}
        className="absolute top-0 right-0 bottom-0 hidden lg:block"
      >
        <div className="relative h-full w-full" style={{ width: '55vw' }}>
          <Image
            src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1400&auto=format&fit=crop&q=90"
            alt="Charcoal-grilled kebab skewers over open flame"
            fill
            sizes="55vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #070402 0%, rgba(7,4,2,0.55) 20%, rgba(7,4,2,0.15) 40%, transparent 55%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(7,4,2,0.92) 0%, rgba(7,4,2,0.1) 30%, transparent 55%)' }} />
          <div className="absolute inset-0 opacity-25"
            style={{ background: 'radial-gradient(ellipse at 40% 85%, rgba(201,77,21,0.35) 0%, transparent 55%)' }} />

          {STEAM.map((w, i) => (
            <div key={i} className="absolute pointer-events-none" style={{
              left: w.left, bottom: '28%', width: 2, height: 28,
              borderRadius: 99,
              background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)',
              animationName: 'steam-rise', animationDuration: w.dur,
              animationDelay: w.delay, animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-out',
            }} />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="absolute bottom-8 right-8 z-20 px-5 py-4 rounded-2xl glass-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,149,58,0.15)', border: '1px solid rgba(201,149,58,0.28)' }}>
                <MapPin className="w-4 h-4" style={{ color: '#c9953a' }} />
              </div>
              <div>
                <p className="font-medium text-sm text-brand-text">123 Colne Road, Burnley</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-dim">
                  Open Today &middot; 4PM &ndash; 12:40AM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#c9953a">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="ml-2 text-[11px] font-bold text-brand-gold">4.9</span>
              <span className="text-[10px] ml-1 text-brand-dim">&middot; 500+ reviews</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: textY }}
          className="lg:max-w-[50%] min-h-screen flex flex-col justify-center pt-28 pb-20 lg:pt-0 lg:pb-0"
        >
          <motion.div
            variants={containerV}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Pill badge */}
            <motion.div variants={itemV} className="mb-8 w-fit">
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                style={{
                  border: '1px solid rgba(201,149,58,0.25)',
                  background: 'rgba(201,149,58,0.06)',
                  backdropFilter: 'blur(12px)',
                }}>
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: '#c9953a' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#c9953a' }} />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-brand-gold">
                  Clay Oven Specialist &middot; Burnley
                </span>
              </div>
            </motion.div>

            {/* Headline - now using Playfair Display italic for elegance */}
            <motion.h1 variants={itemV} className="mb-7">
              <span className="block font-display italic leading-[0.85] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'var(--color-brand-text)' }}>
                The
              </span>
              <span className="block font-display italic leading-[0.85] tracking-tight"
                style={{
                  fontSize: 'clamp(4.5rem, 12vw, 9rem)',
                  background: 'linear-gradient(135deg, #c94d15 15%, #c9953a 55%, #e0b05a 85%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 40px rgba(201,77,21,0.2))',
                }}>
                Kebab
              </span>
              <span className="block font-display italic leading-[0.85] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'var(--color-brand-text)' }}>
                Lab
              </span>
            </motion.h1>

            {/* Decorative line */}
            <motion.div variants={revealV} className="w-16 h-[2px] mb-6"
              style={{ background: 'var(--color-brand-gold)' }} />

            {/* Tagline */}
            <motion.p variants={itemV}
              className="text-base lg:text-lg leading-relaxed max-w-md mb-10 text-brand-muted">
              Burnley&apos;s most-rated clay oven kitchen. Every skewer charcoal-fired,
              every sauce made fresh daily. Open 4PM till late, 6 days a week.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemV} className="flex flex-wrap gap-4 mb-12">
              <Link href="/menu"
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #c94d15, #a83c0a)',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(201,77,21,0.25), 0 8px 20px rgba(168,60,10,0.2)',
                }}>
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
                  style={{ background: 'rgba(255,255,255,0.12)' }} />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'flame-flicker 2s ease-in-out infinite' }}>
                  <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                </svg>
                <span className="relative z-10">Order Now</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/menu"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  border: '1px solid rgba(201,149,58,0.2)',
                  color: 'var(--color-brand-text)',
                  background: 'rgba(201,149,58,0.04)',
                  backdropFilter: 'blur(8px)',
                }}>
                Explore Menu
              </Link>
            </motion.div>

            {/* Stats - no emojis */}
            <motion.div variants={itemV}
              className="flex items-center gap-8 pt-8"
              style={{ borderTop: '1px solid rgba(201,149,58,0.1)' }}>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
                <div>
                  <div className="font-display text-xl leading-none text-brand-gold">
                    4.9
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">
                    Google Rating
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-brand-gold" />
                <div>
                  <div className="font-display text-xl leading-none text-brand-gold">
                    45<span className="text-sm">min</span>
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">
                    Est. Delivery
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-brand-gold" />
                <div>
                  <div className="font-display text-xl leading-none text-brand-gold">
                    100<span className="text-sm">+</span>
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">
                    Menu Items
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile food image */}
      <div className="lg:hidden relative mx-4 mb-8 h-[280px] sm:h-[360px] rounded-[2rem] overflow-hidden subtle-texture">
        <Image src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900&auto=format&fit=crop&q=90"
          alt="Charcoal-grilled kebab" fill sizes="calc(100vw - 32px)" className="object-cover" priority />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,4,2,0.85) 0%, rgba(7,4,2,0.1) 50%, transparent 75%)' }} />
        <div className="absolute inset-0" style={{ border: '1px solid rgba(201,149,58,0.15)', borderRadius: '2rem' }} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #070402, transparent)' }} />
    </section>
  )
}
