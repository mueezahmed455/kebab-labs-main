import { NextRequest, NextResponse } from 'next/server'
import { deliveryCheckSchema } from '@/lib/validations'
import { DELIVERY_POSTCODE_PREFIXES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = deliveryCheckSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid postcode format' },
        { status: 400 }
      )
    }

    const postcode = parsed.data.postcode.toUpperCase().replace(/\s/g, '')
    const prefix = postcode.match(/^[A-Z]+\d+/)?.[0]

    const inRange = DELIVERY_POSTCODE_PREFIXES.includes(prefix as typeof DELIVERY_POSTCODE_PREFIXES[number])

    return NextResponse.json({
      available: inRange,
      postcode: parsed.data.postcode,
      fee: inRange ? 2.49 : null,
      estimatedMinutes: 45,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to check delivery availability' },
      { status: 500 }
    )
  }
}
