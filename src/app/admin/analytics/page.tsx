import { createAdminClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Admin' }
export const revalidate = 300

export default async function AdminAnalyticsPage() {
  const admin = await createAdminClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [ordersRes, itemsRes, reviewsRes] = await Promise.all([
    admin.from('orders').select('created_at, total, order_type').gte('created_at', thirtyDaysAgo.toISOString()).not('status', 'eq', 'cancelled'),
    admin.from('order_items').select('name, quantity').order('quantity', { ascending: false }).limit(10),
    admin.from('reviews').select('rating').eq('is_published', true),
  ])

  const orders = ordersRes.data ?? []
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const deliveryCount = orders.filter((o) => o.order_type === 'delivery').length
  const collectionCount = orders.length - deliveryCount

  const reviews = reviewsRes.data ?? []
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length : 0

  // 30-day chart
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const value = orders
      .filter((o) => new Date(o.created_at).toDateString() === d.toDateString())
      .reduce((sum, o) => sum + (o.total ?? 0), 0)
    return { label, value }
  })

  const popularItems = itemsRes.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider">ANALYTICS</h1>
        <p className="text-brand-muted text-sm mt-1">Last 30 days performance</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue (30d)" value={formatCurrency(totalRevenue)} icon={TrendingUp} accent="green" />
        <StatsCard title="Orders (30d)" value={orders.length} icon={ShoppingBag} accent="blue" />
        <StatsCard title="Avg Order Value" value={formatCurrency(avgOrderValue)} icon={Users} accent="orange" />
        <StatsCard title="Avg Rating" value={avgRating.toFixed(1)} icon={Star} accent="purple" sub={`${reviews.length} reviews`} />
      </div>

      <RevenueChart data={chartData} height={200} />

      <div className="grid grid-cols-2 gap-6">
        {/* Order type split */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <p className="text-brand-muted text-xs font-medium tracking-widest uppercase mb-4">Order Type Split</p>
          <div className="space-y-3">
            {[
              { label: 'Delivery', count: deliveryCount, color: 'bg-brand-green' },
              { label: 'Collection', count: collectionCount, color: 'bg-blue-400' },
            ].map(({ label, count, color }) => {
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-muted">{label}</span>
                    <span className="text-brand-white font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Popular items */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <p className="text-brand-muted text-xs font-medium tracking-widest uppercase mb-4">Top Items</p>
          <div className="space-y-2">
            {popularItems.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-brand-muted truncate">{item.name}</span>
                <span className="text-brand-green font-semibold ml-2">{item.quantity}</span>
              </div>
            ))}
            {popularItems.length === 0 && <p className="text-brand-dim text-xs">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
