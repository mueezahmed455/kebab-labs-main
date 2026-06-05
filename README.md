# The Kebab Lab

Clay oven specialist kebab takeaway at 123 Colne Road, Burnley, BB10 1LN.

Order authentic kebabs, shawarma, pizzas, burgers and more online with Apple Pay and card payments powered by Square.

## Features

- **Full Menu Browser:** 80+ items across 12 categories with quick-add and deep customization.
- **Admin Dashboard:** Real-time order management, analytics overview, and menu control.
- **Advanced Analytics:** Local-first conversion funnel tracking, popular items, and revenue data.
- **Cinematic UI:** 3D hero visuals, particle canvas, and cursor glow effects.
- **Accessibility Panel:** High contrast mode, font scaling, and dyslexia-friendly typography.
- **Smart Checkout:** Square payment integration (card + Apple Pay) with receipt generation.
- **Order Tracking:** Persistent status tracking with receipt codes.
- **Upsell Engine:** Contextual "Perfect Match" suggestions based on cart contents.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Payments:** Square Web Payments SDK
- **Database:** Supabase (optional)
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required for payments:
- `SQUARE_ACCESS_TOKEN` — Square sandbox or production access token
- `SQUARE_LOCATION_ID` — Square location ID
- `VITE_SQUARE_APP_ID` — Square application ID
- `VITE_APPLE_PAY_MERCHANT_ID` — Apple Pay merchant identifier (optional)

## Deploy
```bash
vercel
```
