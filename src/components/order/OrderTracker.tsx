'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ChefHat, Package, Bike, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'

const STEPS: { status: OrderStatus; label: string; sub: string; icon: React.ElementType }[] = [
  { status: 'pending',          label: 'Order Received',  sub: 'We have your order',             icon: Clock      },
  { status: 'confirmed',        label: 'Confirmed',        sub: 'Kitchen is on it',               icon: CheckCircle },
  { status: 'preparing',        label: 'Preparing',        sub: 'Being cooked fresh',             icon: ChefHat    },
  { status: 'ready',            label: 'Ready',            sub: 'Packed and waiting',             icon: Package    },
  { status: 'out_for_delivery', label: 'On Its Way',       sub: 'Driver heading to you',          icon: Bike       },
  { status: 'delivered',        label: 'Delivered',        sub: 'Enjoy your meal!',               icon: Star       },
]

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, preparing: 2, ready: 3, out_for_delivery: 4, delivered: 5, cancelled: -1,
}

interface TrackerOrder {
  id: string
  order_number: string
  status: OrderStatus
  order_type: 'delivery' | 'collection'
  estimated_time: number | null
  created_at: string
  total: number
}

interface OrderTrackerProps {
  order: TrackerOrder
}

export function OrderTracker({ order: initialOrder }: OrderTrackerProps) {
  const [order, setOrder] = useState<TrackerOrder>(initialOrder)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`order-${order.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${order.id}`,
      }, (payload) => {
        setOrder((prev) => ({ ...prev, ...payload.new }))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [order.id])

  const currentIdx = STATUS_INDEX[order.status] ?? 0
  const isDelivery = order.order_type === 'delivery'

  const steps = isDelivery ? STEPS : STEPS.filter((s) => s.status !== 'out_for_delivery')

  return (
    <div className="space-y-6">
      {/* Status steps */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <div className="relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const done = currentIdx >= STATUS_INDEX[step.status]
            const active = STATUS_INDEX[step.status] === currentIdx

            return (
              <div key={step.status} className="flex items-start gap-4 relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-8 bg-brand-border" />
                )}
                {done && idx < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-5 top-10 w-0.5 h-8 bg-gradient-to-b from-brand-gold to-brand-green origin-top"
                  />
                )}

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.4 }}
                  animate={{ scale: done ? 1 : 0.85, opacity: done ? 1 : 0.4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-brand-gold/20 border-brand-gold text-brand-gold' :
                    done   ? 'bg-brand-green/10 border-brand-green/40 text-brand-green' :
                             'bg-brand-surface border-brand-border text-brand-dim'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Text */}
                <div className="pb-8">
                  <p className={`font-semibold text-sm ${done ? 'text-brand-white' : 'text-brand-dim'}`}>{step.label}</p>
                  <p className="text-brand-dim text-xs mt-0.5">{step.sub}</p>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1.5 mt-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green pulse-dot" />
                      <span className="text-brand-green text-xs font-medium">In progress</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Estimated time */}
      {order.estimated_time && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="flex items-center gap-3 bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4">
          <Clock className="w-5 h-5 text-brand-green flex-shrink-0" />
          <div>
            <p className="text-brand-white font-semibold text-sm">Estimated {isDelivery ? 'delivery' : 'collection'}</p>
            <p className="text-brand-muted text-xs">{order.estimated_time} minutes from order time</p>
          </div>
        </div>
      )}
    </div>
  )
}
