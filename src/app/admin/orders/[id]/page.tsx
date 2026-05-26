import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { OrderStatusBadge, type OrderStatus } from '@/components/order/OrderStatusBadge'
import { AdminOrderActions } from '@/components/admin/AdminOrderActions'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatting'
import { ArrowLeft, MapPin, Phone, Receipt, User } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 0
export const metadata: Metadata = { title: 'Order Detail — Admin' }

interface Params { params: Promise<{ id: string }> }

interface OrderItem {
  id: string
  name: string
  variant_label: string | null
  quantity: number
  unit_price: number
  total_price: number
  notes: string | null
}

interface Order {
  id: string
  order_number: string
  created_at: string
  status: OrderStatus
  order_type: 'delivery' | 'collection'
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  customer_notes: string | null
  kitchen_notes: string | null
  estimated_time: number | null
  delivery_line1: string | null
  delivery_line2: string | null
  delivery_city: string | null
  delivery_postcode: string | null
  order_items: OrderItem[]
}

export default async function AdminOrderDetailPage({ params }: Params) {
  let admin
  try {
    admin = await createAdminClient()
  } catch {
    redirect('/login')
  }

  const { id } = await params
  const { data: order } = await admin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const o = order as unknown as Order

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-brand-muted hover:text-brand-green text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Orders
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl text-brand-white tracking-wider">{o.order_number}</h1>
          <p className="text-brand-muted text-sm mt-1">
            {formatDate(o.created_at)} at {formatTime(o.created_at)} · {o.order_type}
          </p>
        </div>
        <OrderStatusBadge status={o.status} />
      </div>

      {/* Status actions */}
      <AdminOrderActions order={{ id: o.id, order_number: o.order_number, status: o.status }} />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-brand-green" />
            <h2 className="font-display text-lg text-brand-white tracking-wider">CUSTOMER</h2>
          </div>
          <div className="space-y-1">
            <p className="text-brand-white text-sm font-medium">{o.guest_name ?? '—'}</p>
            {o.guest_email && <p className="text-brand-muted text-sm">{o.guest_email}</p>}
            {o.guest_phone && (
              <a href={`tel:${o.guest_phone}`} className="inline-flex items-center gap-1 text-brand-green text-sm hover:underline">
                <Phone className="w-3.5 h-3.5" />{o.guest_phone}
              </a>
            )}
          </div>
        </div>

        {/* Delivery */}
        {o.order_type === 'delivery' && (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-brand-green" />
              <h2 className="font-display text-lg text-brand-white tracking-wider">DELIVERY</h2>
            </div>
            <p className="text-brand-white text-sm">{o.delivery_line1}</p>
            {o.delivery_line2 && <p className="text-brand-white text-sm">{o.delivery_line2}</p>}
            <p className="text-brand-muted text-sm">{o.delivery_city}, {o.delivery_postcode}</p>
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4 text-brand-green" />
          <h2 className="font-display text-lg text-brand-white tracking-wider">ORDER ITEMS</h2>
        </div>
        <div className="space-y-3">
          {o.order_items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-brand-white text-sm font-medium">
                  {item.quantity}× {item.name}
                  {item.variant_label && <span className="text-brand-muted"> ({item.variant_label})</span>}
                </p>
                {item.notes && <p className="text-brand-dim text-xs italic mt-0.5">{item.notes}</p>}
              </div>
              <span className="text-brand-white text-sm flex-shrink-0">{formatCurrency(item.total_price)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-brand-border mt-4 pt-4 space-y-1.5">
          <div className="flex justify-between text-sm text-brand-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(o.subtotal)}</span>
          </div>
          {o.delivery_fee > 0 && (
            <div className="flex justify-between text-sm text-brand-muted">
              <span>Delivery fee</span>
              <span>{formatCurrency(o.delivery_fee)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-xl text-brand-white tracking-wider pt-1 border-t border-brand-border">
            <span>TOTAL</span>
            <span className="text-brand-green">{formatCurrency(o.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(o.customer_notes || o.kitchen_notes) && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
          {o.customer_notes && (
            <div>
              <p className="text-brand-dim text-xs uppercase tracking-widest mb-1">Customer Notes</p>
              <p className="text-brand-white text-sm">{o.customer_notes}</p>
            </div>
          )}
          {o.kitchen_notes && (
            <div>
              <p className="text-brand-dim text-xs uppercase tracking-widest mb-1">Kitchen Notes</p>
              <p className="text-brand-white text-sm">{o.kitchen_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Payment */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <h2 className="font-display text-lg text-brand-white tracking-wider mb-3">PAYMENT</h2>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted capitalize">{o.payment_method}</span>
          <span className={o.payment_status === 'paid' ? 'text-brand-green' : 'text-yellow-400'}>
            {o.payment_status === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  )
}
