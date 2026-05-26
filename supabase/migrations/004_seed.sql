-- ============================================================
-- SEED MIGRATION 004: Categories and Menu Items
-- ============================================================

-- Categories
INSERT INTO public.categories (slug, name, description, icon, sort_order) VALUES
  ('kebabs',   'Kebabs',           'Served with naan/chips or wrap, fresh salad & sauce', '🥙', 1),
  ('shawarma', 'Shawarma',         'Slow-roasted meats infused with secret sauces',       '🌯', 2),
  ('donner',   'Donner',           'Classic seasoned donner, various combos',             '🍖', 3),
  ('combos',   'Mixed Combos',     'Two proteins, one extraordinary plate',               '🔥', 4),
  ('deals',    'Meal Deals',       'Great value combinations with chips & drink',         '🎉', 5),
  ('burgers',  'Burgers',          'Served with chips, fresh salad & sauce',              '🍔', 6),
  ('pizza',    'Pizza',            'Stone-baked, available 10" to 16"',                  '🍕', 7),
  ('sharing',  'Sharing Platters', 'Perfect for groups, loaded with the best',           '🤝', 8),
  ('extras',   'Sides & Extras',   'Chips, dips, garlic bread and more',                 '🍟', 9),
  ('drinks',   'Drinks & Dessert', 'Cold drinks and Ben & Jerry''s ice cream',           '🥤', 10)
ON CONFLICT (slug) DO NOTHING;

-- ── KEBABS ──────────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, is_featured, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Single Kobeda',       'Hand-crafted minced beef with our signature Middle Eastern spice blend, flame-grilled over fiery clay oven coals.',    6.99,  true, 1),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Double Kobeda',       'Double the signature kobeda for serious kebab lovers. Our most popular indulgence.',                                    12.99, false, 2),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Cheesy Kobeda Bites', 'Tender minced beef with melted marmur cheese, spiced and charcoal-cooked to perfection.',                              7.99,  false, 3),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Chicken Tikka',       'Lean chicken breast marinated in our secret sauce, skewered and cooked over charcoal.',                                6.99,  false, 4),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Double Chicken Tikka','Double portion of our legendary charcoal-cooked chicken tikka.',                                                        12.99, false, 5),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Chicken Wings (5pc)', 'Five juicy wings marinated in our secret sauce, charcoal-cooked until perfectly crisp.',                               5.99,  false, 6),
  ((SELECT id FROM categories WHERE slug='kebabs'), 'Veg Kebab',           'Lightly spiced potato blended with caramelised onions and dried herbs, authentic Middle Eastern taste.',               5.49,  false, 7);

UPDATE public.menu_items SET is_vegetarian = true WHERE name = 'Veg Kebab';

-- ── SHAWARMA ────────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, is_featured, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='shawarma'), 'Chicken Shawarma',   'Succulent chicken grilled and infused with our closely guarded secret sauce, wrapped to perfection.',               7.49, true,  1),
  ((SELECT id FROM categories WHERE slug='shawarma'), 'Lamb Shawarma',      'Slow-roasted lamb layered on a giant skewer, cooked until it falls apart with flavour.',                           8.99, false, 2),
  ((SELECT id FROM categories WHERE slug='shawarma'), 'Lamb & Chicken Mix', 'Can''t decide? Our signature mix of both in one unforgettable wrap.',                                               9.99, false, 3);

-- ── DONNER ──────────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner Kebab',              'Classic seasoned donner with fresh salad and your choice of house sauce.',              6.99, 1),
  ((SELECT id FROM categories WHERE slug='donner'), 'Large Donner',              'A generous, loaded portion of our classic donner. For when regular just won''t do.',    9.49, 2),
  ((SELECT id FROM categories WHERE slug='donner'), 'Tray Donner',               'Donner served in a tray — great for sharing or extra-hungry appetites.',               5.49, 3),
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner & Chicken Tikka',    'The ultimate two-protein combo — rich donner meets charcoal chicken tikka.',           10.99, 4),
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner & Chicken Wings',    'Donner with five juicy charcoal-cooked chicken wings.',                                10.99, 5),
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner & Kobeda',           'Two classics combined on freshly baked naan with salad and sauce.',                    10.99, 6),
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner & Lamb Shawarma',    'Rich donner complemented by slow-roasted lamb shawarma.',                              10.99, 7),
  ((SELECT id FROM categories WHERE slug='donner'), 'Donner & Chicken Shawarma', 'Donner with our secret-sauce chicken shawarma. A pairing made in kebab heaven.',       10.99, 8);

