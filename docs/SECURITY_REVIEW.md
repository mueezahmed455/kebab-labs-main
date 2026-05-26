# Strict Security Review — The Kebab Lab

> Reviewed: 26 May 2026  
> Standard: OWASP ASVS L2 (Application Security Verification Standard Level 2)  
> Methodology: Manual code review, dependency audit, attack surface mapping

---

## 1. Executive Summary

**Overall Risk Rating: MEDIUM** (upgraded from previous LOW due to newly built API layer)

The frontend is well-hardened (CSP, HSTS, proper React escaping). However, the newly introduced API layer in this session contains **2 critical vulnerabilities**, **3 high-severity issues**, and lacks fundamental security controls like rate limiting, request validation, and proper access control on certain endpoints.

### Risk Distribution

| Layer | Rating | Risk Drivers |
|---|---|---|
| Client-side (Browser) | 🟢 Low | CSP active, React escaping, no DOM XSS |
| API Routes | 🔴 Critical | Broken guest access, client-trusted amounts, no rate limiting |
| Auth | 🟡 Medium | Login page exists but no rate limiting, no CSRF token |
| Database (Supabase) | 🟢 Low | RLS configured in migrations, parameterised queries |
| Dependencies | 🟡 Medium | 2 moderate vulnerabilities from `npm audit`, no Dependabot |
| Configuration | 🟢 Low | CSP + HSTS + security headers all configured |

---

## 2. Critical Findings

### C-01: Unauthenticated Order Access (`/api/orders/[id]`)

**File**: `src/app/api/orders/[id]/route.ts:14-26`  
**Severity**: 🔴 Critical  
**OWASP**: A01 (Broken Access Control)

The guest access path:
```typescript
if (!user) {
  query.single()
}
```

When `user` is null (unauthenticated request), `.single()` is called on a query that only filters by `id` — **no user_id filter**. This means:
- Anyone can look up any order by UUID
- Returns `guest_email`, `guest_phone`, `guest_name`, delivery address, items ordered
- No rate limiting to prevent enumeration attacks (UUIDs are unguessable but sequential-like)

**Fix**: Remove the guest access path entirely or require an `order_number` (public, non-UUID identifier) with a separate API route.

### C-02: Client-Trusted Payment Amount (`/api/payments/create-intent`)

**File**: `src/app/api/payments/create-intent/route.ts:16-28`  
**Severity**: 🔴 Critical  
**OWASP**: A04 (Insecure Design)

```typescript
const { amount } = parsed.data  // From client request body
const amountInPence = Math.round(amount * 100)
const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInPence,  // Client-provided amount!
})
```

The server does NOT look up the order in the database to verify the amount matches. A client can:
- Create an order for £49.99
- Call `/api/payments/create-intent` with `amount: 0.01`
- Pay £0.01 instead of £49.99

**Fix**: Fetch the order from the database using `orderId`, verify `order.total === amount`, and only then create the Stripe payment intent.

---

## 3. High Severity Findings

### H-01: No Rate Limiting on Any POST Endpoint

**Files**: `/api/orders` (POST), `/api/payments/create-intent` (POST), `/api/payments/webhook` (POST)  
**Severity**: 🟠 High  
**OWASP**: A04 (Insecure Design)

Attack scenarios:
- **Order spam**: Create 10,000 orders via automated script → fills database, skews analytics
- **Denial-of-wallet**: Repeated calls to `/api/payments/create-intent` create Stripe PaymentIntents that may incur fees
- **Auth brute force**: `/api/auth/*` POST endpoints have no attempt limiting

**Fix**: Implement rate limiting with `@upstash/ratelimit` (Vercel Edge) or a simple in-memory sliding window for MVP.

### H-02: Service Role Key in Server Component

**File**: `src/app/admin/menu/page.tsx:9`  
**Severity**: 🟠 High  
**OWASP**: A05 (Security Misconfiguration)

```typescript
const admin = await createAdminClient()
```

`createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY` which has full database access. If this Server Component:
- Throws an error → the stack trace could appear in development error overlay
- Is SSRed with user-controlled data → potential for the key to be exposed in error responses

**Fix**: Wrap all admin page data fetching in try-catch blocks. Never let `createAdminClient` errors propagate to the error boundary.

### H-03: No CSRF Protection on Auth Endpoints

