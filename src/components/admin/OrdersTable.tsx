'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/formatting'
import { OrderStatusBadge, type OrderStatus } from '@/components/order/OrderStatusBadge'
import { ChevronDown } from 'lucide-react'

interface Order {
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

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          'confirmed',
  confirmed:        'preparing',
  preparing:        'ready',
  ready:            'out_for_delivery',
  out_for_delivery: 'delivered',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:          'Confirm',
  confirmed:        'Start Preparing',
  preparing:        'Mark Ready',
  ready:            'Out for Delivery',
  out_for_delivery: 'Mark Delivered',
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    setUpdating(order.id)
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error()
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: next } : o))
      toast.success(`Order ${order.order_number} → ${next.replace(/_/g, ' ')}`)
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const nextStatus = NEXT_STATUS[order.status]
        const isExpanded = expanded === order.id
        return (
          <div key={order.id} className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-brand-surface/50 transition-colors"
              onClick={() => setExpanded(isExpanded ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display text-brand-white text-sm tracking-wider">{order.order_number}</span>
                  <OrderStatusBadge status={order.status} size="sm" />
                  <span className="text-brand-dim text-xs">· {order.order_type}</span>
                </div>
                <p className="text-brand-muted text-xs">
                  {order.guest_name} · {formatDate(order.created_at)} {formatTime(order.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-brand-green text-lg tracking-wider">{formatCurrency(order.total)}</span>
                {nextStatus && (
                  <button
                    onClick={(e) => { e.stopPropagation(); advance(order) }}
                    disabled={updating === order.id}
                    className="px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold hover:bg-brand-green/20 transition-colors disabled:opacity-50"
                  >
                    {updating === order.id ? '...' : NEXT_LABEL[order.status]}
                  </button>
                )}
                <ChevronDown className={`w-4 h-4 text-brand-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-brand-border px-4 py-3 space-y-1.5">
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-brand-muted">{item.quantity}× {item.name}</span>
                    <span className="text-brand-white">{formatCurrency(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
                {order.guest_phone && (
                  <a href={`tel:${order.guest_phone}`} className="inline-flex items-center gap-1 text-brand-green text-xs hover:underline mt-2">
                    📞 {order.guest_phone}
                  </a>
                )}
              </div>
            )}
          </div>
        )
      })}

      {orders.length === 0 && (
        <div className="text-center py-16 text-brand-muted">No orders found.</div>
      )}
    </div>
  )
}
