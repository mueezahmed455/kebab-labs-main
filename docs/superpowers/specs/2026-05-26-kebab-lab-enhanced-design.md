# The Kebab Lab — Enhanced Full-Stack Website Design Spec

**Date:** 2026-05-26  
**Status:** Approved  
**Client:** The Kebab Lab, 123 Colne Road, Burnley BB10 1LN  
**Tech Stack:** Next.js 14 App Router · Supabase · Stripe · Resend · Tailwind + shadcn/ui · Zustand · Framer Motion

---

## 1. Overview

A production-ready ordering website for The Kebab Lab built mock-first: all external services (Supabase, Stripe, Resend, Twilio) are wrapped in adapter layers that return mock JSON when env vars are absent and real data when present. Zero code changes needed to go live.

**Brand:** Dark navy (`#0a0f1e`) background · Lime green (`#84cc16`) accent · Bebas Neue display font · Inter body  
**All 16 feature enhancement categories are included** (loyalty, referral, flash deals, social proof, email capture, reviews, animations, smart search, upsells, PWA, combo customizer, favourites, KDS, dynamic wait time, WhatsApp/SMS, analytics, SEO, social sharing).

---

## 2. Build Strategy: Foundation + 5 Parallel Tracks

### Foundation (built first — everything depends on it)
- Next.js 14 App Router scaffold with Tailwind + shadcn/ui
- Design system tokens (navy/lime/Bebas Neue) in `tailwind.config.ts`
- Supabase adapter (real/mock), Stripe adapter (real/mock), Resend adapter (real/mock), Twilio adapter (real/mock)
- Zustand stores: `useCartStore`, `useAuthStore`, `useUIStore`
- Navbar, Footer, MobileNav components
- Auth middleware (protects `/account`, `/admin`, `/kitchen`)
- Error boundaries + Toast system (Sonner)
- Full mock seed data: 12 categories, 70+ menu items, fake orders, fake users, flash deals, loyalty balances
- DB migrations: `001_schema.sql` through `006_enhanced.sql`

### Track 1 — Core Ordering
Homepage · /menu · Item modal · CartDrawer · /order (4-step checkout) · /track/[id] · /account · Auth pages · All base API routes

### Track 2 — Marketing
Loyalty points system · Referral program · Flash deals with countdown timers · Social proof FOMO triggers · Email capture (exit-intent popup + footer form) · Reviews system

### Track 3 — UX & Interactivity
Framer Motion animations (scroll reveal, 3D card tilt, fly-to-cart, page transitions) · Hero particle/ember effect · Fuzzy search with highlight · Dietary/price filters · Smart upsells · Min-order progress bar · PWA (manifest + service worker + push) · Combo customizer · Favourites

### Track 4 — Operations
/kitchen KDS · Dynamic wait time estimates · WhatsApp floating button · SMS/WhatsApp order notifications (Twilio mock) · Enhanced admin analytics dashboard

### Track 5 — SEO & Sharing
Restaurant JSON-LD · Menu item structured data · Dynamic OG images (next/og) · Sitemap.xml + robots.txt · Google My Business deep-link · Social share sheet · Shareable combo links · "I just ordered!" post template

---

## 3. Route Map (30 routes)

### Public Routes
| Route | Description |
|---|---|
| `/` | Homepage — hero, categories, featured items, reviews carousel, how-it-works, flash deal banner |
| `/menu` | Full menu — sticky sidebar, category filter, fuzzy search, dietary filters, item cards |
| `/menu/[slug]` | Menu item detail with OG image (SEO) |
| `/order` | 4-step checkout: cart → delivery/collection → payment → confirm |
| `/order/confirmation/[id]` | Order confirmation page |
| `/track/[orderId]` | Live order tracking with Supabase Realtime stepper |
| `/combo` | Build-Your-Own combo customizer |
| `/combo/[id]` | Shareable combo link with OG preview |
| `/deals` | Active flash deals listing |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | SEO robots file |

