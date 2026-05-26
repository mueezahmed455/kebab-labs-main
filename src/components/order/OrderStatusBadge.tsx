import { cn } from '@/lib/utils'
import { Clock, CheckCircle, ChefHat, Package, Bike, Star, XCircle } from 'lucide-react'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  pending:          { label: 'Pending',        icon: Clock,       color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  confirmed:        { label: 'Confirmed',      icon: CheckCircle, color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30'   },
  preparing:        { label: 'Preparing',      icon: ChefHat,     color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  ready:            { label: 'Ready',          icon: Package,     color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/30' },
  out_for_delivery: { label: 'On Its Way',     icon: Bike,        color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  delivered:        { label: 'Delivered',      icon: Star,        color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/30' },
  cancelled:        { label: 'Cancelled',      icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/30'    },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md'
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        config.color, config.bg, config.border,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
