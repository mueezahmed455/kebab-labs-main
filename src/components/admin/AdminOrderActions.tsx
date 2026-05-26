'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { type OrderStatus } from '@/components/order/OrderStatusBadge'
import { XCircle } from 'lucide-react'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          'confirmed',
  confirmed:        'preparing',
  preparing:        'ready',
  ready:            'out_for_delivery',
  out_for_delivery: 'delivered',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:          'Confirm Order',
  confirmed:        'Start Preparing',
  preparing:        'Mark Ready',
  ready:            'Out for Delivery',
  out_for_delivery: 'Mark Delivered',
}

interface AdminOrderActionsProps {
  order: { id: string; order_number: string; status: OrderStatus }
}

export function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const nextStatus = NEXT_STATUS[order.status]

  const advance = async (status: OrderStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Order ${order.order_number} updated`)
      router.refresh()
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  if (!nextStatus && order.status !== 'cancelled') return null

  return (
    <div className="flex gap-3 flex-wrap">
      {nextStatus && (
        <button
          onClick={() => advance(nextStatus)}
          disabled={updating}
          className="px-5 py-2.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {updating ? 'Updating…' : NEXT_LABEL[order.status]}
        </button>
      )}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <button
          onClick={() => advance('cancelled')}
          disabled={updating}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-red-700/30 text-red-400 text-sm font-medium hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" /> Cancel Order
        </button>
      )}
    </div>
  )
}
