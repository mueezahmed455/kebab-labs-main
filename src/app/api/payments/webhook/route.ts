import { NextRequest } from 'next/server'
import { apiError, apiSuccess } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return apiError(400, 'Missing stripe-signature header')
    }

    const stripe = await import('@/lib/stripe').then((m) => m.stripe)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    } catch {
      return apiError(400, 'Invalid signature')
    }

    const { createAdminClient } = await import('@/lib/supabase/server')
    const admin = await createAdminClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        const amountPaid = pi.amount_received

        // Verify amount-received matches stored order total
        const orderId = pi.metadata?.order_id
        if (!orderId) break

        const { data: order } = await (admin as any)
          .from('orders')
          .select('total')
          .eq('id', orderId)
          .single()

        if (order && Math.round(order.total * 100) === amountPaid) {
          await (admin as any)
            .from('orders')
            .update({ payment_status: 'paid', stripe_payment_intent: pi.id })
            .eq('id', orderId)
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        const orderId = pi.metadata?.order_id
        if (orderId) {
          await (admin as any)
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderId)
        }
        break
      }
    }

    return apiSuccess({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return apiError(500, 'Webhook handler failed')
  }
}