-- ── MIXED COMBOS ────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Shawarma & Kobeda', 'Two of our finest proteins on freshly baked naan with salad and sauce.',  11.99, 1),
  ((SELECT id FROM categories WHERE slug='combos'), 'Lamb Shawarma & Kobeda',    'Premium slow-roasted lamb paired with our handcrafted kobeda.',            11.99, 2),
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Tikka & Kobeda',    'Charcoal chicken tikka alongside our classic kobeda.',                     11.99, 3),
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Wings & Kobeda',    'Crispy charcoal-cooked wings with our handcrafted kobeda.',                11.99, 4),
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Shawarma & Tikka',  'Double chicken — two preparations, one extraordinary plate.',              11.99, 5),
  ((SELECT id FROM categories WHERE slug='combos'), 'Lamb Shawarma & Tikka',     'Premium slow-roasted lamb meets charcoal chicken tikka.',                  11.99, 6),
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Wings & Shawarma',  'Crispy wings alongside rich chicken shawarma, served on naan.',            11.99, 7),
  ((SELECT id FROM categories WHERE slug='combos'), 'Wings & Lamb Shawarma',     'Charcoal wings with premium slow-roasted lamb shawarma.',                  11.99, 8),
  ((SELECT id FROM categories WHERE slug='combos'), 'Chicken Tikka & Wings',     'Charcoal tikka with crispy wings — the ultimate chicken combination.',     11.99, 9);

-- ── MEAL DEALS ──────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='deals'), 'Chicken Shawarma Meal', 'Chicken Shawarma + small chips + soft drink.',      10.99, 1),
  ((SELECT id FROM categories WHERE slug='deals'), 'Lamb Shawarma Meal',    'Lamb Shawarma + small chips + soft drink.',         12.49, 2),
  ((SELECT id FROM categories WHERE slug='deals'), 'Mix Shawarma Meal',     'Mix Shawarma + small chips + soft drink.',          13.49, 3),
  ((SELECT id FROM categories WHERE slug='deals'), 'Single Kobeda Meal',    'Single Kobeda + small chips + soft drink.',         10.99, 4),
  ((SELECT id FROM categories WHERE slug='deals'), 'Double Kobeda Meal',    'Double Kobeda + small chips + soft drink.',         15.49, 5),
  ((SELECT id FROM categories WHERE slug='deals'), 'Chicken Tikka Meal',    'Chicken Tikka + small chips + soft drink.',          9.99, 6),
  ((SELECT id FROM categories WHERE slug='deals'), 'Double Tikka Meal',     'Double Tikka + small chips + soft drink.',          15.99, 7);

-- ── BURGERS ─────────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='burgers'), 'Mediterranean Chicken', 'Slow-cooked Mediterranean chicken with mozzarella on toasted brioche bun. Served with chips.', 6.99, 1),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Slow Cooked Lamb',      'Meltingly tender slow-cooked lamb with aged cheese on premium toasted brioche.',               7.99, 2),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Chicken Fillet Burger', 'Grilled chicken fillet with fresh salad on a toasted brioche bun.',                            6.99, 3),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Classic Cheese Burger', 'Beef burger with melted aged cheddar and our secret burger sauce.',                            6.49, 4),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Vegetarian Burger',     'Crispy golden potato patty with fresh salad on toasted bun.',                                  6.49, 5),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Donner Strip Burger',   'Premium seasoned donner strips with salad and your choice of sauce.',                          6.99, 6),
  ((SELECT id FROM categories WHERE slug='burgers'), 'Chicken Strip Burger',  'Crispy chicken strips with salad and your choice of sauce.',                                    6.99, 7);

UPDATE public.menu_items SET is_vegetarian = true WHERE name = 'Vegetarian Burger';

