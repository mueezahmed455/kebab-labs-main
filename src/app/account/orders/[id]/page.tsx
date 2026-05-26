'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, Phone, Clock, Receipt } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { OrderStatusBadge, type OrderStatus } from '@/components/order/OrderStatusBadge'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatting'

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
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  customer_notes: string | null
  estimated_time: number | null
  delivery_line1: string | null
  delivery_city: string | null
  delivery_postcode: string | null
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) { setNotFound(true); setLoading(false); return }
          setOrder(data as Order)
          setLoading(false)
        })
    })
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
        <Package className="w-12 h-12 text-brand-dim" />
        <p className="text-brand-muted">Order not found</p>
        <Link href="/account" className="text-brand-green text-sm hover:underline">Back to account</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <Link href="/account" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-green text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to account
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-4xl text-brand-white tracking-wider">{order.order_number}</h1>
              <p className="text-brand-muted text-sm mt-1">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Track link */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Link
              href={`/track/${order.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm font-medium hover:bg-brand-green/20 transition-colors mb-6"
            >
              <Clock className="w-4 h-4" /> Track your order
            </Link>
          )}

          {/* Order items */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-brand-green" />
              <h2 className="font-display text-lg text-brand-white tracking-wider">YOUR ORDER</h2>
            </div>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-brand-white text-sm font-medium">
                      {item.quantity}× {item.name}
                      {item.variant_label && <span className="text-brand-muted"> ({item.variant_label})</span>}
                    </p>
                    {item.notes && <p className="text-brand-dim text-xs mt-0.5 italic">{item.notes}</p>}
                  </div>
                  <span className="text-brand-white text-sm font-medium flex-shrink-0">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border mt-4 pt-4 space-y-1.5">
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Delivery fee</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between font-display text-xl text-brand-white tracking-wider pt-1 border-t border-brand-border">
                <span>TOTAL</span>
                <span className="text-brand-green">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          {order.order_type === 'delivery' && order.delivery_line1 && (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-brand-green" />
                <h2 className="font-display text-lg text-brand-white tracking-wider">DELIVERY TO</h2>
              </div>
              <p className="text-brand-white text-sm">{order.delivery_line1}</p>
              <p className="text-brand-muted text-sm">{order.delivery_city}, {order.delivery_postcode}</p>
            </div>
          )}

          {/* Notes */}
          {order.customer_notes && (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4">
              <p className="text-brand-dim text-xs uppercase tracking-widest mb-1">Notes</p>
              <p className="text-brand-white text-sm">{order.customer_notes}</p>
            </div>
          )}

          {/* Payment */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-brand-green" />
              <h2 className="font-display text-lg text-brand-white tracking-wider">PAYMENT</h2>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted capitalize">{order.payment_method}</span>
              <span className={order.payment_status === 'paid' ? 'text-brand-green' : 'text-yellow-400'}>
                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
