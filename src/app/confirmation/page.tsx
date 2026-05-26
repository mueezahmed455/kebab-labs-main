'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, MapPin, Receipt, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCheckout } from '@/lib/store/checkoutStore'
import { BRAND } from '@/lib/data/brand'

function ConfirmationContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { form, orderReference, reset } = useCheckout()

  const ref = params.get('ref') || orderReference

  useEffect(() => {
    if (!ref) router.replace('/')
  }, [ref, router])

  if (!ref) return null

  const isDelivery = form.addressLine1.length > 0
  const estimated = isDelivery ? BRAND.delivery.estimatedMins : BRAND.collection.estimatedMins

  const details = [
    { icon: Receipt, label: 'Order Reference', value: ref, highlight: true },
    { icon: MapPin,  label: isDelivery ? 'Delivery Address' : 'Collection', value: isDelivery ? `${form.addressLine1}, ${form.city}` : BRAND.address },
    { icon: Clock,   label: 'Estimated Time', value: `${estimated} minutes` },
  ]

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-brand-green/10 border-2 border-brand-green flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-brand-green" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-display text-5xl text-brand-white tracking-wider mb-2">ORDER PLACED!</h1>
          <p className="text-brand-muted text-sm">
            Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}! Your order is confirmed and being prepared.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 bg-brand-card border border-brand-border rounded-2xl overflow-hidden"
        >
          {details.map(({ icon: Icon, label, value, highlight }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-4 ${i < details.length - 1 ? 'border-b border-brand-border' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-green" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-brand-muted text-xs">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? 'text-brand-green font-display text-base tracking-wider' : 'text-brand-white'}`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-green/5 border-t border-brand-green/20">
            <span className="text-brand-muted text-sm">Payment</span>
            <span className="text-sm text-brand-white capitalize">{form.payment}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <Link
            href="/"
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/menu"
            onClick={reset}
            className="flex-1 flex items-center justify-center py-3 rounded-xl border border-brand-green/30 text-brand-green font-medium text-sm hover:bg-brand-green/10 transition-all"
          >
            Order Again
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
