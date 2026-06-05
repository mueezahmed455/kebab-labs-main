-- Kebab Labs Supabase Schema
-- Run this in your Supabase SQL Editor

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT "[]",
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT "confirmed",
  order_type TEXT NOT NULL DEFAULT "collection",
  delivery_address TEXT,
  promo_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  metadata JSONB DEFAULT "{}",
  session_id TEXT,
  device TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification logs
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT "pending",
  order_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Admin roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL DEFAULT "admin",
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu items (for admin CRUD)
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  badge TEXT,
  grade TEXT,
  calories INTEGER,
  img_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref TEXT,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access on orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admin full access on analytics" ON analytics_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admin full access on notifications" ON notification_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- Public can insert orders and analytics
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Public can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_analytics_event ON analytics_events(event);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
