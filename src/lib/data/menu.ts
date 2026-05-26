import type { Category, MenuItem } from '@/types/menu'

export const CATEGORIES: Category[] = [
  { id: 'kebabs',   name: 'Kebabs',           icon: '🥙', accentColor: '#ea580c', description: 'Served with naan/chips or wrap, fresh salad & sauce' },
  { id: 'shawarma', name: 'Shawarma',          icon: '🌯', accentColor: '#9333ea', description: 'Slow-roasted meats infused with secret sauces' },
  { id: 'donner',   name: 'Donner',            icon: '🍖', accentColor: '#dc2626', description: 'Classic seasoned donner, various combos' },
  { id: 'combos',   name: 'Mixed Combos',      icon: '🔥', accentColor: '#d97706', description: 'Two proteins, one extraordinary plate' },
  { id: 'deals',    name: 'Meal Deals',        icon: '🎉', accentColor: '#16a34a', description: 'Great value combinations with chips & drink' },
  { id: 'burgers',  name: 'Burgers',           icon: '🍔', accentColor: '#ca8a04', description: 'Served with chips, fresh salad & sauce' },
  { id: 'pizza',    name: 'Pizza',             icon: '🍕', accentColor: '#e11d48', description: 'Stone-baked, available 10" to 16"' },
  { id: 'sharing',  name: 'Sharing Platters',  icon: '🤝', accentColor: '#0891b2', description: 'Perfect for groups, loaded with the best' },
  { id: 'extras',   name: 'Sides & Extras',    icon: '🍟', accentColor: '#b45309', description: 'Chips, dips, garlic bread and more' },
  { id: 'drinks',   name: 'Drinks & Dessert',  icon: '🥤', accentColor: '#1d4ed8', description: 'Cold drinks and Ben & Jerry\'s ice cream' },
]

