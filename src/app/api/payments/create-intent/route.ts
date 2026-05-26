import { NextRequest } from 'next/server'
import { createPaymentIntentSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-error'
import { rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`payment-intent:${ip}`, 5, 60_000)
    if (!allowed) return apiError(429, 'Too many requests. Try again later.')

    const body = await request.json()
    if (JSON.stringify(body).length > 10_240) return apiError(413, 'Request too large')

    const parsed = createPaymentIntentSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'Invalid request')
    }

    const { orderId } = parsed.data

    // Look up the order to verify the amount server-side
    const admin = await createAdminClient()
    const { data: order } = await (admin as any)
      .from('orders')
      .select('total')
      .eq('id', orderId)
      .single()

    if (!order) return apiError(404, 'Order not found')

    const amountInPence = Math.round(order.total * 100)

    const stripe = await import('@/lib/stripe').then((m) => m.stripe)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
      metadata: { order_id: orderId },
    })

    return apiSuccess({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return apiError(500, 'Failed to create payment intent')
  }
}