### Auth Routes
| Route | Description |
|---|---|
| `/(auth)/login` | Login page |
| `/(auth)/register` | Register with referral code support |
| `/(auth)/forgot-password` | Password reset |
| `/(auth)/callback` | Supabase OAuth callback |

### Account Routes (auth required)
| Route | Description |
|---|---|
| `/account` | Profile + tabs: orders, addresses, loyalty, referral, favourites |
| `/account/orders/[id]` | Single order detail + reorder button |

### Admin Routes (admin role required)
| Route | Description |
|---|---|
| `/admin` | Dashboard with live stats |
| `/admin/orders` | All orders with filters |
| `/admin/orders/[id]` | Single order management |
| `/admin/menu` | Menu item CRUD |
| `/admin/menu/[id]` | Edit single menu item |
| `/admin/analytics` | Enhanced analytics (hourly heatmap, AOV trend, promo performance) |
| `/admin/reviews` | Review moderation queue |
| `/admin/promo` | Promo code management |
| `/admin/flash-deals` | Flash deal CRUD |

### Operations Routes (admin role required)
| Route | Description |
|---|---|
| `/kitchen` | Full-screen KDS — colour-coded by age, tap to complete |

---

## 4. Extended Database Schema

### Base Tables (from CLAUDE.md spec)
`profiles` · `addresses` · `categories` · `menu_items` · `menu_variants` · `option_groups` · `options` · `orders` · `order_items` · `order_status_history` · `promo_codes` · `reviews` · `opening_overrides`

### New Tables (9 additions)
| Table | Purpose |
|---|---|
| `loyalty_points` | Earn/spend log per user (order_id, points, type: earn/spend/expire) |
| `loyalty_tiers` | Regular → Frequent → VIP tier definitions (threshold, multiplier, badge) |
| `referrals` | Referral link tracking (referrer_id, referee_id, credit_amount, status) |
| `flash_deals` | Timed offers (item_id or category, discount, starts_at, ends_at, is_active) |
| `favourites` | User ↔ menu item saves (user_id, item_id) |
| `email_subscribers` | Email capture (email, promo_code, source: popup/footer/checkout) |
| `push_subscriptions` | Web push endpoints (user_id or device fingerprint, endpoint, keys) |
| `kitchen_queue` | KDS state cache (order_id, station, started_at, completed_at) |
| `wait_config` | Single-row admin-set queue load (level: quiet/normal/busy, updated_at) |

---

## 5. Mock Adapter Architecture

Every external service has an adapter module in `src/lib/adapters/`:

```
src/lib/adapters/
├── supabase.ts      # real: @supabase/supabase-js | mock: JSON files in /mock-data/
├── stripe.ts        # real: stripe SDK | mock: returns fake payment intents
├── resend.ts        # real: resend SDK | mock: console.log + returns {id: 'mock-...'}
├── twilio.ts        # real: twilio SDK | mock: console.log notification
└── postcodes.ts     # real: postcodes.io API | mock: hardcoded BB10 area acceptance
```

Detection pattern: `const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL`

Mock data lives in `src/mock-data/`:
- `menu.json` — all 70+ items and 12 categories
- `orders.json` — 10 fake orders in various statuses
- `users.json` — 3 fake customer profiles
- `flash-deals.json` — 2 active deals
- `loyalty.json` — per-user point balances

---

## 6. Key Feature Flows

### Order + Loyalty Points Flow
1. Customer places order (card or COD) → order created with status `pending`
2. Payment confirmed → `loyalty_points` INSERT: `+points` (1pt per £1 spent), `type: earn`
3. At checkout: loyalty balance shown, customer can redeem (£1 per 10pts deducted from total)
4. Redemption: `loyalty_points` INSERT: `-points`, `type: spend`; `orders.discount` updated
5. Tier check runs on each earn: if total lifetime points crosses tier threshold, badge upgrades