**File**: `src/app/(auth)/login/page.tsx`  
**Severity**: 🟠 High  
**OWASP**: A01 (Broken Access Control)

The login form submits a POST to Supabase Auth. There is no CSRF token or `SameSite=Strict` cookie protection on the auth flow. A third-party site could:
- Embed a form that auto-submits to the Supabase auth endpoint
- If the user is already logged into Supabase in another tab, the cross-origin request could succeed

**Fix**: Add `SameSite=Strict` to auth cookies (handled by Supabase SDK), add a CSRF token to the login form.

---

## 4. Medium Severity Findings

### M-01: Payment Webhook Lacks Order Verification

**File**: `src/app/api/payments/webhook/route.ts:27-41`  
**Severity**: 🟡 Medium

The webhook handler updates the order's `payment_status` based on `stripe_payment_intent` matching. This is correct but:
- No check that the PaymentIntent's `amount` matches `order.total`
- No idempotency key handling (replayed webhook events could cause double-processing)

### M-02: Proxy Matcher Excludes Too Broadly

**File**: `src/proxy.ts:8-11`  
**Severity**: 🟡 Medium

The matcher regex allows the proxy to run on all routes except static files. However:
- API routes are NOT excluded from the proxy — every API call goes through auth session refresh
- Static file exclusion pattern could be bypassed

### M-03: Error Responses Leak Internal Structure

**All API routes**  
**Severity**: 🟡 Medium

Errors return `{ error: string }` consistently, which is good. However:
- Zod validation errors (`flatten()`) expose schema internals (field names, expected types)
- In development mode, Next.js error overlay exposes full stack traces

### M-04: No Input Size Limiting on API Routes

**All POST/PATCH API routes**  
**Severity**: 🟡 Medium

No `request.json()` size limits. A client could send a 100MB payload to any API endpoint and exhaust server memory. Next.js `bodyParser` size limit should be configured or a manual check added.

### M-05: EU GDPR Compliance Gaps

**Severity**: 🟡 Medium

The application collects `name`, `phone`, `email`, and `address` from customers. The following gaps exist:
- No privacy policy page or consent checkbox on checkout
- No cookie consent banner (Zustand localStorage does not require consent under UK PECR guidance, but Supabase Auth uses cookies)
- No data deletion mechanism or account settings page

---

## 5. Low Severity Findings

### L-01: UK Phone Regex is Too Permissive

**File**: `src/lib/validations.ts:3-6`  
**Severity**: 🟢 Low

```typescript
/^(?:(?:\+44)|(?:0))(?:\d\s?){9,10}$/
```

This accepts `01234567890` (11 digits after 0, when UK max is 10) and `0 1 2 3 4 5 6 7 8 9` (single digits separated by spaces). No leading-zero area code validation.

### L-02: No `X-Content-Type-Options` on API Error Responses

**All API routes**  
**Severity**: 🟢 Low

While set globally via `next.config.ts` headers, if an API route returns a response with incorrect `Content-Type`, the browser could MIME-sniff.

### L-03: No Security.txt

**Severity**: 🟢 Low

No `/.well-known/security.txt` for security researchers to report vulnerabilities.

### L-04: X-Powered-By Disabled but Framework Still Detectable

**Severity**: 🟢 Low

`poweredByHeader: false` is set. However, framework detection via response patterns (JS chunk naming, error page HTML structure) is still possible.

### L-05: npm Audit Shows 2 Moderate Vulnerabilities

**Severity**: 🟢 Low

| Package | Issue | Fix |
|---|---|---|
| `postcss` (transitive via Next.js) | XSS via unescaped `</style>` | Upstream fix in Next.js 16.3+ |
| — | — | Next.js team working on update |

---

## 6. Attack Surface Map (Updated)

```
┌──────────────────────────────────────────┐
│             PUBLIC INTERNET              │
└──────────────────────────────────────┬───┘
                                       │
                        ┌──────────────┴──────────────┐
                        │     PROXY (src/proxy.ts)     │
                        │  Auth session refresh        │
                        │  Route protection (/admin)   │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
     ┌────────┴────────┐     ┌─────────┴─────────┐     ┌──────┴──────┐
     │  FRONTEND PAGES │     │   API ROUTES       │     │  STATIC    │
     │  /menu /checkout│     │  /api/*            │     │  /public/  │
     │  /confirmation  │     │  16 handlers       │     │            │
     └────────┬────────┘     └─────────┬─────────┘     └─────────────┘
              │                        │
              │              ┌─────────┴─────────┐
              │              │  Zod Validation    │
              │              │  layer (present)   │
              │              └─────────┬─────────┘
              │                        │
     ┌────────┴────────┐     ┌─────────┴─────────┐
     │  Zustand stores │     │  Supabase Client   │
     │  (localStorage) │     │  (parameterised)   │
     └─────────────────┘     └────────────────────┘
```