export const MENU_ITEMS: MenuItem[] = [
  // ── KEBABS ──────────────────────────────────────────────────────────────
  { id: 'k1', cat: 'kebabs', name: 'Single Kobeda',       desc: 'Hand-crafted minced beef with our signature Middle Eastern spice blend, flame-grilled over fiery clay oven coals.',    price: 6.99,  badge: "Chef's Pick" },
  { id: 'k2', cat: 'kebabs', name: 'Double Kobeda',       desc: 'Double the signature kobeda for serious kebab lovers. Our most popular indulgence.',                                    price: 12.99 },
  { id: 'k3', cat: 'kebabs', name: 'Cheesy Kobeda Bites', desc: 'Tender minced beef with melted marmur cheese, spiced and charcoal-cooked to perfection.',                              price: 7.99,  badge: 'Popular' },
  { id: 'k4', cat: 'kebabs', name: 'Chicken Tikka',       desc: 'Lean chicken breast marinated in our secret sauce, skewered and cooked over charcoal.',                                price: 6.99 },
  { id: 'k5', cat: 'kebabs', name: 'Double Chicken Tikka',desc: 'Double portion of our legendary charcoal-cooked chicken tikka.',                                                        price: 12.99, badge: 'Best Value' },
  { id: 'k6', cat: 'kebabs', name: 'Chicken Wings (5pc)', desc: 'Five juicy wings marinated in our secret sauce, charcoal-cooked until perfectly crisp.',                               price: 5.99 },
  { id: 'k7', cat: 'kebabs', name: 'Veg Kebab',           desc: 'Lightly spiced potato blended with caramelised onions and dried herbs, authentic Middle Eastern taste.',               price: 5.49,  vegetarian: true },

  // ── SHAWARMA ────────────────────────────────────────────────────────────
  { id: 's1', cat: 'shawarma', name: 'Chicken Shawarma',    desc: 'Succulent chicken grilled and infused with our closely guarded secret sauce, wrapped to perfection.',               price: 7.49 },
  { id: 's2', cat: 'shawarma', name: 'Lamb Shawarma',       desc: 'Slow-roasted lamb layered on a giant skewer, cooked until it falls apart with flavour.',                           price: 8.99,  badge: 'Premium' },
  { id: 's3', cat: 'shawarma', name: 'Lamb & Chicken Mix',  desc: "Can't decide? Our signature mix of both in one unforgettable wrap.",                                               price: 9.99,  badge: 'Popular' },

  // ── DONNER ──────────────────────────────────────────────────────────────
  { id: 'd1', cat: 'donner', name: 'Donner Kebab',              desc: 'Classic seasoned donner with fresh salad and your choice of house sauce.',                                     price: 6.99 },
  { id: 'd2', cat: 'donner', name: 'Large Donner',              desc: "A generous, loaded portion of our classic donner. For when regular just won't do.",                           price: 9.49 },
  { id: 'd3', cat: 'donner', name: 'Tray Donner',               desc: 'Donner served in a tray — great for sharing or extra-hungry appetites.',                                      price: 5.49 },
  { id: 'd4', cat: 'donner', name: 'Donner & Chicken Tikka',    desc: 'The ultimate two-protein combo — rich donner meets charcoal chicken tikka.',                                  price: 10.99, badge: 'Popular' },
  { id: 'd5', cat: 'donner', name: 'Donner & Chicken Wings',    desc: 'Donner with five juicy charcoal-cooked chicken wings.',                                                        price: 10.99 },
  { id: 'd6', cat: 'donner', name: 'Donner & Kobeda',           desc: 'Two classics combined on freshly baked naan with salad and sauce.',                                           price: 10.99 },
  { id: 'd7', cat: 'donner', name: 'Donner & Lamb Shawarma',    desc: 'Rich donner complemented by slow-roasted lamb shawarma.',                                                      price: 10.99 },
  { id: 'd8', cat: 'donner', name: 'Donner & Chicken Shawarma', desc: 'Donner with our secret-sauce chicken shawarma. A pairing made in kebab heaven.',                              price: 10.99 },

  // ── COMBOS ──────────────────────────────────────────────────────────────
  { id: 'c1', cat: 'combos', name: 'Chicken Shawarma & Kobeda',   desc: 'Two of our finest proteins on freshly baked naan with salad and sauce.',            price: 11.99 },
  { id: 'c2', cat: 'combos', name: 'Lamb Shawarma & Kobeda',      desc: 'Premium slow-roasted lamb paired with our handcrafted kobeda.',                      price: 11.99, badge: 'Staff Pick' },
  { id: 'c3', cat: 'combos', name: 'Chicken Tikka & Kobeda',      desc: 'Charcoal chicken tikka alongside our classic kobeda.',                               price: 11.99 },
  { id: 'c4', cat: 'combos', name: 'Chicken Wings & Kobeda',      desc: 'Crispy charcoal-cooked wings with our handcrafted kobeda.',                          price: 11.99 },
  { id: 'c5', cat: 'combos', name: 'Chicken Shawarma & Tikka',    desc: 'Double chicken — two preparations, one extraordinary plate.',                        price: 11.99 },
  { id: 'c6', cat: 'combos', name: 'Lamb Shawarma & Tikka',       desc: 'Premium slow-roasted lamb meets charcoal chicken tikka.',                            price: 11.99, badge: 'Popular' },
  { id: 'c7', cat: 'combos', name: 'Chicken Wings & Shawarma',    desc: 'Crispy wings alongside rich chicken shawarma, served on naan.',                      price: 11.99 },
  { id: 'c8', cat: 'combos', name: 'Wings & Lamb Shawarma',       desc: 'Charcoal wings with premium slow-roasted lamb shawarma.',                            price: 11.99 },
  { id: 'c9', cat: 'combos', name: 'Chicken Tikka & Wings',       desc: 'Charcoal tikka with crispy wings — the ultimate chicken combination.',               price: 11.99 },

  // ── MEAL DEALS ──────────────────────────────────────────────────────────
  { id: 'm1', cat: 'deals', name: 'Chicken Shawarma Meal', desc: 'Chicken Shawarma + small chips + soft drink.',      price: 10.99, badge: 'Great Value' },
  { id: 'm2', cat: 'deals', name: 'Lamb Shawarma Meal',    desc: 'Lamb Shawarma + small chips + soft drink.',         price: 12.49 },
  { id: 'm3', cat: 'deals', name: 'Mix Shawarma Meal',     desc: 'Mix Shawarma + small chips + soft drink.',          price: 13.49, badge: 'Popular' },
  { id: 'm4', cat: 'deals', name: 'Single Kobeda Meal',    desc: 'Single Kobeda + small chips + soft drink.',         price: 10.99 },
  { id: 'm5', cat: 'deals', name: 'Double Kobeda Meal',    desc: 'Double Kobeda + small chips + soft drink.',         price: 15.49, badge: 'Best Value' },
  { id: 'm6', cat: 'deals', name: 'Chicken Tikka Meal',    desc: 'Chicken Tikka + small chips + soft drink.',         price: 9.99 },
  { id: 'm7', cat: 'deals', name: 'Double Tikka Meal',     desc: 'Double Tikka + small chips + soft drink.',          price: 15.99 },

  // ── BURGERS ─────────────────────────────────────────────────────────────
  { id: 'b1', cat: 'burgers', name: 'Mediterranean Chicken', desc: 'Slow-cooked Mediterranean chicken with mozzarella on toasted brioche bun. Served with chips.',               price: 6.99, badge: 'Popular' },
  { id: 'b2', cat: 'burgers', name: 'Slow Cooked Lamb',      desc: 'Meltingly tender slow-cooked lamb with aged cheese on premium toasted brioche.',                             price: 7.99, badge: 'Premium' },
  { id: 'b3', cat: 'burgers', name: 'Chicken Fillet Burger', desc: 'Grilled chicken fillet with fresh salad on a toasted brioche bun.',                                          price: 6.99 },
  { id: 'b4', cat: 'burgers', name: 'Classic Cheese Burger', desc: 'Beef burger with melted aged cheddar and our secret burger sauce.',                                          price: 6.49 },
  { id: 'b5', cat: 'burgers', name: 'Vegetarian Burger',     desc: 'Crispy golden potato patty with fresh salad on toasted bun.',                                                price: 6.49, vegetarian: true },
  { id: 'b6', cat: 'burgers', name: 'Donner Strip Burger',   desc: 'Premium seasoned donner strips with salad and your choice of sauce.',                                        price: 6.99 },
  { id: 'b7', cat: 'burgers', name: 'Chicken Strip Burger',  desc: 'Crispy chicken strips with salad and your choice of sauce.',                                                  price: 6.99 },

  // ── PIZZA ───────────────────────────────────────────────────────────────
  { id: 'p1',  cat: 'pizza', name: 'Margherita',           desc: 'Classic mozzarella on our hand-stretched stone-baked tomato base.',                                            price: 7.99,  vegetarian: true, sizes: [{ label: '10"', price: 7.99 }, { label: '12"', price: 9.99 }, { label: '14"', price: 12.99 }, { label: '16"', price: 15.99 }] },
  { id: 'p2',  cat: 'pizza', name: 'Asian Special',        desc: 'Chicken tikka, green & red pepper, sweetcorn, onions, fresh green chilli.',                                   price: 9.99,  spicy: true, sizes: [{ label: '10"', price: 9.99 }, { label: '12"', price: 12.99 }, { label: '14"', price: 15.99 }, { label: '16"', price: 18.99 }] },
  { id: 'p3',  cat: 'pizza', name: 'Chicken Special',      desc: 'Chicken tikka, chicken shawarma, mixed peppers, onions, sweetcorn.',                                          price: 9.99,  badge: 'Popular', sizes: [{ label: '10"', price: 9.99 }, { label: '12"', price: 12.99 }, { label: '14"', price: 15.99 }, { label: '16"', price: 18.99 }] },
  { id: 'p4',  cat: 'pizza', name: 'Shawarma Pizza',       desc: 'Chicken tikka and slow-roasted lamb shawarma on our signature sauce with mozzarella.',                       price: 9.99,  badge: 'Signature', sizes: [{ label: '10"', price: 9.99 }, { label: '12"', price: 12.99 }, { label: '14"', price: 15.99 }, { label: '16"', price: 18.99 }] },
  { id: 'p5',  cat: 'pizza', name: 'Donner Pizza',         desc: 'Generous donner on our rich tomato base with melted mozzarella.',                                             price: 8.99,  sizes: [{ label: '10"', price: 8.99 }, { label: '12"', price: 11.99 }, { label: '14"', price: 14.99 }, { label: '16"', price: 17.99 }] },
  { id: 'p6',  cat: 'pizza', name: 'Veggie Supreme',       desc: 'Peppers, mushroom, sweetcorn, red onion, fresh tomato — generously loaded.',                                  price: 8.49,  vegetarian: true, sizes: [{ label: '10"', price: 8.49 }, { label: '12"', price: 10.99 }, { label: '14"', price: 13.49 }, { label: '16"', price: 16.99 }] },
  { id: 'p7',  cat: 'pizza', name: 'Seafood Pizza',        desc: 'Tuna, prawns, olives on our stone-baked base.',                                                               price: 9.49,  sizes: [{ label: '10"', price: 9.49 }, { label: '12"', price: 12.49 }, { label: '14"', price: 15.49 }, { label: '16"', price: 18.49 }] },
  { id: 'p8',  cat: 'pizza', name: 'Pepperoni Classic',    desc: 'Premium Italian pepperoni on our rich tomato sauce with stretchy mozzarella.',                               price: 8.49,  sizes: [{ label: '10"', price: 8.49 }, { label: '12"', price: 10.99 }, { label: '14"', price: 13.49 }, { label: '16"', price: 16.99 }] },
  { id: 'p9',  cat: 'pizza', name: 'BBQ Pepperoni',        desc: 'Smoky BBQ base with premium pepperoni and melted mozzarella.',                                               price: 8.49,  sizes: [{ label: '10"', price: 8.49 }, { label: '12"', price: 10.99 }, { label: '14"', price: 13.49 }, { label: '16"', price: 16.99 }] },
  { id: 'p10', cat: 'pizza', name: 'Kebab Lab Special',    desc: 'Our signature: kobeda, chicken tikka, lamb shawarma & donner — the ultimate Lab creation.',                  price: 10.99, badge: '🏆 Signature', sizes: [{ label: '10"', price: 10.99 }, { label: '12"', price: 13.99 }, { label: '14"', price: 16.99 }, { label: '16"', price: 19.99 }] },
  { id: 'p11', cat: 'pizza', name: 'Meat Feast',           desc: 'Mince beef, pepperoni, lamb shawarma, chicken shawarma and donner — no compromises.',                        price: 10.99, badge: 'Loaded', sizes: [{ label: '10"', price: 10.99 }, { label: '12"', price: 13.99 }, { label: '14"', price: 15.99 }, { label: '16"', price: 18.99 }] },
  { id: 'p12', cat: 'pizza', name: 'Create Your Own',      desc: 'Choose any 5 toppings. Your formula, your rules.',                                                            price: 9.99,  badge: 'Custom', sizes: [{ label: '10"', price: 9.99 }, { label: '12"', price: 12.99 }, { label: '14"', price: 15.99 }, { label: '16"', price: 19.99 }] },

  // ── SHARING PLATTERS ────────────────────────────────────────────────────
  { id: 'sp1', cat: 'sharing', name: 'Kebab Lab Sizzler',     desc: '1 Kobeda, 4pc Chicken Tikka, Wings, Donner on 12" naan with salad & sauce.',                      price: 19.99, badge: 'Serves 1-2' },
  { id: 'sp2', cat: 'sharing', name: 'Duo Platter',           desc: 'Chicken Shawarma + choice of protein on 14" naan with chips, salad & sauce.',                     price: 24.99, badge: 'Serves 2' },
  { id: 'sp3', cat: 'sharing', name: 'Lamb Shawarma Platter', desc: 'Lamb & Chicken Shawarma on naan with chips, salad & sauce.',                                      price: 26.99 },
  { id: 'sp4', cat: 'sharing', name: 'Mix Shawarma Platter',  desc: 'Mix Shawarma, Tikka, Wings & Lamb Shawarma — the full spread. Serves 2-3.',                      price: 28.99, badge: 'Popular' },
  { id: 'sp5', cat: 'sharing', name: 'Divine Platter',        desc: 'Lamb & Chicken Shawarma, chips, donner, salad & sauces. Serves 2.',                               price: 19.99 },
  { id: 'sp6', cat: 'sharing', name: 'Lab Special Platter',   desc: '18" naan: 2 Kobeda, 5 Wings, 4pc Shish, Lamb & Chicken Shawarma, Donner, Chips & Salad.',        price: 38.99, badge: '🔥 Serves 4-5' },
  { id: 'sp7', cat: 'sharing', name: 'Sides Platter',         desc: '4 Nuggets, 5 Onion Rings, 10 Wings, Donner, Chips & Sauce. Serves 2-3.',                         price: 13.99 },
  { id: 'sp8', cat: 'sharing', name: 'Jumbo Naan Feast',      desc: 'Super jumbo naan loaded with our finest meats, chips, salad & sauces. Serves 5-6.',               price: 49.99, badge: '🏆 Serves 5-6' },

  // ── SIDES & EXTRAS ──────────────────────────────────────────────────────
  { id: 'e1',  cat: 'extras', name: 'Chips',                 desc: 'Golden crispy chips.',                                  price: 2.99, sizes: [{ label: 'Regular', price: 2.99 }, { label: 'Large', price: 3.99 }] },
  { id: 'e2',  cat: 'extras', name: 'Cheesy Chips',          desc: 'Chips smothered in melted cheese.',                     price: 3.99, sizes: [{ label: 'Regular', price: 3.99 }, { label: 'Large', price: 4.99 }] },
  { id: 'e3',  cat: 'extras', name: 'Rice',                  desc: 'Fluffy basmati rice.',                                  price: 1.99, sizes: [{ label: 'Regular', price: 1.99 }, { label: 'Large', price: 2.99 }] },
  { id: 'e4',  cat: 'extras', name: 'Chicken Strips (4pc)',  desc: 'Golden crispy chicken strips.',                         price: 4.99 },
  { id: 'e5',  cat: 'extras', name: 'Onion Rings (8pc)',     desc: 'Crispy golden onion rings.',                            price: 3.99 },
  { id: 'e6',  cat: 'extras', name: 'Mozzarella Dippers',   desc: 'Five gooey golden mozzarella dippers.',                 price: 3.99 },
  { id: 'e7',  cat: 'extras', name: 'Nuggets & Chips',       desc: 'Crispy nuggets with golden chips.',                     price: 5.49 },
  { id: 'e8',  cat: 'extras', name: 'Samosa (2pc)',          desc: 'Two crispy golden samosas.',                            price: 4.99 },
  { id: 'e9',  cat: 'extras', name: 'Garlic Bread',          desc: 'Clay oven baked garlic bread.',                         price: 4.99, sizes: [{ label: '10"', price: 4.99 }, { label: '12"', price: 6.99 }, { label: '14"', price: 8.99 }, { label: '16"', price: 10.99 }] },
  { id: 'e10', cat: 'extras', name: 'Garlic Bread & Cheese', desc: 'Clay oven garlic bread with mozzarella.',               price: 5.99, sizes: [{ label: '10"', price: 5.99 }, { label: '12"', price: 7.99 }, { label: '14"', price: 9.99 }, { label: '16"', price: 11.99 }] },
  { id: 'e11', cat: 'extras', name: 'Clay Oven Naan',        desc: 'Freshly baked clay oven naan bread.',                   price: 1.99 },
  { id: 'e12', cat: 'extras', name: 'Side Salad',            desc: 'Fresh mixed salad with dressing.',                      price: 1.49 },
  { id: 'e13', cat: 'extras', name: 'Dips',                  desc: 'Chilli · Garlic · Ketchup · Spicy Mayo · Mayo · Mint · BBQ', price: 0.49 },

  // ── DRINKS & DESSERT ────────────────────────────────────────────────────
  { id: 'dr1', cat: 'drinks', name: 'Soft Drink Can',           desc: 'Pepsi, 7UP, Tango, or Fanta — your choice.',              price: 1.49 },
  { id: 'dr2', cat: 'drinks', name: 'Red Bull',                 desc: '250ml energy drink.',                                      price: 2.49 },
  { id: 'dr3', cat: 'drinks', name: 'Mineral Water',            desc: '500ml still or sparkling.',                                price: 1.49 },
  { id: 'dr4', cat: 'drinks', name: 'Fruit Shoot',              desc: "Kids' fruit drink — various flavours.",                    price: 0.99 },
  { id: 'dr5', cat: 'drinks', name: "Ben & Jerry's Ice Cream",  desc: 'Caramel Chew Chew · Chocolate Fudge · Strawberry Cheesecake · Cookie Dough', price: 3.49, badge: 'Dessert' },
]

export const POPULAR_ITEM_IDS = ['k1', 's2', 's3', 'p10', 'sp4', 'm1']
