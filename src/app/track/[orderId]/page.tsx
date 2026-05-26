import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { OrderTracker } from '@/components/order/OrderTracker'
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatting'
import { BRAND } from '@/lib/data/brand'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ orderId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params
  return { title: `Tracking Order ${orderId}` }
}

export default async function TrackOrderPage({ params }: Props) {
  const { orderId } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound()

  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, order_number, status, order_type, estimated_time, created_at, total, delivery_line1, delivery_city, delivery_postcode, guest_name, guest_phone')
    .or(`id.eq.${orderId},order_number.eq.${orderId}`)
    .single()

  if (error || !order) notFound()

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-lg mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted text-sm hover:text-brand-text mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl text-brand-text tracking-wider">TRACKING</h1>
              <p className="text-brand-gold font-display text-xl tracking-wider mt-0.5">{order.order_number}</p>
            </div>
            <OrderStatusBadge status={order.status as Parameters<typeof OrderStatusBadge>[0]['status']} />
          </div>
          <p className="text-brand-dim text-xs mt-2">
            Placed {formatDate(order.created_at)} at {formatTime(order.created_at)}
          </p>
        </div>

        {/* Tracker */}
        <OrderTracker order={order as Parameters<typeof OrderTracker>[0]['order']} />

        {/* Order details */}
        <div className="mt-6 bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
          <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Order Details</p>

          {order.order_type === 'delivery' && order.delivery_line1 && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest">Delivery to</p>
                <p className="text-brand-text text-sm">{order.delivery_line1}, {order.delivery_city} {order.delivery_postcode}</p>
              </div>
            </div>
          )}

          {order.order_type === 'collection' && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest">Collect from</p>
                <p className="text-brand-text text-sm">{BRAND.address}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between border-t border-brand-border pt-3">
            <span className="text-brand-muted text-sm">Total paid</span>
            <span className="font-display text-brand-gold text-lg tracking-wider">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Contact */}
        <a
          href={`tel:${BRAND.phoneRaw}`}
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl border border-brand-border text-brand-muted text-sm hover:border-brand-gold/30 hover:text-brand-text transition-colors"
        >
          <Phone className="w-4 h-4" /> Call The Kebab Lab — {BRAND.phone}
        </a>
      </div>
    </div>
  )
}
