'use client'
import { Truck, Store } from 'lucide-react'
import { useCart } from '@/lib/store/cartStore'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/data/brand'

export function OrderTypeToggle() {
  const { orderType, setOrderType } = useCart()

  return (
    <div className="grid grid-cols-2 gap-2">
      {([
        { value: 'delivery',   icon: Truck,  label: 'Delivery',   sub: `${BRAND.delivery.estimatedMins} min` },
        { value: 'collection', icon: Store,  label: 'Collection', sub: `${BRAND.collection.estimatedMins} min` },
      ] as const).map(({ value, icon: Icon, label, sub }) => (
        <button
          key={value}
          onClick={() => setOrderType(value)}
          className={cn(
            'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-sm font-medium',
            orderType === value
              ? 'border-brand-green bg-brand-green/10 text-brand-green'
              : 'border-brand-border text-brand-muted hover:border-brand-green/30 hover:text-brand-white'
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          <span className="text-[10px] opacity-70">{sub}</span>
        </button>
      ))}
    </div>
  )
}
