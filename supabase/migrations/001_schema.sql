-- ============================================================
-- SCHEMA MIGRATION 001: Core Tables
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  role          TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'driver')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Addresses
CREATE TABLE public.addresses (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label         TEXT,
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL DEFAULT 'Burnley',
  postcode      TEXT NOT NULL,
  is_default    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE
);

-- Menu items
CREATE TABLE public.menu_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id   INT REFERENCES public.categories(id),
  name          TEXT NOT NULL,
  description   TEXT,
  base_price    DECIMAL(10,2) NOT NULL,
  image_url     TEXT,
  is_available  BOOLEAN DEFAULT TRUE,
  is_featured   BOOLEAN DEFAULT FALSE,
  allergens     TEXT[],
  calories      INT,
  is_spicy      BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan      BOOLEAN DEFAULT FALSE,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Menu item variants (pizza sizes, reg/lrg etc.)
CREATE TABLE public.menu_variants (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id       UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  label         TEXT NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  sort_order    INT DEFAULT 0
);

-- Option groups (toppings, sauces, etc.)
CREATE TABLE public.option_groups (
  id            SERIAL PRIMARY KEY,
  item_id       UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  min_select    INT DEFAULT 0,
  max_select    INT DEFAULT 1,
  is_required   BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.options (
  id            SERIAL PRIMARY KEY,
  group_id      INT REFERENCES public.option_groups(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  price_delta   DECIMAL(10,2) DEFAULT 0.00,
  is_available  BOOLEAN DEFAULT TRUE
);

-- Orders
CREATE TABLE public.orders (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number      TEXT UNIQUE NOT NULL,
  user_id           UUID REFERENCES public.profiles(id),
  guest_name        TEXT,
  guest_email       TEXT,
  guest_phone       TEXT,
  order_type        TEXT NOT NULL CHECK (order_type IN ('delivery', 'collection')),
  delivery_line1    TEXT,
  delivery_line2    TEXT,
  delivery_city     TEXT,
  delivery_postcode TEXT,
  subtotal          DECIMAL(10,2) NOT NULL,
  delivery_fee      DECIMAL(10,2) DEFAULT 0.00,
  discount          DECIMAL(10,2) DEFAULT 0.00,
  total             DECIMAL(10,2) NOT NULL,
  status            TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
  )),
  payment_method    TEXT CHECK (payment_method IN ('card', 'cash', 'online')),
  payment_status    TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_intent TEXT,
  customer_notes    TEXT,
  kitchen_notes     TEXT,
  estimated_time    INT,
  confirmed_at      TIMESTAMPTZ,
  preparing_at      TIMESTAMPTZ,
  ready_at          TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- Order items
CREATE TABLE public.order_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id      UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_id       UUID REFERENCES public.menu_items(id),
  variant_id    UUID REFERENCES public.menu_variants(id),
  name          TEXT NOT NULL,
  variant_label TEXT,
  quantity      INT NOT NULL DEFAULT 1,
  unit_price    DECIMAL(10,2) NOT NULL,
  total_price   DECIMAL(10,2) NOT NULL,
  options       JSONB DEFAULT '[]',
  notes         TEXT
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Order status history
CREATE TABLE public.order_status_history (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id   UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status     TEXT NOT NULL,
  note       TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON public.order_status_history(order_id);

-- Promo codes
CREATE TABLE public.promo_codes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  type          TEXT CHECK (type IN ('percent', 'fixed')) NOT NULL,
  value         DECIMAL(10,2) NOT NULL,
  min_order     DECIMAL(10,2) DEFAULT 0,
  max_uses      INT,
  used_count    INT DEFAULT 0,
  valid_from    TIMESTAMPTZ,
  valid_until   TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id),
  rating      INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment     TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Opening hours overrides
CREATE TABLE public.opening_overrides (
  id         SERIAL PRIMARY KEY,
  date       DATE UNIQUE NOT NULL,
  is_closed  BOOLEAN DEFAULT FALSE,
  open_time  TIME,
  close_time TIME,
  note       TEXT
);

-- Order number sequence
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1;
