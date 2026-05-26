# Code Review: The Kebab Lab

> Review date: 26 May 2026  
> Scope: All source files under `src/`  
> Project phase: Frontend UI complete (Phase 2 of ~5), backend not yet built

---

## Table of Contents

1. [Architecture & Structure](#1-architecture--structure)
2. [Code Quality Issues](#2-code-quality-issues)
3. [Performance](#3-performance)
4. [Accessibility](#4-accessibility)
5. [Consistency & Standards](#5-consistency--standards)
6. [Missing Features](#6-missing-features)
7. [Summary](#7-summary)

---

## 1. Architecture & Structure

### Strengths

- **Clean separation of concerns**: Pages in `src/app/`, components in `src/components/` (grouped by domain), lib utilities in `src/lib/`, types in `src/types/`. Follows Next.js App Router conventions well.
- **Zustand state management**: Lightweight, performant, and well-structured. The cart store (`cartStore.ts`) and checkout store (`checkoutStore.ts`) have clear APIs.
- **Tailwind v4 with CSS-based config**: Modern approach using `@theme` in `globals.css` instead of `tailwind.config.ts`. Consistent with Tailwind v4 best practices.
- **Static menu data pattern**: Hardcoded `MENU_ITEMS` and `CATEGORIES` in `menu.ts` is appropriate for Phase 1 — avoids database dependency during frontend development.
- **Good SEO fundamentals**: Proper metadata API usage, JSON-LD structured data (Restaurant schema), sitemap, robots.txt, Open Graph tags.

### Weaknesses

- **No API routes yet**: All 20+ endpoints listed in the spec (`/api/orders`, `/api/payments`, `/api/admin/*`, etc.) are unimplemented. This means the app is entirely static/frontend-only with no real backend integration.
- **No database layer**: Supabase client libraries not installed. No migrations, RLS, or seed data in the project.
- **No middleware**: No auth middleware to protect routes.
- **No auth system**: No login/register pages, no session management, no route protection.
- **No error boundaries**: Missing `error.tsx`, `not-found.tsx`, and global error handling.
- **No loading states**: Missing `loading.tsx` files for page transitions (except confirmation page's Suspense fallback).

---

## 2. Code Quality Issues

### CRITICAL

#### 2.1 `isOpenNow()` logic bug (`src/lib/utils/isOpen.ts:7`)

```ts
return mins >= 960 || mins <= 40
```

The function returns `true` when `mins <= 40` (between midnight and 12:40 AM) for **any** day except Tuesday. However, this midnight-to-12:40 AM window belongs to the **previous day's** service. Since Tuesday is fully closed, the early hours of Wednesday (12:01 AM – 12:40 AM) would **incorrectly** report as open.

**Fix**: Track the previous day's schedule when evaluating the `mins <= 40` window, or restructure to use proper date-aware opening hours logic.

#### 2.2 Non-cryptographic order reference generation (`src/app/checkout/page.tsx:110`)

```ts
String(Math.floor(Math.random() * 9000) + 1000)
```

Uses `Math.random()` for order references. Not cryptographically secure. Should use `crypto.randomUUID()` or a server-generated sequential ID. Also, the order reference format is 4 digits, allowing only 9,000 possible values — trivial to guess or enumerate.

**Fix**: Use `crypto.randomUUID()` for generation, or better yet, have the server generate references.

#### 2.3 Confirmation page relies on URL params (`src/app/confirmation/page.tsx`)

Order details (`ref`, `total`, `type`) are passed via URL search params. This means:
- Anyone can forge a confirmation page with a fake total
- Anyone who sees the URL (shoulder surfing, browser history) sees the order total
- No server-side verification of the order reference

**Fix**: Fetch order details from the server using a stored order ID.

### HIGH

#### 2.4 Duplicate `CartItem` type definition

`CartItem` is defined in **two places**:
- `src/types/menu.ts:27-35` — has `categoryId` but NOT `price`
- `src/lib/store/cartStore.ts:6-14` — has `price` but NOT `categoryId`

The type in `types/menu.ts` is never actually used (components import from `cartStore.ts`). This is confusing and could lead to subtle bugs.

**Fix**: Remove the unused `CartItem` from `types/menu.ts` and keep only the canonical definition in `cartStore.ts`.

#### 2.5 Hardcoded `BRAND_FEE` in `WhyUs.tsx`

```ts
const BRAND_FEE = 2.49  // src/components/home/WhyUs.tsx:5
```

This duplicates `BRAND.delivery.fee` from `brand.ts`. The `WhyUs` component also uses `BRAND.delivery.minimumOrder` and `BRAND.delivery.freeOver` via props... wait, it doesn't — it uses `BRAND_FEE`. This is a fragmentation source.

**Fix**: Import and use `BRAND.delivery.fee` directly.

#### 2.6 Delivery config inconsistency with spec

| Setting | Code (`brand.ts`) | Spec (`CLAUDE.md` env vars) |
|---|---|---|
| Delivery fee | £2.49 | £1.99 |
| Minimum order | £12 | £12 |
| Free over | £25 | Not specified |

The code and spec disagree on the delivery fee. One of them is wrong.

#### 2.7 Menu categories don't match spec

The spec lists **Garlic Bread** and **Ice Cream** as separate top-level categories with their own slugs. In the code, they're folded into "Sides & Extras" and "Drinks & Dessert" respectively. This may be intentional (UX simplification) but should be documented.

#### 2.8 Menu prices marked up from spec

Most menu items are priced ~£0.50–£1.50 higher in code than the spec. E.g., Single Kobeda: £6.00 (spec) vs £6.99 (code). Verify these are intentional pricing decisions.

### MEDIUM

#### 2.9 `formatPhone` fragile regex (`src/lib/utils/formatting.ts:5-7`)

```ts
return phone.replace(/(\d{5})(\d{6})/, '$1 $2')
```

UK phone numbers vary in format (4+6, 5+5, 5+6). The regex assumes 5+6 format which works for `01282 454626` but will fail for other UK number patterns.

**Fix**: A more robust formatter or simply display the raw number.

#### 2.10 Missing validation for price display locale

`formatCurrency` uses `toFixed(2)` which is correct for GBP. However, this doesn't handle locale-specific formatting (e.g., thousands separators for large numbers like £49.99 — not a current issue but worth noting).

#### 2.11 `next.config.ts` is minimal

Only configures `turbopack` root. Missing:
- `images.remotePatterns` (for when food images are added)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Redirects/rewrites
- `headers()` async function for security headers

#### 2.12 CSS variables in globals.css not referenced in @theme

```css
:root {
  --glow-green: 0 0 40px rgba(132, 204, 22, 0.15);
  --shadow-card: 0 20px 60px rgba(0, 0, 0, 0.5);
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-green: rgba(132, 204, 22, 0.25);
}
```

These CSS custom properties are mixed with Tailwind theme tokens but are NOT declared in the `@theme` block. They're used via `var(--glow-green)` in class names. This works but is inconsistent — ideally these should either be utility classes or theme tokens.

#### 2.13 `eslint.config.mjs` references possibly incorrect imports

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

These exports may not exist in the installed `eslint-config-next` package (the standard Next.js ESLint config works differently). Verify the lint command runs successfully.

#### 2.14 `CategoryTabs.tsx` — multiple IntersectionObserver instances

Each category section creates its own `IntersectionObserver` instance (up to 12 observers). This is wasteful. A single observer with multiple observed elements would be more efficient.

**Fix**: Use one `IntersectionObserver` observing all sections.

### LOW

#### 2.15 `CategoryTabs.tsx` — scrollTabIntoView called inside observer callback

```ts
if (entry.isIntersecting) {
  setActiveId(section.id)
  scrollTabIntoView(section.id)  // This auto-scrolls the tab bar
}
```

Auto-scrolling the tab bar when the user is scrolling through sections could be jarring for users. Consider only updating the active indicator without forcing the tab scroll position.

#### 2.16 `CartDrawer.tsx` — Escape key listener not cleaned up on unmount

The `useEffect` for Escape key adds and removes the listener when `isOpen` changes, but if the component unmounts while `isOpen` is `true`, the listener won't be cleaned up (until the next open/close cycle).

**Fix**: Add the dependency array correctly — the return function runs on unmount regardless.

#### 2.17 `Navbar.tsx` — open/closed polling every 60 seconds

Polls `isOpenNow()` every 60s. For a restaurant open 4PM–12:40AM, checking every 60s is unnecessary. Checking on page focus or on specific time thresholds would be more efficient.

#### 2.18 `package.json` scripts section

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

Missing `typecheck` script (`tsc --noEmit`), `test` script, and `format` script. Adding these would standardize the development workflow.

#### 2.19 No `.env.example` file

There's no `.env.example` documenting required environment variables. Developers need to cross-reference the CLAUDE.md spec to know what to configure.

---

## 3. Performance

| Area | Status | Notes |
|---|---|---|
| **Bundle size** | Good | Only necessary libraries (React, Next, Framer Motion, Zustand, Zod) |
| **Framer Motion** | Moderate concern | Used for many small animations; could increase JS bundle. Consider CSS animations for trivial cases |
| **Image optimization** | Not applicable | No actual images used — all emoji/icons |
| **Font loading** | Good | Uses `next/font/google` with `display: swap` |
| **CSS** | Good | Tailwind JIT only generates used CSS |
| **Re-renders** | Good | Zustand stores provide granular subscriptions |
| **IntersectionObserver** | Minor issue | Multiple observer instances (see 2.14) |
| **Static data** | Good | Menu data is static JS object — no fetch overhead |

---

## 4. Accessibility

| Element | Status | Notes |
|---|---|---|
| `aria-label` on cart button | ✅ | Present |
| `aria-label` on mobile menu | ✅ | Present |
| `aria-label` on search input | ✅ | Present (with role="search") |
| `aria-hidden` on decorative orbs | ✅ | Present |
| `role="tablist"` / `role="tab"` | ✅ | On category tabs |
| `aria-selected` on tabs | ✅ | Present |
| Skip to content link | ❌ | Missing |
| Focus management in modal | ⚠️ | ItemModal opens but focus is not trapped, no focus restoration on close |
| Keyboard navigation | ⚠️ | Modal `onClose` on Escape not implemented (only backdrop click) |
| Color contrast | ⚠️ | `#94a3b8` (brand-muted) on `#07080f` (brand-dark) gives ~8.5:1 — good. `#475569` (brand-dim) is ~6.5:1 on dark — OK for large text |
| Heading hierarchy | ✅ | Good use of h1/h2/h3 |

---

## 5. Consistency & Standards

### Good Practices

- TypeScript strict mode enabled
- Consistent naming conventions (PascalCase for components, camelCase for functions/variables)
- Consistent `cn()` utility pattern for conditional classes
- Clean import ordering
- Proper use of `'use client'` boundary — only in interactive components
- Good use of semantic HTML (section, nav, footer, main)
- Consistent brand color token usage

### Issues

- **5.1** `WhyUs.tsx` uses a local `BRAND_FEE` constant instead of importing from `brand.ts`
- **5.2** Menu items in `menu.ts` use emoji for icons in the data layer, which mixes presentation with data
- **5.3** No consistent pattern for handling loading/empty/error states across the app
- **5.4** `Types/menu.ts` has an unused `CartItem` export that shadows the store's `CartItem`

---

## 6. Missing Features (vs Spec)

The CLAUDE.md spec describes a full-stack application. Here's what's **not yet built**:

### Backend (Not Started)
| Feature | Spec Reference |
|---|---|
| Supabase database & migrations | `supabase/migrations/` |
| RLS policies | `supabase/migrations/002_rls.sql` |
| Seed data | `supabase/migrations/003_seed.sql` |
| API routes (20+ endpoints) | `src/api/` |
| Supabase client libraries | `src/lib/supabase/` |
| Stripe integration | `src/lib/stripe.ts`, `src/api/payments/` |
| Resend email | `src/lib/resend.ts` |

### Auth (Not Started)
| Feature | Spec Reference |
|---|---|
| Login / Register pages | `src/app/(auth)/` |
| Auth middleware | `src/middleware.ts` |
| Session management | `src/hooks/useAuth.ts` |

### Pages (Not Started)
| Feature | Spec Reference |
|---|---|
| Order history | `src/app/account/` |
| Order tracking | `src/app/track/[orderId]` |
| Admin dashboard | `src/app/admin/` |

### Components (Not Started)
| Feature | Spec Reference |
|---|---|
| CheckoutForm, DeliveryForm, PaymentForm | `src/components/checkout/` |
| OrderTracker, OrderStatusBadge, OrderCard | `src/components/order/` |
| Admin components | `src/components/admin/` |
| Realtime hooks | `src/hooks/useRealtime.ts` |

---

## 7. Summary

### Overall Assessment: ✅ **Good foundation, incomplete backend**

The frontend codebase is well-structured, follows modern Next.js 16 and Tailwind v4 conventions, and demonstrates strong attention to UX, design consistency, and SEO. The Zustand state management is clean. The component architecture is logical and maintainable.

### Critical Fixes Needed (before production)

| Priority | Issue | File |
|---|---|---|
| 🔴 Critical | `isOpenNow()` returns incorrect result for early morning hours after closed days | `src/lib/utils/isOpen.ts:7` |
| 🔴 Critical | Order reference generation uses insecure `Math.random()` | `src/app/checkout/page.tsx:110` |
| 🔴 Critical | Confirmation page trusts URL params instead of server data | `src/app/confirmation/page.tsx` |
| 🟠 High | Duplicate/conflicting `CartItem` type definitions | `types/menu.ts` + `cartStore.ts` |
| 🟠 High | Hardcoded `BRAND_FEE` duplicating `brand.ts` | `src/components/home/WhyUs.tsx:5` |
| 🟠 High | Delivery fee mismatch between code and spec | `brand.ts` vs `CLAUDE.md` |

### Recommendations

1. **Address the `isOpenNow` bug** before any production deployment — incorrect open/closed display erodes customer trust.
2. **Move order reference generation to the server** when API routes are built.
3. **Remove redundant/conflicting code** (duplicate types, hardcoded constants).
4. **Add `.env.example`** for developer onboarding.
5. **Add error boundaries and loading states** before going live.
6. **Implement security headers in `next.config.ts`** before deployment.
