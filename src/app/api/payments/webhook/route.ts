import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const stripe = await import('@/lib/stripe').then((m) => m.stripe)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { createAdminClient } = await import('@/lib/supabase/server')
    const admin = await createAdminClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        await (admin as any)
          .from('orders')
          .update({ payment_status: 'paid', stripe_payment_intent: pi.id })
          .eq('stripe_payment_intent', pi.id)
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await (admin as any)
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent', pi.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
