import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { apiError, apiSuccess } from '@/lib/api-error'
import { z } from 'zod'

const schema = z.object({
  code:     z.string().min(1).max(30),
  subtotal: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return apiError(400, 'Invalid request')

    const { code, subtotal } = parsed.data
    const admin = await createAdminClient()

    const { data: promo } = await (admin as any)
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (!promo) return apiError(404, 'Promo code not found or inactive')

    const now = new Date()
    if (promo.valid_from && new Date(promo.valid_from) > now) {
      return apiError(400, 'Promo code is not yet active')
    }
    if (promo.valid_until && new Date(promo.valid_until) < now) {
      return apiError(400, 'Promo code has expired')
    }
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return apiError(400, 'Promo code has reached its usage limit')
    }
    if (promo.min_order && subtotal < promo.min_order) {
      return apiError(400, `Minimum order of £${Number(promo.min_order).toFixed(2)} required for this code`)
    }

    const discount =
      promo.type === 'percent'
        ? Math.round((subtotal * promo.value) / 100 * 100) / 100
        : Math.min(Number(promo.value), subtotal)

    return apiSuccess({
      code:    promo.code as string,
      type:    promo.type as 'percent' | 'fixed',
      value:   Number(promo.value),
      discount,
      label:   promo.type === 'percent'
        ? `${promo.value}% off`
        : `£${Number(promo.value).toFixed(2)} off`,
    })
  } catch {
    return apiError(500, 'Failed to validate promo code')
  }
}