-- ── PIZZA ───────────────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='pizza'), 'Margherita',        'Classic mozzarella on our hand-stretched stone-baked tomato base.',                                           7.99,  1),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Asian Special',     'Chicken tikka, green & red pepper, sweetcorn, onions, fresh green chilli.',                                   9.99,  2),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Chicken Special',   'Chicken tikka, chicken shawarma, mixed peppers, onions, sweetcorn.',                                          9.99,  3),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Shawarma Pizza',    'Chicken tikka and slow-roasted lamb shawarma on our signature sauce with mozzarella.',                        9.99,  4),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Donner Pizza',      'Generous donner on our rich tomato base with melted mozzarella.',                                             8.99,  5),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Veggie Supreme',    'Peppers, mushroom, sweetcorn, red onion, fresh tomato — generously loaded.',                                  8.49,  6),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Seafood Pizza',     'Tuna, prawns, olives on our stone-baked base.',                                                               9.49,  7),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Pepperoni Classic', 'Premium Italian pepperoni on our rich tomato sauce with stretchy mozzarella.',                               8.49,  8),
  ((SELECT id FROM categories WHERE slug='pizza'), 'BBQ Pepperoni',     'Smoky BBQ base with premium pepperoni and melted mozzarella.',                                               8.49,  9),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Kebab Lab Special', 'Our signature: kobeda, chicken tikka, lamb shawarma & donner — the ultimate Lab creation.',                  10.99, 10),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Meat Feast',        'Mince beef, pepperoni, lamb shawarma, chicken shawarma and donner — no compromises.',                        10.99, 11),
  ((SELECT id FROM categories WHERE slug='pizza'), 'Create Your Own',   'Choose any 5 toppings. Your formula, your rules.',                                                            9.99,  12);

UPDATE public.menu_items SET is_vegetarian = true WHERE name IN ('Margherita', 'Veggie Supreme');
UPDATE public.menu_items SET is_spicy = true WHERE name = 'Asian Special';

-- Pizza variants (10", 12", 14", 16")
INSERT INTO public.menu_variants (item_id, label, price, sort_order)
SELECT m.id, v.label, v.price, v.sort_order
FROM public.menu_items m
CROSS JOIN (VALUES
  ('10"',  0.00, 1),
  ('12"',  2.00, 2),
  ('14"',  5.00, 3),
  ('16"',  8.00, 4)
) AS v(label, price, sort_order)
WHERE m.category_id = (SELECT id FROM categories WHERE slug = 'pizza')
  AND m.name != 'Create Your Own';

-- Create Your Own has higher base prices per size
INSERT INTO public.menu_variants (item_id, label, price, sort_order)
SELECT m.id, v.label, v.price, v.sort_order
FROM public.menu_items m
CROSS JOIN (VALUES
  ('10"',  0.00, 1),
  ('12"',  2.00, 2),
  ('14"',  5.00, 3),
  ('16"', 10.00, 4)
) AS v(label, price, sort_order)
WHERE m.name = 'Create Your Own';

-- ── SHARING PLATTERS ────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='sharing'), 'Kebab Lab Sizzler',     '1 Kobeda, 4pc Chicken Tikka, Wings, Donner on 12" naan with salad & sauce.',                      19.99, 1),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Duo Platter',           'Chicken Shawarma + choice of protein on 14" naan with chips, salad & sauce.',                     24.99, 2),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Lamb Shawarma Platter', 'Lamb & Chicken Shawarma on naan with chips, salad & sauce.',                                      26.99, 3),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Mix Shawarma Platter',  'Mix Shawarma, Tikka, Wings & Lamb Shawarma — the full spread. Serves 2-3.',                      28.99, 4),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Divine Platter',        'Lamb & Chicken Shawarma, chips, donner, salad & sauces. Serves 2.',                               19.99, 5),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Lab Special Platter',   '18" naan: 2 Kobeda, 5 Wings, 4pc Shish, Lamb & Chicken Shawarma, Donner, Chips & Salad.',        38.99, 6),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Sides Platter',         '4 Nuggets, 5 Onion Rings, 10 Wings, Donner, Chips & Sauce. Serves 2-3.',                         13.99, 7),
  ((SELECT id FROM categories WHERE slug='sharing'), 'Jumbo Naan Feast',      'Super jumbo naan loaded with our finest meats, chips, salad & sauces. Serves 5-6.',               49.99, 8);

