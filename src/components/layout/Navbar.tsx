'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Moon, Sun, ShieldCheck, Sparkles } from 'lucide-react'
import { KebabLabLogo } from '@/components/ui/KebabLabLogo'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerPWAInstall } from '@/components/common/PWAInstallPrompt'
import { useCart } from '@/lib/store/cartStore'
import { isOpenNow } from '@/lib/utils/isOpen'
import { useTheme } from '@/lib/theme-provider'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/deals', label: 'Offers' },
  { href: '/about', label: 'Our Story' },
  { href: '/faq', label: 'FAQ' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, toggle: toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const { setOpen: setCartOpen, itemCount } = useCart()
  const count = itemCount()

  useEffect(() => {
    setOpen(isOpenNow())
    const interval = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-nav py-3'
            : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">
            
            {/* Logo */}
            <Link href="/" className="flex items-center group" aria-label="The Kebab Lab – Home">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <div className="sm:hidden">
                  <KebabLabLogo size={42} showWordmark={false} />
                </div>
                <div className="hidden sm:block">
                  <KebabLabLogo size={42} showWordmark={true} />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-[13px] font-medium tracking-wide transition-colors',
                    pathname === link.href ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-text'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-brand-gold"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Status */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={cn(
                  'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-semibold uppercase tracking-wider transition-colors',
                  open
                    ? 'border-brand-green/20 text-brand-green'
                    : 'border-red-500/20 text-red-400'
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  open ? 'bg-brand-green animate-pulse' : 'bg-red-400'
                )} />
                {open ? 'Accepting Orders' : 'Closed'}
              </motion.div>

              {/* Install App Trigger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => triggerPWAInstall()}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20 transition-all duration-200"
                aria-label="Install App"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">App</span>
              </motion.button>

              <div className="h-6 w-[1px] bg-brand-border/50 hidden md:block" />

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-surface/50 border border-brand-border hover:border-brand-gold/20 transition-colors"
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="w-4 h-4 text-brand-gold" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Moon className="w-4 h-4 text-brand-gold" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 hover:bg-brand-green/20 transition-colors"
                aria-label={`Cart, ${count} items`}
              >
                <ShoppingCart className="w-4 h-4 text-brand-green" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-gold text-brand-bg text-[9px] font-bold flex items-center justify-center"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/20 transition-colors"
              >
                {mobileOpen ? <X className="w-4 h-4 text-brand-text" /> : <Menu className="w-4 h-4 text-brand-text" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl lg:hidden"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-brand-bg border-l border-brand-border lg:hidden flex flex-col pt-24 px-8 gap-4 pb-[4.5rem]"
            >
              <div className="mb-8">
                <p className="text-brand-gold text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">Navigation</p>
                <div className="h-[1px] w-10 bg-brand-gold/30" />
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center py-5 text-2xl font-display italic tracking-wide transition-colors duration-200',
                    pathname === link.href ? 'text-brand-gold' : 'text-brand-text hover:text-brand-gold hover:bg-brand-surface/10'
                  )}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = 'color-mix(in srgb, var(--color-brand-surface) 10%, transparent)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = 'transparent'
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-auto mb-12 flex flex-col gap-4">
                <Link
                  href="/menu"
                  className="flex items-center justify-center w-full py-4 rounded-2xl bg-brand-fire text-white font-medium text-sm shadow-lg"
                >
                  Order Now
                </Link>
                <div className="flex items-center justify-center gap-3 text-brand-dim">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Premium Quality Assured</span>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={cn('transition-all duration-500', scrolled ? 'h-20' : 'h-[calc(24px+4.5rem)]')} />
    </>
  )
}
