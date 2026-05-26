import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { menuItemSchema } from '@/lib/validations'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return (profile as { role: string } | null)?.role === 'admin' ? user : null
}

export async function GET() {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('menu_items')
    .select('*, categories(name, slug)')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await request.json()
  const parsed = menuItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }

  const admin = await createAdminClient()

  // Resolve category id from slug
  const { data: category } = await admin
    .from('categories')
    .select('id')
    .eq('slug', parsed.data.categorySlug)
    .single()

  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 })

  const { data, error } = await admin
    .from('menu_items')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      base_price: parsed.data.basePrice,
      category_id: (category as { id: number }).id,
      is_available: parsed.data.isAvailable ?? true,
      is_featured: parsed.data.isFeatured ?? false,
      is_spicy: parsed.data.isSpicy ?? false,
      is_vegetarian: parsed.data.isVegetarian ?? false,
      is_vegan: parsed.data.isVegan ?? false,
      sort_order: parsed.data.sortOrder ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