### Flash Deal Flow
1. Admin creates deal in `/admin/flash-deals` with start/end datetime and discount
2. `/api/flash-deals/active` returns current active deals (cached 30s with `next: {revalidate: 30}`)
3. Homepage + menu page show deal banner with live countdown timer (client-side)
4. At checkout: deal discount auto-applied if relevant item/category in cart
5. Deal expires: banner disappears, API returns empty, no cart discount

### Referral Flow
1. Customer shares unique link `thekebablabonline.co.uk/register?ref=ABC123`
2. Referee registers → `referrals` row created (status: `pending`)
3. Referee places first order → `referrals.status` → `completed`, both get credits:
   - Referee: promo code for £3 off (auto-applied at checkout)
   - Referrer: £3 credit added to loyalty balance

### Real-time Order Tracking
- Customer lands on `/track/[orderId]`
- Supabase Realtime subscription to `orders` row filtered by `id`
- Status stepper animates on each UPDATE event
- Estimated time counts down (based on `wait_config` + order timestamp)
- Push notification fired when status changes to `ready` or `out_for_delivery`

---

## 7. New API Routes (15 additions to base spec)

| Method | Path | Description |
|---|---|---|
| GET | `/api/flash-deals/active` | Active deals for current time |
| POST | `/api/loyalty/redeem` | Redeem points at checkout |
| GET | `/api/loyalty/balance` | User's current balance + tier |
| POST | `/api/referrals/apply` | Apply referral code on register |
| GET | `/api/referrals/stats` | Referrer's referral history |
| POST | `/api/favourites` | Toggle favourite item |
| GET | `/api/favourites` | Get user's saved items |
| POST | `/api/email-subscribe` | Email capture with promo code |
| POST | `/api/push/subscribe` | Register push subscription |
| POST | `/api/push/notify` | Send push notification (server-side) |
| GET | `/api/combos/[id]` | Get shareable combo by ID |
| POST | `/api/combos` | Save custom combo |
| GET | `/api/admin/kitchen` | Kitchen queue state |
| PATCH | `/api/admin/kitchen/[orderId]` | Update KDS item status |
| GET | `/api/admin/wait-config` | Get current queue load |
| PATCH | `/api/admin/wait-config` | Set queue load level |
| GET | `/api/admin/analytics/enhanced` | Hourly heatmap + AOV + promo stats |
| GET | `/api/og` | Dynamic OG image generation |

---

## 8. Component Architecture

### New Components (beyond base spec)

**Marketing:**
- `FlashDealBanner` — animated countdown banner, auto-show/hide
- `LoyaltyWidget` — points balance + tier badge in account + checkout
- `ReferralShareSheet` — copy link + WhatsApp/SMS share buttons
- `SocialProofToast` — "Someone in Burnley just ordered Kobeda" toast
- `OrderCounter` — animated "47 orders today" on homepage
- `ExitIntentPopup` — email capture modal, fires on mouse leave
- `ReviewsCarousel` — homepage star reviews with Framer Motion

**UX:**
- `ParticleHero` — canvas-based ember/particle effect on hero
- `FuzzySearch` — debounced search with fuse.js, highlight matches
- `DietaryFilterBar` — Vegetarian / Vegan / Spicy / Halal chip filters
- `FlyToCartAnimation` — item thumbnail flies to cart icon on add
- `UpsellChip` — "Add chips for £2?" prompt on item add
- `MinOrderBar` — progress bar "£X more to unlock delivery"
- `ComboBuilder` — visual protein + base + sauce + sides picker
- `HeartButton` — favourite toggle with optimistic UI
- `PWAInstallPrompt` — install banner for iOS/Android

**Operations:**
- `KitchenCard` — order card colour-coded by age (green/amber/red)
- `WaitTimeBadge` — shows current queue load estimate
- `WhatsAppFAB` — floating action button, links to WhatsApp chat

**SEO:**
- `RestaurantJsonLd` — structured data component for root layout
- `MenuItemJsonLd` — per-item schema in item modal/detail page

