# Security Review: The Kebab Lab

> Review date: 26 May 2026  
> Scope: All source files under `src/` plus config files  
> Methodology: Manual code review + static analysis

---

## Table of Contents

1. [Risk Summary](#1-risk-summary)
2. [Findings by Severity](#2-findings-by-severity)
3. [Attack Surface Analysis](#3-attack-surface-analysis)
4. [OWASP Top 10 Coverage](#4-owasp-top-10-coverage)
5. [Security Posture by Layer](#5-security-posture-by-layer)
6. [Recommendations](#6-recommendations)

---

## 1. Risk Summary

The codebase is currently **frontend-only** with no backend, database, authentication, or payment integration. This significantly reduces the current attack surface — there are **no live API endpoints, no user sessions, and no stored data** to compromise.

| Domain | Risk Level | Notes |
|---|---|---|
| Client-side (React/Next.js) | 🟢 Low | Proper React escaping, minimal `dangerouslySetInnerHTML` usage |
| State management (Zustand) | 🟢 Low | Client-side only, localStorage for persistence |
| Third-party dependencies | 🟡 Medium | Outdated/deprecated dependencies possible |
| Build/CI pipeline | 🟢 Low | No CI configured yet |
| Configuration | 🟡 Medium | Missing security headers, no CSP |
| **Backend/API** | **⚪ Not present** | No attack surface yet — but will need attention when built |

**Overall Current Risk: Low** (will increase significantly when API routes, auth, and payments are added)

---

## 2. Findings by Severity

### 🔴 CRITICAL (0)

No critical security vulnerabilities found in the current codebase. All findings relate to issues that will become critical once the backend is built.

### 🟠 HIGH (1)

#### H-01: `dangerouslySetInnerHTML` with insufficient sanitization

**File**: `src/app/layout.tsx:39`  
**Code**:
```tsx
function safeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/<\//g, '<\\/')
}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
```

**Risk**: The `safeJsonLd` function escapes `</` sequences to prevent JSON-LD injection, but this is a minimalist sanitization. While the input is a hardcoded object (no user data), this pattern could be copied elsewhere with user-controlled data.

**Mitigation**: Current mitigation (hardcoded object + `</` escaping) is sufficient for the current use case. However, document that this function must NEVER be used with user-supplied data.

**Recommendation**: If user data ever needs to appear in JSON-LD, use a proper JSON serializer (like `serialize-javascript`) instead of a custom regex replacement.

### 🟡 MEDIUM (4)

#### M-01: No Content Security Policy (CSP)

**File**: `next.config.ts`  
**Status**: Not configured

There are no Content-Security-Policy headers configured. This means:
- XSS vulnerabilities would be fully exploitable
- No restrictions on inline scripts
- No restrictions on external resource loading
- No frame-src restrictions (potential clickjacking)

**Recommendation**: Add CSP headers via Next.js `headers()` in `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src 'self' https://js.stripe.com;" },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ]
}
```

#### M-02: No HTTPS/SSL enforcement

**File**: `next.config.ts`  
**Status**: Not configured

While Vercel handles HTTPS termination by default, there's no HSTS header configured. Without it, a man-in-the-middle could downgrade a first-time visitor to HTTP.

**Recommendation**: Add `Strict-Transport-Security` header with a reasonable `max-age` (e.g., 1 year) and `includeSubDomains`.

#### M-03: No rate limiting readiness

**File**: Not applicable (no API routes yet)

When API routes are added (especially POST `/api/orders`), there's no rate limiting mechanism in place. This could allow:
- Order spam / fake order creation
- Brute-force attacks on auth endpoints
- Denial-of-wallet via Stripe payment attempts

**Recommendation**: Plan for rate limiting using Vercel's Edge middleware or a library like `@upstash/ratelimit` before deploying API routes.

#### M-04: `.env.example` not provided

**File**: Not present

The `.gitignore` blocks all `.env*` files (security best practice ✅), but there's no `.env.example` to document what environment variables are needed. This creates risk of developers committing actual values or misconfiguring the app.

**Recommendation**: Create `.env.example` with placeholder values for all required env vars (as documented in `CLAUDE.md`).

### 🟢 LOW (5)

#### L-01: `X-Powered-By` header

Next.js serves `X-Powered-By: Next.js` by default. While not a vulnerability, it advertises the framework being used, which can help attackers narrow their exploit search.

#### L-02: No security.txt

There's no `/.well-known/security.txt` for security researchers to report vulnerabilities.

#### L-03: No rate limiting on `isOpenNow` polling

The Navbar polls `isOpenNow()` every 60 seconds. While trivial, this is unnecessary computation. Not a real vulnerability.

#### L-04: Sensitive data in URL params

**File**: `src/app/checkout/page.tsx` → `src/app/confirmation/page.tsx`

Order reference and total are passed as URL search params. This means:
- Browser history stores the order total
- Users copy-pasting URLs share order details
- Not exploitable in itself, but a privacy concern

#### L-05: No dependency audit

`package-lock.json` exists but there's no record of recent `npm audit` runs. Some transitive dependencies may have known vulnerabilities.

**Recommendation**: Run `npm audit` before production deployment and fix or document any findings.

---

## 3. Attack Surface Analysis

### Current Attack Surface (Frontend Only)

```
┌─────────────────────────────────────┐
│  Client-Side (Browser)              │
│  ┌───────────────────────────────┐  │
│  │ React App                     │  │
│  │ - Rendered JSX (XSS-safe)     │  │
│  │ - Zustand localStorage        │  │
│  │ - External fonts (Google)     │  │
│  │ - Framermotion CDN            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         ▼ (Future)
┌─────────────────────────────────────┐
│  API Routes (Not Yet Built)         │
│  - /api/orders  POST/GET           │
│  - /api/payments/*                  │
│  - /api/auth/*                      │
│  - /api/admin/*                     │
└─────────────────────────────────────┘
```

### Future Attack Surface (When Backend Is Added)

| Entry Point | Risk | Mitigations Needed |
|---|---|---|
| POST `/api/orders` | Input validation, SQL injection, rate limiting | Zod schemas, Supabase parameterized queries, UPSTASH rate limiting |
| POST `/api/payments/create-intent` | Stripe API key exposure, price manipulation | Server-only keys, server-side price calc |
| POST `/api/payments/webhook` | Webhook forgery | Stripe signature verification |
| Auth endpoints | Brute force, session hijacking | Rate limiting, Supabase Auth built-in protection |
| Admin endpoints | Privilege escalation | RLS policies, role-based access, middleware checks |
| Supabase Realtime | Unauthorized subscription | RLS policies on realtime publication |
| Image upload (future) | Malicious file upload | Supabase Storage RLS, file type validation |

---

## 4. OWASP Top 10 (2021) Coverage

| OWASP Category | Current Status | Notes |
|---|---|---|
| **A01: Broken Access Control** | 🟢 Low risk | No auth yet — will need admin middleware + RLS |
| **A02: Cryptographic Failures** | 🟢 Low risk | No sensitive data stored client-side; `Math.random()` for order refs is not crypto but not a vulnerability currently |
| **A03: Injection** | 🟢 Low risk | React auto-escapes XSS; `dangerouslySetInnerHTML` is controlled; no SQL surfaces yet |
| **A04: Insecure Design** | 🟡 Medium | Missing rate limiting, no security headers, no error handling |
| **A05: Security Misconfiguration** | 🟡 Medium | No CSP, no HSTS, no security headers in next.config |
| **A06: Vulnerable Components** | 🟡 Medium | `npm audit` not run; dependency versions not pinned |
| **A07: Auth Failures** | 🟢 Not applicable | No auth yet |
| **A08: Integrity Failures** | 🟢 Low risk | No CI/CD pipeline with malicious dependency risk |
| **A09: Logging Failures** | 🟢 Not applicable | No backend logging yet |
| **A10: SSRF** | 🟢 Not applicable | No server-side fetch functionality |

---

## 5. Security Posture by Layer

### 5.1 Client Security (React/Next.js)

| Aspect | Rating | Details |
|---|---|---|
| XSS Protection | ✅ Strong | React JSX escapes by default |
| CSRF Protection | ✅ Built-in | Next.js Server Actions have built-in CSRF |
| Sensitive Data Exposure | ⚠️ Minor | Order total in URL params |
| Dependency Risk | ⚠️ Untested | `npm audit` not run |
| `dangerouslySetInnerHTML` | ✅ Controlled | Only for JSON-LD, hardcoded content |

### 5.2 Configuration Security

| Aspect | Rating | Details |
|---|---|---|
| CSP Headers | ❌ Missing | Not configured |
| HSTS | ❌ Missing | Not configured |
| Permissions Policy | ❌ Missing | Not configured |
| CORS Policy | ❌ Not needed yet | Will need when API routes are added |
| Secure Cookie Config | ⚪ N/A | No cookies set yet |

### 5.3 Data Security

| Aspect | Rating | Details |
|---|---|---|
| LocalStorage | ✅ Good | Cart data only — no PII, tokens, or secrets |
| Form Data | ⚠️ In-transit only | Checkout form data not submitted to server yet |
| Password Storage | ⚪ N/A | Supabase Auth handles this when implemented |
| Payment Data | ⚪ N/A | Stripe Elements handles PCI DSS compliance |

### 5.4 Infrastructure

| Aspect | Rating | Details |
|---|---|---|
| Secrets Management | ✅ Good | `.env*` files gitignored; only `NEXT_PUBLIC_*` exposed |
| Vercel Deployment | ⚠️ Not configured | Will auto-handle HTTPS, need to configure headers |
| Supabase Security | ⚪ Not configured | RLS not yet deployed |

---

## 6. Recommendations

### Before API Routes & Auth Deployment (Critical Path)

1. **Add security headers** (`next.config.ts`):
   - Content-Security-Policy
   - Strict-Transport-Security (HSTS)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy (restrict camera, microphone, etc.)

2. **Choose and set up rate limiting**:
   - Vercel Edge middleware + Upstash, or
   - Vercel WAF rules (if on Pro plan)

3. **Server-side input validation**:
   - Reuse the Zod schemas from the checkout page server-side
   - Never trust client-provided prices in order creation

4. **CORS configuration**:
   - Restrict API route origins to the production domain only

### Before Stripe Integration

5. **Webhook signature verification**:
   - Always verify `stripe-signature` header on `/api/payments/webhook`
   - Use raw request body for verification

6. **Server-side price calculation**:
   - Never trust client-provided prices
   - Recalculate totals server-side from the menu database
   - Store `stripe_payment_intent` on orders for idempotency

### Before Admin Dashboard

7. **Admin middleware**:
   - Protect all `/admin/*` routes with middleware checking `role = 'admin'`
   - Double-check with RLS at the database level
   - Log all admin actions

### Before Going Live

8. **Set up proper error handling**:
   - Generic error pages (no stack traces exposed)
   - Structured API error responses (no internal details leaked)

9. **Audit dependencies**:
   - Run `npm audit` and fix or suppress findings
   - Pin exact dependency versions in `package.json`

10. **Environment variable audit**:
    - Create `.env.example` with all required variables
    - Verify `NEXT_PUBLIC_*` prefix is only used for safe-to-expose values

11. **Security.txt**:
    - Create `.well-known/security.txt` for vulnerability reporting

---

## Quick Wins (Can Implement Now)

| Action | Effort | Impact |
|---|---|---|
| Add CSP + HSTS headers to `next.config.ts` | 15 min | 🟢 High |
| Create `.env.example` | 10 min | 🟢 Medium |
| Run `npm audit` and document findings | 5 min | 🟢 Medium |
| Fix `Math.random()` → `crypto.randomUUID()` in checkout | 5 min | 🟢 Low (mitigates future risk) |
| Add `Permissions-Policy` header | 5 min | 🟢 Low |
