-- ============================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ============================================================

-- Generate sequentially-numbered order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq INT;
  year TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  seq := NEXTVAL('public.order_number_seq');
  RETURN 'KBL-' || year || '-' || LPAD(seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-set updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Log status change to history table
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- Validate delivery postcode is within service area (Burnley BB10, BB11, BB12)
CREATE OR REPLACE FUNCTION public.is_valid_delivery_postcode(p_postcode TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_postcode ~* '^(BB10|BB11|BB12)\s?\d[A-Z]{2}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
