'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, ShoppingCart, Sparkles, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/store/cartStore'
import { triggerPWAInstall } from '@/components/common/PWAInstallPrompt'

export function BottomTabBar() {
  const pathname = usePathname()
  const { setOpen: setCartOpen, itemCount } = useCart()
  const count = itemCount()

  const tabs = [
    { type: 'link', href: '/', label: 'Home', icon: Home },
    { type: 'link', href: '/menu', label: 'Menu', icon: Utensils, isCenter: true },
    { type: 'button', onClick: () => setCartOpen(true), label: 'Cart', icon: ShoppingCart, hasBadge: true },
    { type: 'button', onClick: () => triggerPWAInstall(), label: 'App', icon: Sparkles },
    { type: 'link', href: '/account', label: 'Account', icon: User },
  ]

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-brand-border/40 backdrop-blur-xl shadow-2xl transition-all duration-300"
      style={{ 
        background: 'color-mix(in srgb, var(--color-brand-bg) 88%, transparent)',
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Tab bar container */}
      <div className="flex items-center justify-around px-2 py-2.5 pb-safe-bottom">
        {tabs.map((tab, idx) => {
          const isLink = tab.type === 'link'
          const isActive = isLink && tab.href === pathname
          const TabIcon = tab.icon

          // Render active tab sliding pill background
          const activePill = isActive && (
            <motion.span
              layoutId="bottom-tab-active-pill"
              className="absolute inset-0 rounded-2xl bg-brand-gold/10 border border-brand-gold/20"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )

          // Inner content wrapper
          const content = (
            <div className="relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200">
              {activePill}
              
              {/* Icon wrapper */}
              <div className="relative z-10">
                <TabIcon 
                  className={cn(
                    "w-5.5 h-5.5 transition-all duration-300",
                    isActive ? "text-brand-gold scale-110" : "text-brand-muted group-hover:text-brand-text"
                  )}
                  style={tab.isCenter ? { 
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(212,164,74,0.4))' : 'none' 
                  } : undefined}
                />
                
                {/* Live Count Badge for Cart */}
                {tab.hasBadge && count > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-fire text-[9px] font-bold text-white shadow-lg shadow-brand-fire/20 border border-brand-bg"
                  >
                    {count}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span className={cn(
                "relative z-10 text-[10px] font-semibold tracking-wide mt-1 transition-colors duration-200",
                isActive ? "text-brand-gold" : "text-brand-dim"
              )}>
                {tab.label}
              </span>

              {/* Gold dot below active tab */}
              {isActive && (
                <motion.div 
                  layoutId="bottom-tab-active-dot"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-gold z-10"
                />
              )}
            </div>
          )

          if (isLink) {
            return (
              <Link
                key={tab.href}
                href={tab.href!}
                className={cn(
                  "group relative flex-1 flex flex-col items-center justify-center",
                  tab.isCenter && "scale-105"
                )}
                aria-label={tab.label}
              >
                {content}
              </Link>
            )
          } else {
            return (
              <button
                key={tab.label}
                onClick={tab.onClick}
                className="group relative flex-1 flex flex-col items-center justify-center focus:outline-none"
                aria-label={tab.label}
              >
                {content}
              </button>
            )
          }
        })}
      </div>
    </nav>
  )
}
