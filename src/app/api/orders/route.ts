import { NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-error'
import { rateLimit } from '@/lib/rate-limit'
import { sendOrderConfirmation, sendAdminNewOrderAlert } from '@/lib/resend'

const DELIVERY_FEE = 1.99

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return apiError(401, 'Authentication required')
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return apiSuccess(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return apiError(500, 'Failed to fetch orders')
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = rateLimit(`order-create:${ip}`, 3, 60_000)
    if (!allowed) return apiError(429, 'Too many requests. Try again later.')

    const body = await request.json()
    if (JSON.stringify(body).length > 50_240) return apiError(413, 'Request too large')

    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'Validation failed', parsed.error.flatten())
    }

    const { orderType, contact, deliveryAddress, items, subtotal, deliveryFee, total, paymentMethod, customerNotes, promoCode } = parsed.data

    // Verify client-provided subtotal is internally consistent
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return apiError(400, 'Subtotal does not match item prices')
    }

    const admin = await createAdminClient()

    // --- Server-side price verification ---
    const itemIds = [...new Set(items.map((i) => i.menuItemId))]
    const variantIds = [...new Set(items.filter((i) => i.variantId).map((i) => i.variantId!))]

    const [{ data: menuItems }, { data: menuVariants }] = await Promise.all([
      (admin as any).from('menu_items').select('id, base_price').in('id', itemIds),
      variantIds.length > 0
        ? (admin as any).from('menu_variants').select('id, price').in('id', variantIds)
        : Promise.resolve({ data: [] }),
    ])

    const itemPriceMap = new Map<string, number>(
      (menuItems ?? []).map((m: { id: string; base_price: number }) => [m.id, Number(m.base_price)])
    )
    const variantPriceMap = new Map<string, number>(
      (menuVariants ?? []).map((v: { id: string; price: number }) => [v.id, Number(v.price)])
    )

    for (const item of items) {
      const dbPrice = item.variantId
        ? variantPriceMap.get(item.variantId)
        : itemPriceMap.get(item.menuItemId)

      if (dbPrice === undefined) return apiError(400, 'Menu item not found')
      if (Math.abs(dbPrice - item.unitPrice) > 0.01) return apiError(400, 'Item price mismatch')
    }

    // --- Validate delivery fee against business rules ---
    const expectedDeliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
    if (Math.abs(deliveryFee - expectedDeliveryFee) > 0.01) {
      return apiError(400, 'Invalid delivery fee')
    }

    // --- Server-side promo code validation ---
    let verifiedDiscount = 0
    if (promoCode) {
      const upper = promoCode.toUpperCase()
      const now = new Date().toISOString()
      const { data: pc } = await (admin as any)
        .from('promo_codes')
        .select('*')
        .eq('code', upper)
        .eq('is_active', true)
        .single()

      if (!pc) return apiError(400, 'Invalid or inactive promo code')
      if (pc.valid_from && pc.valid_from > now) return apiError(400, 'Promo code is not yet active')
      if (pc.valid_until && pc.valid_until < now) return apiError(400, 'Promo code has expired')
      if (pc.max_uses != null && pc.used_count >= pc.max_uses) {
        return apiError(400, 'Promo code has been fully redeemed')
      }
      if (pc.min_order != null && calculatedSubtotal < Number(pc.min_order)) {
        return apiError(400, `Minimum order of £${Number(pc.min_order).toFixed(2)} required`)
      }

      verifiedDiscount = pc.type === 'percent'
        ? Math.round((calculatedSubtotal * Number(pc.value)) / 100 * 100) / 100
        : Math.min(Number(pc.value), calculatedSubtotal)
    }

    // Verify the client total against server-computed values
    const verifiedTotal = Math.max(0, calculatedSubtotal + expectedDeliveryFee - verifiedDiscount)
    if (Math.abs(verifiedTotal - total) > 0.01) {
      return apiError(400, 'Total does not match')
    }

    if (orderType === 'delivery' && deliveryAddress) {
      const { data: valid } = await (admin.rpc as any)('is_valid_delivery_postcode', {
        p_postcode: deliveryAddress.postcode,
      })
      if (!valid) {
        return apiError(400, 'Postcode is outside delivery area')
      }
    }

    const { data: orderNumber } = await (admin.rpc as any)('generate_order_number')

    const { data: { user } } = await (await createClient()).auth.getUser()

    const { data: order, error: orderError } = await (admin as any)
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        guest_name: contact.name,
        guest_email: contact.email,
        guest_phone: contact.phone,
        order_type: orderType,
        delivery_line1: deliveryAddress?.line1 ?? null,
        delivery_line2: deliveryAddress?.line2 ?? null,
        delivery_city: deliveryAddress?.city ?? null,
        delivery_postcode: deliveryAddress?.postcode ?? null,
        subtotal: calculatedSubtotal,
        delivery_fee: expectedDeliveryFee,
        discount: verifiedDiscount,
        total: verifiedTotal,
        payment_method: paymentMethod,
        customer_notes: customerNotes ?? null,
        estimated_time: orderType === 'delivery' ? 45 : 20,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_id: item.menuItemId,
      variant_id: item.variantId ?? null,
      name: item.name,
      variant_label: item.variantLabel ?? null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
      notes: item.notes ?? null,
    }))

    const { error: itemsError } = await (admin as any)
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    await (admin as any).from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
    })

    if (promoCode && verifiedDiscount > 0) {
      const upper = promoCode.toUpperCase()
      const { data: pc } = await (admin as any)
        .from('promo_codes')
        .select('used_count')
        .eq('code', upper)
        .single()
      if (pc) {
        await (admin as any)
          .from('promo_codes')
          .update({ used_count: (pc.used_count ?? 0) + 1 })
          .eq('code', upper)
          .catch(() => {})
      }
    }

    ;(async () => {
      try {
        const emailTimeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Email send timeout')), 8000)
        )
        await Promise.race([
          Promise.all([
            sendOrderConfirmation({
              email: contact.email,
              customerName: contact.name,
              orderNumber,
              orderType,
              items: items.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                total_price: i.unitPrice * i.quantity,
                variant_label: i.variantLabel,
                options: i.options,
              })),
              subtotal: calculatedSubtotal,
              deliveryFee: expectedDeliveryFee,
              total: verifiedTotal,
              estimatedTime: orderType === 'delivery' ? 45 : 20,
              paymentMethod,
              deliveryAddress: deliveryAddress ?? null,
              customerNotes: customerNotes ?? null,
            }),
            sendAdminNewOrderAlert({
              orderNumber,
              customerName: contact.name,
              orderType,
              total: verifiedTotal,
              items: items.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                total_price: i.unitPrice * i.quantity,
              })),
              customerNotes: customerNotes ?? null,
              deliveryAddress: deliveryAddress ?? null,
            }),
          ]),
          emailTimeout,
        ])
      } catch (emailErr) {
        console.error('Failed to send order emails:', emailErr)
      }
    })()

    return apiSuccess(order, 201)
  } catch (error) {
    console.error('Order creation error:', error)
    return apiError(500, 'Failed to create order')
  }
}