-- ── SIDES & EXTRAS ──────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='extras'), 'Chips',                 'Golden crispy chips.',                                    2.99, 1),
  ((SELECT id FROM categories WHERE slug='extras'), 'Cheesy Chips',          'Chips smothered in melted cheese.',                       3.99, 2),
  ((SELECT id FROM categories WHERE slug='extras'), 'Rice',                  'Fluffy basmati rice.',                                    1.99, 3),
  ((SELECT id FROM categories WHERE slug='extras'), 'Chicken Strips (4pc)',  'Golden crispy chicken strips.',                           4.99, 4),
  ((SELECT id FROM categories WHERE slug='extras'), 'Onion Rings (8pc)',     'Crispy golden onion rings.',                              3.99, 5),
  ((SELECT id FROM categories WHERE slug='extras'), 'Mozzarella Dippers',   'Five gooey golden mozzarella dippers.',                   3.99, 6),
  ((SELECT id FROM categories WHERE slug='extras'), 'Nuggets & Chips',       'Crispy nuggets with golden chips.',                       5.49, 7),
  ((SELECT id FROM categories WHERE slug='extras'), 'Samosa (2pc)',          'Two crispy golden samosas.',                              4.99, 8),
  ((SELECT id FROM categories WHERE slug='extras'), 'Garlic Bread',          'Clay oven baked garlic bread.',                           4.99, 9),
  ((SELECT id FROM categories WHERE slug='extras'), 'Garlic Bread & Cheese', 'Clay oven garlic bread with mozzarella.',                 5.99, 10),
  ((SELECT id FROM categories WHERE slug='extras'), 'Clay Oven Naan',        'Freshly baked clay oven naan bread.',                     1.99, 11),
  ((SELECT id FROM categories WHERE slug='extras'), 'Side Salad',            'Fresh mixed salad with dressing.',                        1.49, 12),
  ((SELECT id FROM categories WHERE slug='extras'), 'Dips',                  'Chilli · Garlic · Ketchup · Spicy Mayo · Mayo · Mint · BBQ', 0.49, 13);

-- Chips variants (Reg/Large)
INSERT INTO public.menu_variants (item_id, label, price, sort_order)
SELECT m.id, v.label, v.price, v.sort_order
FROM public.menu_items m
CROSS JOIN (VALUES ('Regular', 0.00, 1), ('Large', 1.00, 2)) AS v(label, price, sort_order)
WHERE m.name IN ('Chips', 'Rice') AND m.category_id = (SELECT id FROM categories WHERE slug='extras');

INSERT INTO public.menu_variants (item_id, label, price, sort_order)
SELECT m.id, v.label, v.price, v.sort_order
FROM public.menu_items m
CROSS JOIN (VALUES ('Regular', 0.00, 1), ('Large', 1.00, 2)) AS v(label, price, sort_order)
WHERE m.name = 'Cheesy Chips' AND m.category_id = (SELECT id FROM categories WHERE slug='extras');

UPDATE public.menu_items SET is_vegetarian = true
WHERE name IN ('Chips', 'Cheesy Chips', 'Rice', 'Onion Rings (8pc)', 'Mozzarella Dippers', 'Garlic Bread', 'Garlic Bread & Cheese', 'Clay Oven Naan', 'Side Salad', 'Dips', 'Samosa (2pc)')
AND category_id = (SELECT id FROM categories WHERE slug='extras');

-- ── DRINKS & DESSERT ────────────────────────────────────────────────────────
INSERT INTO public.menu_items (category_id, name, description, base_price, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='drinks'), 'Soft Drink Can',          'Pepsi, 7UP, Tango, or Fanta — your choice.',                                           1.49, 1),
  ((SELECT id FROM categories WHERE slug='drinks'), 'Red Bull',                '250ml energy drink.',                                                                   2.49, 2),
  ((SELECT id FROM categories WHERE slug='drinks'), 'Mineral Water',           '500ml still or sparkling.',                                                             1.49, 3),
  ((SELECT id FROM categories WHERE slug='drinks'), 'Fruit Shoot',             'Kids'' fruit drink — various flavours.',                                                0.99, 4),
  ((SELECT id FROM categories WHERE slug='drinks'), 'Ben & Jerry''s Ice Cream','Caramel Chew Chew · Chocolate Fudge · Strawberry Cheesecake · Cookie Dough',           3.49, 5);

-- Mark featured items
UPDATE public.menu_items SET is_featured = true WHERE name IN (
  'Single Kobeda', 'Chicken Shawarma', 'Lamb Shawarma', 'Kebab Lab Special',
  'Mix Shawarma Platter', 'Chicken Shawarma Meal'
);

-- ── SAMPLE PROMO CODE ────────────────────────────────────────────────────────
INSERT INTO public.promo_codes (code, type, value, min_order, max_uses, is_active) VALUES
  ('WELCOME10', 'percent', 10.00, 12.00, 500, true),
  ('LABFRIEND', 'fixed',    3.00, 15.00, 100, true)
ON CONFLICT (code) DO NOTHING;
