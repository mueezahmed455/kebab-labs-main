import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { OrderStatusBadge, type OrderStatus } from '@/components/order/OrderStatusBadge'
import { Package, ChevronRight } from 'lucide-react'

interface OrderCardProps {
  order: {
    id: string
    order_number: string
    created_at: string
    status: OrderStatus
    total: number
    order_type: 'delivery' | 'collection'
    order_items?: { name: string; quantity: number }[]
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.order_items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const preview = order.order_items?.slice(0, 2).map((i) => i.name).join(', ') ?? ''
  const more = (order.order_items?.length ?? 0) > 2 ? ` +${(order.order_items?.length ?? 0) - 2} more` : ''

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-2xl p-4 hover:border-brand-green/30 transition-colors group"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-brand-green" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-display text-brand-white tracking-wider text-sm">{order.order_number}</span>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
        <p className="text-brand-muted text-xs truncate">{preview}{more}</p>
        <p className="text-brand-dim text-xs mt-0.5">
          {formatDate(order.created_at)} · {itemCount} {itemCount === 1 ? 'item' : 'items'} · {order.order_type}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-display text-brand-green text-lg tracking-wider">{formatCurrency(order.total)}</span>
        <ChevronRight className="w-4 h-4 text-brand-dim group-hover:text-brand-green transition-colors" />
      </div>
    </Link>
  )
}
