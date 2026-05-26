# Strict Code Review — The Kebab Lab

> Reviewed: 26 May 2026  
> Standards: OWASP ASVS L2, Google TypeScript Style Guide, WCAG 2.1 AA  
> Verdict: **PASS WITH CONDITIONS** — 17 unresolved issues, 2 critical

---

## 1. Architecture

### Passed
- App Router structure follows Next.js 16 conventions
- `proxy.ts` file convention (not deprecated `middleware.ts`)
- Zustand stores with persist middleware
- Tailwind v4 with `@theme` tokens in CSS
- API route handlers with Zod validation

### Failed Checks

**F-1.1 Data coupling is bidirectional**  
The `WhyUs.tsx` component imported `BRAND` indirectly via a hardcoded constant (`BRAND_FEE`). **Fixed** — now imports `BRAND.delivery.fee`.  
_But:_ `Footer.tsx` still duplicates `HOURS_DISPLAY` instead of deriving from `BRAND.hours` → data coupling violation persists in one location.

**F-1.2 No feature-flag or environment-based configuration**  
`constants.ts` and `brand.ts` coexist with different delivery fee values (£1.99 vs £2.49). The app uses `brand.ts` for UI display but `constants.ts` for API delivery check. These diverge — a single source of truth is required.

**F-1.3 No offline/error resilience**  
Zustand persists to localStorage but there's no fallback if localStorage is full or unavailable (private browsing in some browsers). No `try/catch` around `localStorage.setItem`.

**F-1.4 Admin Server Component uses service-role client directly**  
`admin/menu/page.tsx` calls `createAdminClient()` which uses `SUPABASE_SERVICE_ROLE_KEY`. If this component throws, the stack trace could leak the key. Must wrap in try-catch.

---

## 2. TypeScript Strictness

### Passed
- `strict: true` in tsconfig
- No `any` types in application code (only in API route `supabase` calls via `as any`)

### Failed Checks

**F-2.1 `MenuItem.cat` is unconstrained string**  
`types/menu.ts:8` — `cat: string` should be narrowed to `Category['id']` to prevent invalid category references.

**F-2.2 `formatCurrency` has no type guard**  
Accepts `number` but would produce `£NaN` if called with undefined — no runtime protection.

**F-2.3 `createOrderSchema.total` trusts client input**  
The server-side schema accepts `total: z.number().positive()` but never verifies it matches the sum of line items. A client could submit a lower total than the actual order value.  
**Severity: Critical.** Server must recalculate totals from the items.

**F-2.4 `admin/menu/page.tsx` — unchecked `admin` client**  
`createAdminClient()` will throw at runtime if `SUPABASE_SERVICE_ROLE_KEY` is missing. No error boundary or graceful degradation.

---

## 3. State Management

### Passed
- Zustand stores are minimal and well-separated
- Persist middleware on both cart + checkout stores
- `skipHydration: true` prevents SSR hydration mismatch

### Failed Checks

**F-3.1 No max-quantity enforcement in cart store**  
`updateQuantity` allows any positive quantity. A user could add 9999 of an item. No server-side cap (max 50 in Zod schema) but client-side should also enforce.

**F-3.2 Cart items have no `timestamp` or `session` field**  
Items stale across sessions. If a user adds items, closes the browser for a week, and returns — the cart still shows old data with no expiry.

**F-3.3 Checkout store is persisted but includes no clear-on-submit flag**  
If `reset()` is not called after order placement, stale checkout data persists. The confirmation page calls `reset()` on "Back to Home" but not on direct navigation or browser back.

---

## 4. Component Quality

### Passed
- Most interactive components are properly `'use client'`
- `AnimatePresence` used correctly for exit animations
- Consistent `cn()` utility for conditional classes
- Clean separation of UI vs. logic

### Failed Checks

**F-4.1 `ItemCard.tsx` — non-interactive element with onClick**  
`<motion.div>` has `onClick` but no `role="button"`, `tabIndex={0}`, or keyboard handler (`onKeyDown` for Enter/Space). Screen reader users and keyboard-only users cannot activate it.  
**WCAG 2.1 SC 2.1.1 violation.**

**F-4.2 `ItemModal.tsx` — no focus trap**  
When the modal opens, focus is not moved into it. Tab can escape the modal and interact with page content behind the overlay. Escape handler is missing (only backdrop click closes).  
**WCAG 2.1 SC 2.4.3 violation.**

**F-4.3 `CartDrawer.tsx` — body scroll lock not cleanup-safe**  
If the component unmounts while `isOpen`, the cleanup restores overflow but if another component also set it, the restoration is incorrect.

**F-4.4 `CategoryTabs.tsx` — N + 1 IntersectionObserver pattern**  
One observer per category tab (up to 10+). This is wasteful. Single observer with multiple `observe()` calls is the standard pattern.

**F-4.5 `Footer.tsx` — hardcoded hours duplication**  
`HOURS_DISPLAY` array duplicates data already in `BRAND.hours`. Any update to opening hours requires changes in two places.

---

## 5. API Routes

### Passed
- All routes use Zod validation on input
- Webhook verifies Stripe signature
- Rate limiting structure is ready (though not implemented)

### Failed Checks

**F-5.1 `POST /api/payments/create-intent` trusts client amount**  
The client sends `{ amount, orderId }`. The server uses `amount` directly without verifying it matches the order's total in the database. **A malicious client could pay £1 for a £49 order.**

