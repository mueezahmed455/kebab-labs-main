'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import anime from 'animejs'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowRight, Star, Clock, ShieldCheck, MapPin } from 'lucide-react'
import { FoodParticles } from '@/components/common/FoodParticles'
import { BLUR_PLACEHOLDER } from '@/lib/utils/blur'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

// Anime.js animations
const heroAnimations = {
  init: () => {
    // Animate text elements with staggered delays
    anime.timeline({})
      .add({
        targets: '.hero-text-span',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(150)
      })
      .add({
        targets: '.hero-badge',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutExpo'
      }, '-=600')
      .add({
        targets: '.hero-line',
        width: [0, '100%'],
        duration: 1200,
        easing: 'easeOutExpo'
      }, '-=800')
      .add({
        targets: '.hero-tagline',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo'
      }, '-=600')
      .add({
        targets: '.hero-cta',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo'
      }, '-=400')
      .add({
        targets: '.hero-stats',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo'
      }, '-=600');
  }
};

const cV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}
const sV: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.88, ease: EASE } },
}

const STEAM = [
  { left: '14%', delay: '0s',   dur: '4.1s' },
  { left: '29%', delay: '1.3s', dur: '3.7s' },
  { left: '50%', delay: '0.7s', dur: '4.6s' },
  { left: '67%', delay: '2.1s', dur: '3.9s' },
  { left: '83%', delay: '1s',   dur: '4.3s' },
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

  // Initialize anime.js animations on mount
  useEffect(() => {
    heroAnimations.init()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden" style={{ background: '#070402' }}>

      {/* ── Ambient atmosphere ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Fire glow – left */}
        <div className="absolute -left-40 top-[15%] w-[800px] h-[800px] rounded-full blur-[260px]"
          style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.09) 0%, transparent 70%)' }} />
        {/* Gold shimmer – centre */}
        <div className="absolute left-[30%] top-[50%] w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ background: 'radial-gradient(circle, rgba(201,149,58,0.04) 0%, transparent 70%)' }} />
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '256px 256px',
          }} />
      </div>

      {/* ── Food image – desktop right panel ─────────── */}
      <motion.div
          style={{ y: imageY, opacity, clipPath: 'polygon(11% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        className="absolute top-0 right-0 bottom-0 w-[52vw] hidden lg:block"
      >
        <Image
          src="https://cdn.pixabay.com/photo/2017/08/28/19/56/shish-kebab-2692018_1280.jpg"
          alt="Charcoal-grilled kebab skewers over glowing coals"
          fill
          sizes="52vw"
          className="object-cover object-center"
          priority
        />
        {/* Left edge gradient (merges into dark bg) */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #070402 0%, rgba(7,4,2,0.75) 12%, rgba(7,4,2,0.25) 30%, transparent 52%)' }} />
        {/* Bottom gradient */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,4,2,0.92) 0%, rgba(7,4,2,0.08) 28%, transparent 50%)' }} />
        {/* Fire glow from coals */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 92%, rgba(201,77,21,0.22) 0%, transparent 52%)' }} />

        {/* Steam wisps */}
        {STEAM.map((s, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            left: s.left, bottom: '32%', width: 2, height: 28, borderRadius: 99,
            background: 'linear-gradient(to top, rgba(255,255,255,0.18), transparent)',
            animationName: 'steam-rise', animationDuration: s.dur,
            animationDelay: s.delay, animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
          }} />
        ))}

        {/* Location badge – bottom of image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
          className="absolute bottom-8 right-8 z-10 px-4 py-3 rounded-xl"
          style={{
            backdropFilter: 'blur(14px)',
            background: 'rgba(10,5,0,0.78)',
            border: '1px solid rgba(201,149,58,0.18)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#c9953a' }} />
            <span className="text-[11px] font-semibold text-brand-text">123 Colne Road, Burnley</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" fill={i <= 4 ? '#c9953a' : 'rgba(201,149,58,0.3)'}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="ml-1 text-[10px] font-bold" style={{ color: '#c9953a' }}>4.3</span>
            <span className="text-[10px] text-brand-dim">&middot; 500+ reviews</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Text content ─────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex row: bio text + food particle column side-by-side */}
        <div className="flex items-center gap-6 lg:gap-10">
        <motion.div
          style={{ y: textY }}
          className="flex-1 lg:max-w-[52%] min-h-screen flex flex-col justify-center pt-28 pb-20 lg:pt-0 lg:pb-0"
        >
          <motion.div variants={cV} initial="hidden" animate="visible" className="flex flex-col">

             {/* Badge */}
             <motion.div variants={sV} className="mb-10 w-fit">
               <div className="hero-badge flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                 style={{
                   border: '1px solid rgba(201,149,58,0.22)',
                   background: 'rgba(201,149,58,0.05)',
                   backdropFilter: 'blur(10px)',
                 }}>
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inset-0 rounded-full opacity-65"
                    style={{ background: '#c9953a' }} />
                  <span className="relative rounded-full h-2 w-2" style={{ background: '#c9953a' }} />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.24em] uppercase"
                  style={{ color: '#d4a44a' }}>
                  Clay Oven Specialist &middot; Burnley
                </span>
              </div>
            </motion.div>

             {/* Headline */}
             <motion.h1 variants={sV} className="mb-8 leading-none">
               {/* "The" */}
               <span className="hero-text-span block font-display italic tracking-tight"
                 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'var(--color-brand-text)' }}>
                 The
               </span>
               {/* "Kebab" */}
               <span className="hero-text-span block font-display italic tracking-tight"
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
               {/* "Lab" */}
               <span className="hero-text-span block font-display italic tracking-tight"
                 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'var(--color-brand-text)' }}>
                 Lab
               </span>
             </motion.h1>

             {/* Animated gold rule */}
             <motion.div
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ delay: 0.65, duration: 1.1, ease: EASE }}
               className="hero-line w-16 h-[2px] mb-8"
               style={{
                 background: 'linear-gradient(to right, #c9953a 0%, rgba(201,149,58,0.15) 100%)',
                 transformOrigin: 'left center',
               }}
             />

             {/* Tagline */}
              <motion.p variants={sV}
                className="hero-tagline text-base lg:text-[17px] leading-relaxed max-w-[400px] mb-11"
               style={{ color: 'rgba(245,245,245,0.52)' }}
             >
               Burnley&apos;s most-rated clay oven kitchen. Charcoal-fired skewers,
               fresh sauces &amp; stone-baked pizzas — open 4PM till late, six nights a week.
             </motion.p>

             {/* CTAs */}
             <motion.div variants={sV} className="hero-cta flex flex-wrap items-center gap-5 mb-14">
              <Link
                href="/menu"
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-[13px] overflow-hidden transition-all duration-300 hover:scale-[1.025] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #c94d15 0%, #a83c0a 100%)',
                  color: '#fff',
                  boxShadow: '0 0 55px rgba(201,77,21,0.28), 0 10px 28px rgba(168,60,10,0.22)',
                }}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
                  style={{ background: 'rgba(255,255,255,0.09)' }} />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="currentColor"
                  style={{ animation: 'flame-flicker 2s ease-in-out infinite' }}>
                  <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
                </svg>
                <span className="relative z-10">Order Now</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/menu"
                className="flex items-center gap-2 text-[13px] font-medium transition-all duration-200 hover:gap-3"
                style={{
                  color: 'rgba(245,245,245,0.5)',
                  borderBottom: '1px solid rgba(245,245,245,0.13)',
                  paddingBottom: '2px',
                }}
              >
                Explore Menu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

             {/* Stats */}
             <motion.div
               variants={sV}
               className="hero-stats flex items-center gap-6 sm:gap-8 pt-8 flex-wrap"
               style={{ borderTop: '1px solid rgba(201,149,58,0.08)' }}
             >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 flex-shrink-0" style={{ color: '#c9953a' }} fill="#c9953a" />
                <div>
                  <div className="font-display italic text-xl leading-none" style={{ color: '#d4a44a' }}>4.3</div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">Avg Rating</div>
                </div>
              </div>
              <div className="w-px h-7 bg-brand-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#c9953a' }} />
                <div>
                  <div className="font-display italic text-xl leading-none" style={{ color: '#d4a44a' }}>
                    45<span className="text-sm font-sans font-normal">min</span>
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">Est. Delivery</div>
                </div>
              </div>
              <div className="w-px h-7 bg-brand-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: '#c9953a' }} />
                <div>
                  <div className="font-display italic text-xl leading-none" style={{ color: '#d4a44a' }}>100%</div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5 text-brand-dim">Halal Cert.</div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Food particle column – sits to the right of the bio text */}
        <motion.div
          style={{ y: textY }}
          className="hidden lg:flex items-center self-stretch"
        >
          <FoodParticles />
        </motion.div>

        </div>{/* end flex row */}
      </div>

      {/* ── Mobile food image ─────────────────────────── */}
      <div className="lg:hidden relative mx-4 mb-8 h-[280px] sm:h-[360px] rounded-[2rem] overflow-hidden">
        <Image
          src="https://cdn.pixabay.com/photo/2017/08/28/19/56/shish-kebab-2692018_1280.jpg"
          alt="Charcoal-grilled kebab"
          fill
          sizes="calc(100vw - 32px)"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,4,2,0.9) 0%, rgba(7,4,2,0.1) 45%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,77,21,0.24) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 rounded-[2rem]"
          style={{ border: '1px solid rgba(201,149,58,0.12)' }} />
      </div>

      {/* ── Bottom fade ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #070402, transparent)' }} />
    </section>
  )
}
