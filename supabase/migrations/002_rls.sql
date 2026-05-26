-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all user-data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders: users see own; admins see all; guests create via API
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Guests and users create orders" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- Order items inherit from orders
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );
CREATE POLICY "Users and guests create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage all order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- Status history
CREATE POLICY "Users view own status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins manage status history" ON public.order_status_history
  FOR ALL USING (public.is_admin());

-- Reviews: anyone can create, users see own, admins see all
CREATE POLICY "Anyone create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Menu & categories are publicly readable
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public read menu_variants" ON public.menu_variants FOR SELECT USING (true);
CREATE POLICY "Public read option_groups" ON public.option_groups FOR SELECT USING (true);
CREATE POLICY "Public read options" ON public.options FOR SELECT USING (true);

CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage menu_items" ON public.menu_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage menu_variants" ON public.menu_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage option_groups" ON public.option_groups FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage options" ON public.options FOR ALL USING (public.is_admin());
