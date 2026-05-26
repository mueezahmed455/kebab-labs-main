import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addressSchema } from '@/lib/validations'
import { z } from 'zod'

const createAddressSchema = addressSchema.extend({
  label: z.string().max(50).optional(),
  isDefault: z.boolean().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = createAddressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    // If setting as default, clear existing defaults first
    if (parsed.data.isDefault) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        label: parsed.data.label ?? null,
        line1: parsed.data.line1,
        line2: parsed.data.line2 ?? null,
        city: parsed.data.city,
        postcode: parsed.data.postcode.toUpperCase(),
        is_default: parsed.data.isDefault ?? false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}
