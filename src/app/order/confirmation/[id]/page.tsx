import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Mail, Clock, ChefHat } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatting'
import { BRAND } from '@/lib/data/brand'
import { ConfirmationAnimation } from './confirmation-animation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Order Confirmed — ${id}` }
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound()

  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, order_number, status, order_type, estimated_time, created_at, subtotal, delivery_fee, total, payment_method, customer_notes, delivery_line1, delivery_line2, delivery_city, delivery_postcode, guest_name, guest_email, order_items(*)')
    .or(`id.eq.${id},order_number.eq.${id}`)
    .single()

  if (error || !order) notFound()

  const items = (order.order_items ?? []) as Array<{
    name: string
    quantity: number
    total_price: number
    variant_label?: string | null
    notes?: string | null
  }>

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-lg mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted text-sm hover:text-brand-text mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Hero confirmation */}
        <div className="text-center mb-8">
          <ConfirmationAnimation />
          <h1 className="font-display text-5xl md:text-6xl text-brand-text tracking-wider mt-4">ORDER IN!</h1>
          <p className="text-brand-green font-display text-2xl tracking-wider mt-1">{order.order_number}</p>
          <p className="text-brand-muted text-sm mt-2 max-w-xs mx-auto">
            Your order is being processed. We&apos;ll send a confirmation to <strong className="text-brand-text">{order.guest_email}</strong>
          </p>
        </div>

        {/* Status badge + estimated time */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <OrderStatusBadge status={order.status as Parameters<typeof OrderStatusBadge>[0]['status']} />
          <div className="flex items-center gap-1.5 text-brand-muted text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>~{order.estimated_time} min</span>
          </div>
        </div>

        {/* Email sent indicator */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="flex items-center gap-2 bg-brand-green/5 border border-brand-green/20 rounded-full px-4 py-2">
            <Mail className="w-4 h-4 text-brand-green" />
            <span className="text-brand-text text-xs">Confirmation sent to {order.guest_email}</span>
          </div>
        </div>

        {/* Order summary card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
            <span className="text-brand-muted text-xs font-medium tracking-widest uppercase">Order Summary</span>
            <span className="text-brand-dim text-xs">{formatDate(order.created_at)} at {formatTime(order.created_at)}</span>
          </div>

          {/* Items */}
          <div className="px-5 py-3 divide-y divide-brand-border">
            {items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-brand-text text-sm font-medium">{item.quantity}× {item.name}</p>
                  {item.variant_label && (
                    <p className="text-brand-dim text-xs mt-0.5">{item.variant_label}</p>
                  )}
                  {item.notes && (
                    <p className="text-brand-dim text-xs mt-0.5 italic">Note: {item.notes}</p>
                  )}
                </div>
                <span className="text-brand-text text-sm font-semibold">{formatCurrency(item.total_price)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-5 py-4 border-t border-brand-border space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Subtotal</span>
              <span className="text-brand-text">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Delivery</span>
              <span className="text-brand-text">{order.delivery_fee > 0 ? formatCurrency(order.delivery_fee) : 'FREE'}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-brand-border">
              <span className="text-brand-text">Total</span>
              <span className="text-brand-gold">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-dim">Payment</span>
              <span className="text-brand-muted">{order.payment_method === 'card' ? '💳 Card' : '💰 Cash'}</span>
            </div>
          </div>

          {/* Delivery / Collection info */}
          <div className="px-5 py-4 border-t border-brand-border">
            {order.order_type === 'delivery' && order.delivery_line1 ? (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-widest">Delivering to</p>
                  <p className="text-brand-text text-sm">{order.delivery_line1}{order.delivery_line2 ? `, ${order.delivery_line2}` : ''}</p>
                  <p className="text-brand-dim text-sm">{order.delivery_city}, {order.delivery_postcode}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <ChefHat className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-muted text-xs uppercase tracking-widest">Collect from</p>
                  <p className="text-brand-text text-sm">{BRAND.address}</p>
                  <p className="text-brand-muted text-xs mt-1">Please bring your order reference</p>
                </div>
              </div>
            )}
          </div>

          {order.customer_notes && (
            <div className="px-5 py-3 border-t border-brand-border">
              <p className="text-brand-dim text-xs">📝 Note: {order.customer_notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Link
            href={`/track/${order.order_number}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-bg font-bold text-sm hover:brightness-110 transition-all"
          >
            Track Order Live
          </Link>
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-brand-border text-brand-muted text-sm hover:border-brand-green/30 hover:text-brand-text transition-colors"
          >
            <Phone className="w-4 h-4" /> Need help? Call {BRAND.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