---

## 9. Animation Plan (Framer Motion)

| Trigger | Animation |
|---|---|
| Page load | `fadeInUp` stagger on hero elements |
| Scroll | `whileInView` reveal on category cards, featured items, review cards |
| Menu card hover | 3D perspective tilt (rotateX/Y on mouse move) |
| Add to cart | Item thumbnail scales up, curves to cart icon position, fades out |
| Cart drawer | Spring-physics slide from right (`type: spring, stiffness: 400`) |
| Flash deal banner | Pulsing lime green glow on countdown |
| Order status step | Scale + fade from grey to lime green on each status advance |
| Page transitions | Crossfade via `AnimatePresence` + `layoutId` |
| Hero particles | Canvas RAF loop, 60fps ember drift |

---

## 10. PWA Configuration

- `public/manifest.json` — name, icons (192x192, 512x512), theme: `#0a0f1e`, display: standalone
- `public/sw.js` — service worker: cache-first for menu (stale-while-revalidate), network-first for orders
- Push notifications via Web Push API + VAPID keys stored in env vars
- Notification triggers: order status change, flash deal alert
- iOS: meta tags for apple-mobile-web-app-capable, apple-touch-icon

---

## 11. SEO Implementation

- `src/app/layout.tsx` — `<RestaurantJsonLd>` schema (Restaurant type, opening hours, address, geo)
- `src/app/menu/[slug]/page.tsx` — `<MenuItemJsonLd>` (MenuItem type, image, price, description)
- `src/app/opengraph-image.tsx` — default OG (restaurant hero)
- `src/app/menu/[slug]/opengraph-image.tsx` — per-item dynamic OG image
- `src/app/combo/[id]/opengraph-image.tsx` — shareable combo OG
- `src/app/sitemap.ts` — all public routes + menu item slugs
- `src/app/robots.ts` — allow all except /admin, /kitchen, /api

---

## 12. Delivery Radius Logic

Using `postcodes.io` (free, no key required):
1. POST `/api/delivery/check` with `{ postcode: "BB9 0AB" }`
2. Geocode postcode → lat/lng
3. Haversine formula against restaurant coords (53.789, -2.247)
4. Return `{ eligible: boolean, distance: number, fee: 1.99 }`
5. Mock: any postcode starting with BB, BL, PR accepted

---

## 13. Testing Strategy

**Unit tests (Vitest):** Zustand store actions, utility functions, adapter mock/real switching, Zod validation schemas  
**Component tests (React Testing Library):** CartDrawer, CheckoutForm, FuzzySearch, LoyaltyWidget  
**E2E tests (Playwright):**
1. Full order flow: browse → add to cart → checkout (COD) → confirmation → tracking
2. Loyalty: earn points on order → see balance → redeem at next checkout
3. Flash deal: deal active → banner shown → discount applied → deal expires → banner gone
4. Auth: register → login → profile → logout
5. Admin: view orders → update status → customer tracking page updates (Realtime)
6. KDS: new order appears → tap complete → order status updates

---

## 14. Performance Targets

- Lighthouse: 90+ all metrics
- LCP < 2.5s (hero image preloaded, ISR on menu)
- Menu data ISR: `revalidate: 300` (5 min cache)
- Flash deals: `revalidate: 30`
- All images via `next/image` with AVIF/WebP
- Edge runtime on: `/api/menu`, `/api/flash-deals/active`, `/api/delivery/check`
- Zustand stores use `persist` middleware with localStorage

---

## 15. Implementation Order

1. **Foundation** — scaffold, design system, adapters, stores, layout components, DB migrations
2. **Tracks 1–5 in parallel** — all 5 tracks build simultaneously once foundation is done
3. **Integration pass** — wire track outputs together (loyalty at checkout, deals on menu, etc.)
4. **Polish pass** — animation tuning, mobile testing, Lighthouse audit
5. **Production wiring** — drop in real env vars, run `supabase db push`, deploy to Vercel
