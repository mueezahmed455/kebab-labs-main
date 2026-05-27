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
        const orderId = pi.metadata?.order_id
        if (!orderId) break

        const { data: order } = await (admin as any)
          .from('orders')
          .select('total, guest_email, guest_name, order_number, estimated_time, order_type, payment_status')
          .eq('id', orderId)
          .single()

        if (!order) break

        // Idempotency: skip if already processed
        if (order.payment_status === 'paid') break

        if (Math.round(order.total * 100) !== amountPaid) {
          console.error(`Webhook amount mismatch for order ${orderId}: expected ${Math.round(order.total * 100)}, got ${amountPaid}`)
          break
        }

        await (admin as any)
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
            stripe_payment_intent: pi.id,
          })
          .eq('id', orderId)

        await (admin as any).from('order_status_history').insert({
          order_id: orderId,
          status: 'confirmed',
          note: 'Payment confirmed automatically via Stripe',
        })

        if (order.guest_email) {
          const { sendOrderStatusUpdate } = await import('@/lib/resend')
          await sendOrderStatusUpdate({
            email: order.guest_email as string,
            customerName: (order.guest_name as string) || 'Customer',
            orderNumber: order.order_number as string,
            status: 'confirmed',
            estimatedTime: order.estimated_time as number | null,
            orderType: order.order_type as string,
          }).catch(() => {})
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
