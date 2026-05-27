'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Receipt, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/menu', label: 'Menu', icon: Utensils },
  { href: '/deals', label: 'Offers', icon: Receipt },
  { href: '/account', label: 'Account', icon: User },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border/50 backdrop-blur-sm"
      style={{ background: 'color-mix(in srgb, var(--color-brand-bg) 90%, transparent)' }}>
      <div className="flex px-4 py-3">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              pathname === tab.href ? 'text-brand-gold' : 'text-brand-muted'
            )}
          >
            <tab.icon className="w-5 h-5" 
              style={{ 
                color: pathname === tab.href ? 'var(--color-brand-gold)' : 'var(--color-brand-muted)' 
              }} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
