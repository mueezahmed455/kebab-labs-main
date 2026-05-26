import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ id: string }> }

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin' ? user : null
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const admin = await createAdminClient()

  const updates: Record<string, unknown> = {}
  if (typeof body.isAvailable === 'boolean') updates.is_available = body.isAvailable
  if (typeof body.isFeatured === 'boolean')  updates.is_featured  = body.isFeatured
  if (typeof body.basePrice === 'number')    updates.base_price   = body.basePrice
  if (typeof body.name === 'string')         updates.name         = body.name
  if (typeof body.description === 'string')  updates.description  = body.description

  const { data, error } = await admin
    .from('menu_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const admin = await createAdminClient()
  const { error } = await admin.from('menu_items').update({ is_available: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
