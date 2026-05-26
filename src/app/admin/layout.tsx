import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FlaskConical, LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart2, ChefHat } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag     },
  { href: '/admin/menu',      label: 'Menu',      icon: UtensilsCrossed },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2       },
  { href: '/kitchen',         label: 'Kitchen',   icon: ChefHat         },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-brand-navy border-r border-brand-border flex flex-col">
        <div className="p-5 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-brand-green" />
            <div>
              <div className="font-display text-sm text-brand-white tracking-wider">KEBAB LAB</div>
              <div className="text-[10px] text-brand-green tracking-widest uppercase">Admin</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-brand-muted hover:text-brand-white hover:bg-brand-surface transition-colors"
            >
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-brand-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-brand-dim hover:text-brand-muted transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
