export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'driver'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'driver'
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'driver'
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          line1: string
          line2: string | null
          city: string
          postcode: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          label?: string | null
          line1: string
          line2?: string | null
          city?: string
          postcode: string
          is_default?: boolean
        }
        Update: {
          label?: string | null
          line1?: string
          line2?: string | null
          city?: string
          postcode?: string
          is_default?: boolean
        }
      }
      categories: {
        Row: {
          id: number
          slug: string
          name: string
          description: string | null
          icon: string | null
          sort_order: number
          is_active: boolean
        }
        Insert: {
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: number | null
          name: string
          description: string | null
          base_price: number
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          allergens: string[] | null
          calories: number | null
          is_spicy: boolean
          is_vegetarian: boolean
          is_vegan: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          name: string
          description?: string | null
          base_price: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          allergens?: string[] | null
          calories?: number | null
          is_spicy?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          sort_order?: number
        }
        Update: {
          name?: string
          description?: string | null
          base_price?: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          allergens?: string[] | null
          calories?: number | null
          is_spicy?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          sort_order?: number
        }
      }
      menu_variants: {
        Row: {
          id: string
          item_id: string
          label: string
          price: number
          sort_order: number
        }
        Insert: {
          item_id: string
          label: string
          price: number
          sort_order?: number
        }
        Update: {
          label?: string
          price?: number
          sort_order?: number
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          guest_name: string | null
          guest_email: string | null
          guest_phone: string | null
          order_type: 'delivery' | 'collection'
          delivery_line1: string | null
          delivery_line2: string | null
          delivery_city: string | null
          delivery_postcode: string | null
          subtotal: number
          delivery_fee: number
          discount: number
          total: number
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          payment_method: 'card' | 'cash' | 'online' | null
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          stripe_payment_intent: string | null
          customer_notes: string | null
          kitchen_notes: string | null
          estimated_time: number | null
          confirmed_at: string | null
          preparing_at: string | null
          ready_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_number: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          order_type: 'delivery' | 'collection'
          delivery_line1?: string | null
          delivery_line2?: string | null
          delivery_city?: string | null
          delivery_postcode?: string | null
          subtotal: number
          delivery_fee?: number
          discount?: number
          total: number
          payment_method?: 'card' | 'cash' | 'online' | null
          customer_notes?: string | null
          estimated_time?: number | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          stripe_payment_intent?: string | null
          kitchen_notes?: string | null
          estimated_time?: number | null
          confirmed_at?: string | null
          preparing_at?: string | null
          ready_at?: string | null
          delivered_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_id: string | null
          variant_id: string | null
          name: string
          variant_label: string | null
          quantity: number
          unit_price: number
          total_price: number
          options: Json
          notes: string | null
        }
        Insert: {
          order_id: string
          item_id?: string | null
          variant_id?: string | null
          name: string
          variant_label?: string | null
          quantity?: number
          unit_price: number
          total_price: number
          options?: Json
          notes?: string | null
        }
        Update: {
          quantity?: number
          notes?: string | null
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: string
          note: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          order_id: string
          status: string
          note?: string | null
          created_by?: string | null
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          type: 'percent' | 'fixed'
          value: number
          min_order: number
          max_uses: number | null
          used_count: number
          valid_from: string | null
          valid_until: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          code: string
          type: 'percent' | 'fixed'
          value: number
          min_order?: number
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
          is_active?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string | null
          user_id: string | null
          rating: number
          comment: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          order_id?: string | null
          user_id?: string | null
          rating: number
          comment?: string | null
          is_published?: boolean
        }
        Update: {
          comment?: string | null
          is_published?: boolean
        }
      }
      opening_overrides: {
        Row: {
          id: number
          date: string
          is_closed: boolean
          open_time: string | null
          close_time: string | null
          note: string | null
        }
        Insert: {
          date: string
          is_closed?: boolean
          open_time?: string | null
          close_time?: string | null
          note?: string | null
        }
      }
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      generate_order_number: { Args: Record<string, never>; Returns: string }
      is_valid_delivery_postcode: { Args: { p_postcode: string }; Returns: boolean }
    }
  }
}
