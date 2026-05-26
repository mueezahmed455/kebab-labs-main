'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, MapPin, CreditCard, Banknote, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/store/cartStore'
import { useCheckout } from '@/lib/store/checkoutStore'
import { formatCurrency } from '@/lib/utils/formatting'
import { StepIndicator } from '@/components/checkout/StepIndicator'
import { OrderTypeToggle } from '@/components/cart/OrderTypeToggle'
import { BRAND } from '@/lib/data/brand'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const step1Schema = z.object({
  name:  z.string().min(2, 'Full name required'),
  phone: z.string().min(10, 'Valid UK phone required'),
  email: z.string().email('Valid email required'),
})

const step2Schema = z.object({
  addressLine1: z.string().min(3, 'Address required'),
  city:         z.string().min(2, 'City required'),
  postcode:     z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Valid UK postcode required'),
})

type Step1Fields = z.infer<typeof step1Schema>
type Step2Fields = z.infer<typeof step2Schema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-brand-muted text-xs font-medium tracking-widest uppercase mb-1.5">{label}</label>
      {children}
      {error && <p className="flex items-center gap-1 text-red-400 text-xs mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  )
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-3 rounded-xl bg-brand-card border text-brand-text text-sm placeholder:text-brand-dim focus:outline-none transition-colors',
        error ? 'border-red-500/50 focus:border-red-500' : 'border-brand-border focus:border-brand-green/50'
      )}
    />
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, deliveryFee, orderType, clearCart } = useCart()
  const { step, form, setStep, updateForm, reset } = useCheckout()
  const [placing, setPlacing] = useState(false)

  const sub = subtotal()
  const fee = deliveryFee()
  const tot = total()

  useEffect(() => {
    if (items.length === 0) router.replace('/menu')
  }, [items.length, router])

  const step1 = useForm<Step1Fields>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: form.name, phone: form.phone, email: form.email },
  })

  const step2 = useForm<Step2Fields>({
    resolver: zodResolver(step2Schema),
    defaultValues: { addressLine1: form.addressLine1, city: form.city, postcode: form.postcode },
  })

  const onStep1 = step1.handleSubmit((data) => { updateForm(data); setStep(2) })
  const onStep2 = step2.handleSubmit((data) => { updateForm(data); setStep(3) })

  const handlePlaceOrder = async () => {
    if (placing) return
    setPlacing(true)
    try {
      const body = {
        orderType,
        contact: { name: form.name, phone: form.phone, email: form.email },
        deliveryAddress: orderType === 'delivery'
          ? { line1: form.addressLine1, line2: form.addressLine2 || undefined, city: form.city, postcode: form.postcode }
          : undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          variantLabel: i.size || undefined,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        subtotal: sub,
        deliveryFee: fee,
        total: tot,
        paymentMethod: form.payment,
        customerNotes: form.notes || undefined,
        privacyConsent: true as const,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      const orderNumber = data.order_number
      clearCart()
      reset()
      router.push(`/order/confirmation/${orderNumber}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-brand-bg py-10 px-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back()}
          className="flex items-center gap-2 text-brand-muted text-sm hover:text-brand-text mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? 'Back' : 'Back to Cart'}
        </button>

        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl text-brand-text tracking-wider mb-1">CHECKOUT</h1>
          <p className="text-brand-muted text-sm">
            You&apos;re almost there —{' '}
            <span className="text-brand-green">fill in your details below.</span>
          </p>
        </div>

        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={onStep1}
              className="space-y-4"
            >
              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-4">
                <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Your Details</p>
                <Field label="Full Name" error={step1.formState.errors.name?.message}>
                  <Input {...step1.register('name')} placeholder="John Smith" error={step1.formState.errors.name?.message} />
                </Field>
                <Field label="Phone Number" error={step1.formState.errors.phone?.message}>
                  <Input {...step1.register('phone')} type="tel" placeholder="01282 000 000" error={step1.formState.errors.phone?.message} />
                </Field>
                <Field label="Email Address" error={step1.formState.errors.email?.message}>
                  <Input {...step1.register('email')} type="email" placeholder="john@example.com" error={step1.formState.errors.email?.message} />
                </Field>
              </div>

              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
                <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Order Type</p>
                <OrderTypeToggle />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-bg font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95"
              >
                Continue — Address Details <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={onStep2}
              className="space-y-4"
            >
              {orderType === 'delivery' ? (
                <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-4">
                  <p className="text-brand-muted text-xs font-medium tracking-widest uppercase flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address
                  </p>
                  <Field label="Address Line 1" error={step2.formState.errors.addressLine1?.message}>
                    <Input {...step2.register('addressLine1')} placeholder="123 Example Street" error={step2.formState.errors.addressLine1?.message} />
                  </Field>
                  <Field label="City" error={step2.formState.errors.city?.message}>
                    <Input {...step2.register('city')} placeholder="Burnley" error={step2.formState.errors.city?.message} />
                  </Field>
                  <Field label="Postcode" error={step2.formState.errors.postcode?.message}>
                    <Input {...step2.register('postcode')} placeholder="BB10 1LN" error={step2.formState.errors.postcode?.message} className="uppercase" />
                  </Field>
                </div>
              ) : (
                <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
                  <p className="text-brand-muted text-xs font-medium tracking-widest uppercase flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> Collection Address
                  </p>
                  <p className="text-brand-text font-semibold">{BRAND.address}</p>
                  <p className="text-brand-muted text-sm mt-1">Ready in {BRAND.collection.estimatedMins} minutes</p>
                </div>
              )}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-bg font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95"
              >
                Continue — Review & Pay <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
                <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Order Summary</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-brand-muted">{item.quantity}× {item.name}{item.size ? ` (${item.size})` : ''}</span>
                    <span className="text-brand-text">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-brand-border pt-2 space-y-1">
                  <div className="flex justify-between text-sm text-brand-muted">
                    <span>Subtotal</span><span className="text-brand-text">{formatCurrency(sub)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-muted">
                    <span>Delivery</span>
                    <span className={fee === 0 ? 'text-brand-green' : 'text-brand-text'}>
                      {orderType === 'collection' ? 'Free' : fee === 0 ? 'Free' : formatCurrency(fee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-text">
                    <span>Total</span>
                    <span className="font-display text-xl text-brand-gold">{formatCurrency(tot)}</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 bg-brand-card border border-brand-border rounded-2xl p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.privacyConsent}
                  onChange={(e) => updateForm({ privacyConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-brand-border bg-brand-surface text-brand-green focus:ring-brand-green"
                />
                <div className="text-sm">
                  <span className="text-brand-text font-medium">Privacy consent</span>
                  <p className="text-brand-dim text-xs mt-0.5">
                    I agree to my data being stored and used in accordance with the{' '}
                    <a href="/privacy" target="_blank" className="text-brand-green hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </label>

              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
                <p className="text-brand-muted text-xs font-medium tracking-widest uppercase">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'card', icon: CreditCard, label: 'Pay by Card', sub: 'Secure online payment' },
                    { value: 'cash', icon: Banknote,   label: 'Cash on Delivery', sub: 'Pay at the door' },
                  ] as const).map(({ value, icon: Icon, label, sub: subLabel }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateForm({ payment: value })}
                      className={cn(
                        'flex flex-col items-start gap-1 p-3 rounded-xl border transition-all text-left',
                        form.payment === value
                          ? 'border-brand-green bg-brand-green/10'
                          : 'border-brand-border hover:border-brand-green/30'
                      )}
                    >
                      <Icon className="w-4 h-4 text-brand-green" />
                      <span className="text-brand-text text-sm font-medium">{label}</span>
                      <span className="text-brand-dim text-xs">{subLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!form.privacyConsent || placing}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-green text-brand-bg font-bold hover:bg-brand-green-dark transition-all active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</>
                ) : (
                  <>Place Order — {formatCurrency(tot)}</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
