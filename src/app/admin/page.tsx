import { PoundSterling, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { formatCurrency } from '@/lib/utils/formatting'
import type { Metadata } from 'next'
import type { OrderStatus } from '@/components/order/OrderStatusBadge'

export const metadata: Metadata = { title: 'Admin Dashboard' }
export const revalidate = 30

interface OrderRow {
  id: string
  order_number: string
  created_at: string
  status: OrderStatus
  total: number
  order_type: 'delivery' | 'collection'
  guest_name: string | null
  guest_phone: string | null
  order_items: { name: string; quantity: number; unit_price: number }[]
}

export default async function AdminDashboard() {
  const admin = await createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [todayRes, allRes, recentRes, weekRes] = await Promise.all([
    admin.from('orders').select('total').gte('created_at', today.toISOString()),
    admin.from('orders').select('total').not('status', 'eq', 'cancelled'),
    admin.from('orders').select('id, order_number, created_at, status, total, order_type, guest_name, guest_phone, order_items(name, quantity, unit_price)').order('created_at', { ascending: false }).limit(10),
    admin.from('orders').select('created_at, total').gte('created_at', sevenDaysAgo.toISOString()).not('status', 'eq', 'cancelled'),
  ])

  const todayRevenue = (todayRes.data ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0)
  const totalRevenue = (allRes.data ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0)
  const recentOrders = (recentRes.data ?? []) as OrderRow[]

  // Build 7-day chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en-GB', { weekday: 'short' })
    const value = (weekRes.data ?? [])
      .filter((o) => new Date(o.created_at).toDateString() === d.toDateString())
      .reduce((sum, o) => sum + (o.total ?? 0), 0)
    return { label, value }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider mb-1">DASHBOARD</h1>
        <p className="text-brand-muted text-sm">
          Today&apos;s revenue: <span className="text-brand-green font-semibold">{formatCurrency(todayRevenue)}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Today's Orders" value={todayRes.data?.length ?? 0} icon={ShoppingBag} accent="blue" />
        <StatsCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon={PoundSterling} accent="green" />
        <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={TrendingUp} accent="purple" sub="All time" />
        <StatsCard title="Total Orders" value={allRes.data?.length ?? 0} icon={Users} accent="orange" sub="All time" />
      </div>

      {/* Chart */}
      <RevenueChart data={chartData} />

      {/* Recent orders */}
      <div>
        <h2 className="font-display text-2xl text-brand-white tracking-wider mb-4">RECENT ORDERS</h2>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}
