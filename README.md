# The Kebab Lab

Clay oven specialist kebab takeaway at 123 Colne Road, Burnley, BB10 1LN.

Order authentic kebabs, shawarma, pizzas, burgers and more online with Apple Pay and card payments powered by Square.

## Features

- Full menu with 80+ items across 12 categories
- Square payment integration (card + Apple Pay)
- Shopping cart with size selection and custom notes
- Order status tracking with receipt codes
- Responsive mobile-first design
- 3D particle effects and interactive UI
- Glassmorphism navigation with scroll awareness
- Open/closed status indicator

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
