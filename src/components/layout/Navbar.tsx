'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, FlaskConical, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store/cartStore'
import { isOpenNow } from '@/lib/utils/isOpen'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/#deals', label: 'Deals' },
  { href: '/#about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
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
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass-nav shadow-lg shadow-black/30' : 'glass-nav'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-green/10 border border-brand-green/30 group-hover:bg-brand-green/20 transition-colors">
                <FlaskConical className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <div className="font-display text-xl leading-none text-brand-white tracking-wider">
                  THE KEBAB LAB
                </div>
                <div className="text-[10px] text-brand-green leading-none tracking-widest uppercase">
                  Clay Oven Specialist
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-brand-green',
                    pathname === link.href ? 'text-brand-green' : 'text-brand-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Open/closed badge */}
              <div
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                  open
                    ? 'bg-brand-green/10 text-brand-green border-brand-green/30'
                    : 'bg-red-900/20 text-red-400 border-red-700/30'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', open ? 'bg-brand-green pulse-dot' : 'bg-red-400')} />
                {open ? 'Open Now' : 'Closed'}
              </div>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/30 hover:bg-brand-green/20 transition-colors"
                aria-label={`Cart, ${count} items`}
              >
                <ShoppingCart className="w-5 h-5 text-brand-green" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-green text-brand-dark text-[11px] font-bold flex items-center justify-center"
                    >
                      {count > 9 ? '9+' : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-green/30 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-brand-surface border-l border-brand-border md:hidden flex flex-col pt-20 px-6 gap-2"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center py-3 text-base font-medium border-b border-brand-border transition-colors',
                    pathname === link.href ? 'text-brand-green' : 'text-brand-muted hover:text-brand-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6">
                <Link
                  href="/menu"
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-18" />
    </>
  )
}