### Vulnerability Density by Endpoint

| Endpoint | Method(s) | Vulns | Risk | Priority |
|---|---|---|---|---|
| `/api/orders/[id]` | GET | C-01 | 🔴 Critical | Fix immediately |
| `/api/payments/create-intent` | POST | C-02, H-01 | 🔴 Critical | Fix immediately |
| `/api/orders` | POST | H-01, M-04 | 🟠 High | Fix before launch |
| `/api/orders/[id]/status` | PATCH | H-01, M-04 | 🟠 High | Fix before launch |
| `/api/payments/webhook` | POST | M-01, H-01 | 🟡 Medium | Fix before launch |
| `/api/delivery/check` | POST | H-01 | 🟡 Medium | Fix before launch |
| `/api/auth/*` | GET/POST | H-03, H-01 | 🟠 High | Fix before launch |
| `/api/admin/*` | GET | H-02, H-01 | 🟠 High | Fix before launch |
| `/api/menu/*` | GET | — | 🟢 Low | No issues found |
| All pages (client) | GET | — | 🟢 Low | CSP active |

---

## 7. OWASP ASVS L2 Compliance

| ASVS Category | Coverage | Gaps |
|---|---|---|
| **V1: Architecture** | 60% | Missing threat model, no security documentation |
| **V2: Authentication** | 40% | Missing rate limiting, no MFA, no account lockout |
| **V3: Session Management** | 50% | No session timeout, no secure cookie flags verified |
| **V4: Access Control** | 30% | C-01 (broken guest access), H-02 (admin key exposure) |
| **V5: Validation** | 70% | Zod on all endpoints, but M-04 (no size limiting) |
| **V6: Storage** | 50% | LocalStorage for cart only ✅ but no encryption of PII at rest |
| **V7: Cryptography** | 80% | CSP, HSTS configured. Missing Subresource Integrity on CDN resources |
| **V8: Error Handling** | 40% | Consistent format but Zod errors leak schema details |
| **V9: Logging** | 10% | `console.error` only — no structured logging, no aggregation |
| **V10: Communications** | 80% | HSTS, HTTPS enforced by Vercel. Missing certificate transparency |
| **V11: Business Logic** | 30% | C-02 (payment bypass via client amount) |
| **V12: Files** | 0% | No file upload implemented yet |
| **V13: API** | 50% | No rate limiting, no request size limits, no CORS per-route |
| **V14: Configuration** | 70% | CSP + HSTS present. Missing `X-Permitted-Cross-Domain-Policies` |

**Overall ASVS L2 Coverage: ~52%** — Below the 80% threshold required for certification.

---

## 8. Remediation Plan (Priority Order)

| # | Finding | Effort | Fix |
|---|---|---|---|
| 1 | **C-02**: Client-trusted payment amount | 30 min | Fetch order from DB, compare total |
| 2 | **C-01**: Guest order access by UUID | 15 min | Require auth or use order_number lookup |
| 3 | **H-01**: No rate limiting | 2 hrs | Add @upstash/ratelimit or in-memory limiter |
| 4 | **H-02**: Admin service key exposure | 15 min | try-catch in admin Server Component |
| 5 | **H-03**: No CSRF on auth | 1 hr | Add SameSite cookies, CSRF token to form |
| 6 | **M-01**: Webhook amount verification | 30 min | Verify amount before updating payment |
| 7 | **M-04**: Request size limiting | 15 min | Add request size check in API routes |
| 8 | **M-02**: Tighten proxy matcher | 10 min | Exclude API routes from proxy matcher |
| 9 | **M-05**: GDPR compliance | 4 hrs | Privacy policy, consent, deletion mechanism |
| 10 | **L-01**: Phone regex | 10 min | Use Google's libphonenumber or stricter regex |

**Estimated total effort: ~9 hours** for all 10 items.
