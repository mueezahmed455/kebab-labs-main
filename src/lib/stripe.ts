import Stripe from 'stripe'

let _stripe: Stripe | null = null

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  return key
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      _stripe = new Stripe(getStripeKey(), {
        apiVersion: '2025-08-27.basil',
        typescript: true,
      })
    }
    return (_stripe as unknown as Record<string | symbol, unknown>)[prop]
  },
})
