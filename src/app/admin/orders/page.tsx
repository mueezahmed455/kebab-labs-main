import { createAdminClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/OrdersTable'
import type { Metadata } from 'next'
import type { OrderStatus } from '@/components/order/OrderStatusBadge'

export const metadata: Metadata = { title: 'Orders — Admin' }
export const revalidate = 0

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

export default async function AdminOrdersPage() {
  const admin = await createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('id, order_number, created_at, status, total, order_type, guest_name, guest_phone, order_items(name, quantity, unit_price)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider">ALL ORDERS</h1>
        <p className="text-brand-muted text-sm mt-1">{orders?.length ?? 0} orders — updates every page refresh</p>
      </div>
      <OrdersTable orders={(orders ?? []) as OrderRow[]} />
    </div>
  )
}
