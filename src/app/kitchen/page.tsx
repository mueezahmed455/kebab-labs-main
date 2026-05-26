'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, AlertTriangle, FlaskConical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface KitchenOrder {
  id: string
  order_number: string
  created_at: string
  order_type: 'delivery' | 'collection'
  customer_notes: string | null
  order_items: { name: string; quantity: number; notes: string | null }[]
}

function ageColor(createdAt: string): string {
  const mins = (Date.now() - new Date(createdAt).getTime()) / 60_000
  if (mins < 10) return 'border-brand-green'
  if (mins < 20) return 'border-yellow-400'
  return 'border-red-500 animate-pulse'
}

function ageLabel(createdAt: string): string {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
  return `${mins}m ago`
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [completing, setCompleting] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  // Refresh age labels every minute
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const fetchOrders = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, created_at, order_type, customer_notes, order_items(name, quantity, notes)')
      .in('status', ['confirmed', 'preparing'])
      .order('created_at', { ascending: true })
    if (data) setOrders(data as KitchenOrder[])
  }, [])

  useEffect(() => {
    fetchOrders()
    const supabase = createClient()
    const channel = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders])

  const complete = async (order: KitchenOrder) => {
    setCompleting(order.id)
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: order.order_type === 'delivery' ? 'out_for_delivery' : 'ready' }),
      })
      if (!res.ok) throw new Error()
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      toast.success(`${order.order_number} — ${order.order_type === 'delivery' ? 'Out for delivery' : 'Ready for collection'}`)
    } catch {
      toast.error('Failed to update order')
    } finally {
      setCompleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-brand-green" />
          <div>
            <h1 className="font-display text-4xl text-brand-white tracking-wider">KITCHEN</h1>
            <p className="text-brand-muted text-sm">{orders.length} active order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-green" /> &lt; 10min</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400" /> 10-20min</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /> 20min+</span>
        </div>
      </div>

      {/* Order grid */}
      <AnimatePresence>
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <CheckCircle className="w-16 h-16 text-brand-green/30 mb-4" />
            <p className="text-brand-muted text-lg font-medium">All clear — no pending orders</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className={cn('bg-brand-card border-2 rounded-2xl p-5 flex flex-col gap-4', ageColor(order.created_at))}
              >
                {/* Order header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-brand-white text-xl tracking-wider">{order.order_number}</p>
                    <p className="text-brand-muted text-xs">{ageLabel(order.created_at)} · {order.order_type}</p>
                  </div>
                  {(Date.now() - new Date(order.created_at).getTime()) > 20 * 60_000 && (
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                </div>

                {/* Items */}
                <ul className="flex-1 space-y-2">
                  {order.order_items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-green text-brand-dark text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.quantity}
                      </span>
                      <div>
                        <p className="text-brand-white text-sm font-medium leading-tight">{item.name}</p>
                        {item.notes && <p className="text-brand-muted text-xs italic">{item.notes}</p>}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Customer notes */}
                {order.customer_notes && (
                  <p className="text-brand-muted text-xs bg-brand-surface rounded-lg p-2 italic">
                    📝 {order.customer_notes}
                  </p>
                )}

                {/* Complete button */}
                <button
                  onClick={() => complete(order)}
                  disabled={completing === order.id}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95 disabled:opacity-50"
                >
                  {completing === order.id ? (
                    <span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> {order.order_type === 'delivery' ? 'Send Out' : 'Mark Ready'}</>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
