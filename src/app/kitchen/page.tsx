'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, AlertTriangle, FlaskConical, Clock } from 'lucide-react'
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

function useAge(createdAt: string): { mins: number; color: string; label: string } {
  const calc = () => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
    const color = mins < 10 ? 'border-brand-green' : mins < 20 ? 'border-yellow-400' : 'border-red-500 animate-pulse'
    return { mins, color, label: `${mins}m ago` }
  }
  const [age, setAge] = useState(calc)
  useEffect(() => {
    setAge(calc())
    const id = setInterval(() => setAge(calc()), 15_000)
    return () => clearInterval(id)
  }, [createdAt])
  return age
}

function OrderCard({ order, onComplete, completing }: {
  order: KitchenOrder
  onComplete: (o: KitchenOrder) => void
  completing: string | null
}) {
  const { mins, color, label } = useAge(order.created_at)
  const isUrgent = mins > 20

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className={cn('bg-brand-card border-2 rounded-2xl p-5 flex flex-col gap-4', color)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-brand-text text-xl tracking-wider">{order.order_number}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-brand-dim" />
            <p className="text-brand-muted text-xs">{label}</p>
            <span className="text-brand-dim text-xs">·</span>
            <span className="text-brand-muted text-xs capitalize">{order.order_type}</span>
          </div>
        </div>
        {isUrgent && (
          <div className="flex items-center gap-1 text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            URGENT
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-2">
        {order.order_items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-green text-brand-bg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {item.quantity}
            </span>
            <div>
              <p className="text-brand-text text-sm font-medium leading-tight">{item.name}</p>
              {item.notes && <p className="text-brand-dim text-xs italic">{item.notes}</p>}
            </div>
          </li>
        ))}
      </ul>

      {order.customer_notes && (
        <p className="text-brand-dim text-xs bg-brand-surface rounded-lg p-2 italic">
          📝 {order.customer_notes}
        </p>
      )}

      <button
        onClick={() => onComplete(order)}
        disabled={completing === order.id}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-green text-brand-bg font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95 disabled:opacity-50"
      >
        {completing === order.id ? (
          <span className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
        ) : (
          <><CheckCircle className="w-4 h-4" /> {order.order_type === 'delivery' ? 'Send Out' : 'Mark Ready'}</>
        )}
      </button>
    </motion.div>
  )
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [completing, setCompleting] = useState<string | null>(null)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setAuthed(false); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setAuthed((profile as { role: string } | null)?.role === 'admin')
    }
    check()
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
    if (!authed) return
    fetchOrders()
    const supabase = createClient()
    const channel = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [authed, fetchOrders])

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

  if (authed === null) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    )
  }

  if (authed === false) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-center px-4">
        <div>
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-brand-text tracking-wider mb-2">ACCESS DENIED</h1>
          <p className="text-brand-muted">You need admin privileges to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-brand-green" />
          <div>
            <h1 className="font-display text-4xl text-brand-text tracking-wider">KITCHEN</h1>
            <p className="text-brand-muted text-sm">{orders.length} active order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-green" /> &lt; 10min</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400" /> 10-20min</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /> 20min+</span>
        </div>
      </div>

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
              <OrderCard key={order.id} order={order} onComplete={complete} completing={completing} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
