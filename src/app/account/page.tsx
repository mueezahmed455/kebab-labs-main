'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, MapPin, LogOut, ChevronRight, FlaskConical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { OrderCard } from '@/components/order/OrderCard'
import type { OrderStatus } from '@/components/order/OrderStatusBadge'
import type { Metadata } from 'next'

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  status: OrderStatus
  total: number
  order_type: 'delivery' | 'collection'
  order_items: { name: string; quantity: number }[]
}

type Tab = 'orders' | 'profile'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<Tab>('orders')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setProfile({
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? null,
        phone: user.user_metadata?.phone ?? null,
        role: 'customer',
      })
      // Fetch orders
      supabase
        .from('orders')
        .select('id, order_number, created_at, status, total, order_type, order_items(name, quantity)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setOrders(data as Order[])
          setLoading(false)
        })
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-7 h-7 text-brand-green" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-brand-white tracking-wider">
              {profile?.full_name ? profile.full_name.toUpperCase() : 'MY ACCOUNT'}
            </h1>
            <p className="text-brand-muted text-sm">{profile?.email}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 mb-6">
          {([
            { key: 'orders', label: 'Order History', icon: Package },
            { key: 'profile', label: 'Profile',       icon: User },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? 'bg-brand-green text-brand-dark'
                  : 'text-brand-muted hover:text-brand-white'
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-brand-dim mx-auto mb-3" />
                <p className="text-brand-muted">No orders yet</p>
                <Link href="/menu" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-colors">
                  Order Now
                </Link>
              </div>
            ) : (
              orders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </motion.div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {[
              { icon: User,   label: 'Name',  value: profile?.full_name || 'Not set' },
              { icon: User,   label: 'Email', value: profile?.email      || 'Not set' },
              { icon: MapPin, label: 'Phone', value: profile?.phone      || 'Not set' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-brand-dim text-xs uppercase tracking-widest">{label}</p>
                  <p className="text-brand-white text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-700/30 text-red-400 text-sm font-medium hover:bg-red-900/20 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