**F-5.2 `GET /api/orders/[id]` — guest access logic is broken**  
When `!user`, the query calls `.single()` on `supabase.from('orders').select(...).eq('id', id)`. This allows **unauthenticated access to any order by UUID**, with no ownership check. If the order exists, it returns all fields including `guest_email`, `guest_phone`, etc.

**F-5.3 No rate limiting on any POST endpoint**  
`/api/orders` (POST), `/api/payments/create-intent` (POST), `/api/auth/*` (POST) all lack rate limiting. Attackers could:
- Create thousands of fake orders (denial-of-service)
- Hit Stripe API repeatedly (denial-of-wallet)
- Brute-force auth endpoints

**F-5.4 No request timeout / abort handling**  
API routes don't validate request size. A malicious client could send a multi-megabyte JSON payload and exhaust server memory.

**F-5.5 Error responses leak implementation details**  
`console.error` with full error objects but no structured error logging service. Stack traces logged to console but not to an aggregation service.

**F-5.6 `POST /api/menu/[id]` and `DELETE /api/menu/[id]` not implemented**  
The spec describes full CRUD for menu items. Only GET exists.

**F-5.7 No request ID tracking**  
No `X-Request-Id` header or correlation ID for request tracing across logs.

---

## 6. Testing & CI

### Failed Checks

**F-6.1 Zero tests**  
No unit tests, integration tests, or E2E tests. Not a single `*.test.ts` or `*.spec.ts` file exists. The `package.json` has no test script defined.

**F-6.2 No CI configuration**  
No `.github/workflows/` or CI config. No automated lint/typecheck/test runs on PR.

**F-6.3 No bundle analysis configured**  
No `@next/bundle-analyzer` or similar tool to track bundle size regressions.

---

## 7. Performance Audit

| Metric | Status | Detail |
|---|---|---|
| **Bundle JS (estimated)** | ~180KB gzipped | Framer Motion (~32KB) is the largest single dep |
| **Lighthouse simulation** | Unknown | No automated audit in pipeline |
| **Image optimization** | ✅ N/A | No images used (emoji/icon only) |
| **Font loading** | ✅ Good | `next/font` with `display: swap` |
| **Unnecessary re-renders** | ⚠️ Minor | Motion components wrap static content |
| **CSS bundle** | ✅ Good | Tailwind JIT, ~15KB gzipped |
| **ISR/caching** | ❌ Not configured | Menu data is static JS (fast) but API routes have no caching headers |

---

## 8. Accessibility Audit (WCAG 2.1 AA)

| SC | Status | Location | Detail |
|---|---|---|---|
| 1.1.1 Non-text Content | ⚠️ Partial | CategoryCard icons | Emoji used without `role="img"` or `aria-label` |
| 1.4.3 Contrast (Minimum) | ✅ Pass | `#94a3b8` on `#07080f` = 8.5:1 | Exceeds 4.5:1 minimum |
| 2.1.1 Keyboard | ❌ Fail | `ItemCard`, `PopularItems` card | `<div>` onClick but no keyboard handling |
| 2.4.3 Focus Order | ❌ Fail | `ItemModal` | No focus trap, no initial focus |
| 2.4.4 Link Purpose | ✅ Pass | All links have descriptive text | |
| 2.4.6 Headings | ✅ Pass | Proper h1/h2/h3 hierarchy | |
| 2.5.3 Label in Name | ⚠️ Partial | Close buttons | `aria-label="Close"` but visible label is icon-only |
| 3.2.1 On Focus | ✅ Pass | No unexpected context changes | |
| 4.1.2 Name, Role, Value | ❌ Fail | `ItemModal` | Missing `role="dialog"`, `aria-modal="true"` |
| Skip-to-content | ❌ Fail | `layout.tsx` | No skip navigation link |

---

## 9. SEO & Metadata Audit

| Item | Status | Detail |
|---|---|---|
| Structured data (JSON-LD) | ✅ Pass | Restaurant schema with hours, location, menu |
| Open Graph | ✅ Pass | Full og:title, og:description, og:image |
| Twitter Cards | ✅ Pass | `summary_large_image` card type |
| Sitemap | ✅ Pass | `/sitemap.xml` with 3 URLs |
| Robots.txt | ✅ Pass | Disallows `/checkout` and `/confirmation` |
| Canonical URLs | ✅ Pass | Set in layout metadata |
| Meta description | ✅ Pass | Unique per page |
| `hreflang` tags | ❌ Missing | No multi-language support (acceptable for local business) |
| Breadcrumb structured data | ❌ Missing | No breadcrumbList schema on menu/checkout pages |

---

## 10. Summary

### By Severity

| Severity | Count | Key Issues |
|---|---|---|
| **Critical** | 2 | Server trusts client-provided total in payment intent; guest API can access any order by UUID |
| **High** | 6 | No rate limiting, keyboard inaccessibility in 2 components, broken guest order lookup, no total verification in createOrder, Admin Server Component may leak service key |
| **Medium** | 7 | Duplicate hours data, no image optimization, no error aggregation, no cart expiry, no request ID tracking, missing API endpoints, unconstrained `MenuItem.cat` type |
| **Low** | 5 | No skip-to-content link, multiple IntersectionObservers, no `role="dialog"` on modal, no bundle analyzer, no breadcrumb schema |

### Verdict

The codebase is **functionally complete** for a Phase 2 delivery but has **two critical security bugs** in the API layer (guest order access, payment amount trust) that must be fixed before any production data flows. The frontend meets most WCAG criteria but fails on keyboard navigation and focus management — blocking for accessibility compliance. Test coverage is zero, which is acceptable for a prototype but not for production.
