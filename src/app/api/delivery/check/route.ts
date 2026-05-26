import { NextRequest } from 'next/server'
import { deliveryCheckSchema } from '@/lib/validations'
import { DELIVERY_POSTCODE_PREFIXES } from '@/lib/constants'
import { apiError, apiSuccess } from '@/lib/api-error'
import { BRAND } from '@/lib/data/brand'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = deliveryCheckSchema.safeParse(body)

    if (!parsed.success) {
      return apiError(400, 'Invalid postcode format')
    }

    const postcode = parsed.data.postcode.toUpperCase().replace(/\s/g, '')
    const prefix = postcode.match(/^[A-Z]+\d+/)?.[0]

    const inRange = DELIVERY_POSTCODE_PREFIXES.includes(prefix as typeof DELIVERY_POSTCODE_PREFIXES[number])

    return apiSuccess({
      available: inRange,
      postcode: parsed.data.postcode,
      fee: inRange ? BRAND.delivery.fee : null,
      estimatedMinutes: 45,
    })
  } catch {
    return apiError(500, 'Failed to check delivery availability')
  }
}
