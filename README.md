# Olinbuy Storefront — Modern Next.js E-Commerce

Olinbuy is a modern, high-fidelity, and responsive e-commerce storefront built with Next.js, React, and Tailwind CSS. It is fully integrated with a Hono & MongoDB backend to support product browsing, category filtering, a persistent sliding shopping cart, and a complete checkout workflow supporting both **Stripe** and **Cash on Delivery (COD)**.

## 🚀 Key Features

*   **Premium Visual Experience**: Rich UI styling using Tailwind CSS v4, smooth slide-in/fade animations, and clean, high-contrast layouts.
*   **Intuitive Product Catalog**: Features a hero promotions carousel, real-time search, category filtering strip, trust badges, and special wholesale deals.
*   **Modular Cart State**: Client-side state managed via context hooks that persist cart items automatically in the browser's `localStorage`.
*   **Standardized Checkout Cycle**: A multi-mode checkout page accepting recipient shipping details and offering immediate options for:
    *   **Active Shipping Zone Filtering**: Country and state dropdown choices are dynamically constrained to destinations covered by active admin Shipping Zones.
    *   **Custom Delivery Estimates**: Displays configured custom delivery time ranges for rate options.
    *   **Cash on Delivery (COD)**: Instantly logs orders into the administration database and locks inventory, bypassing Stripe creation.
    *   **Credit Card (Stripe)**: Generates secure Stripe PaymentIntents and returns transaction secrets.
*   **Professional Assets**: Standardized SVG layouts powered by Lucide icons in place of default browser emojis.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router + React 19)
*   **Styling**: Tailwind CSS v4
*   **Icons**: Lucide React
*   **State Management**: React Context API
*   **Package Manager**: Bun / NPM

---

## ⚙️ Project Setup

### 1. Prerequisites
Ensure you have the Hono backend server running locally (by default on port `3002`).

### 2. Environment Configuration
Create a `.env.local` file at the root of the storefront directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/storefront
```

### 3. Installation
Install the project dependencies using Bun or NPM:

```bash
bun install
# or
npm install
```

### 4. Development Server
Launch the local Turbopack development server:

```bash
bun run dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or whichever port Next.js boots on) to view the application.

### 5. Production Compilation
Build and optimize the project for production:

```bash
bun run build
# or
npm run build
```

---

## 📁 Repository Structure

```
storefront/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind directives & keyframe animations
│   │   ├── layout.tsx          # Font loading (Poppins & Nunito) + Context Provider wrapper
│   │   ├── page.tsx            # Main landing shop page
│   │   ├── checkout/           # Shipping collection & payment mode toggle page
│   │   └── order-success/      # Successful order details page
│   ├── components/
│   │   ├── Navbar.tsx          # Responsive search & cart header
│   │   ├── HeroCarousel.tsx    # Slide banner promotions carousel
│   │   ├── ProductCard.tsx     # Display cards with prices & ratings
│   │   ├── CartDrawer.tsx      # Sidebar cart editor slide-panel
│   │   ├── TrustBadges.tsx     # Trust metrics banner
│   │   └── WholesaleSection.tsx# Wholesale MOQ rules card
│   └── lib/
│       ├── api.ts              # Fetch configurations & checkout payloads
│       └── CartContext.tsx     # Persistent React Context handler
├── package.json
└── tsconfig.json
```
