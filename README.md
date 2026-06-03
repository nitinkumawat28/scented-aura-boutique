# 🌹 The Scented Aura — House of Perfume

Welcome to **The Scented Aura**, an elegant e-commerce boutique dedicated to handcrafted luxury fragrances inspired by nature, elegance, and timeless artistry.

This platform offers a seamless shopping experience for premium perfumes, complete with user authentication, wishlist management, cart functionality, and a comprehensive administrative dashboard for catalog and order management.

---

## ✨ Features

- **🌸 Curated Fragrance Catalog**: Browse handcrafted perfumes with detailed notes and high-quality visuals.
- **🛒 Shopping Cart & Wishlist**: Easily manage items you wish to purchase or save for later.
- **🔐 Secure User Authentication**: Powered by Supabase Auth (Sign up, Log in, Profile management).
- **💼 Admin Dashboard**:
  - Live product management (add, edit, delete fragrances).
  - Real-time order tracking and management.
- **⚡ Performance & SSR**: Built using TanStack Start and TanStack Router for ultra-fast, server-rendered routes.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Routing & SSR Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) & [TanStack Router](https://tanstack.com/router)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) (or [Bun](https://bun.sh/)) installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nitinkumawat28/scented-aura-boutique.git
   cd scented-aura-boutique
   ```

2. Install dependencies:
   ```bash
   npm install
   # or using Bun
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase configuration keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running Locally

To start the local development server:
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To build the production-ready bundle:
```bash
npm run build
# or
bun run build
```

---

## 📂 Project Structure

```
├── .lovable/              # Lovable configuration (ignored/removed for production)
├── public/                # Static assets (favicons, verification pages)
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ui elements)
│   ├── data/              # Static data / mocks
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries (Supabase client, authentication helpers)
│   ├── routes/            # TanStack routes (including __root.tsx shell and page components)
│   ├── services/          # API or backend communication services
│   ├── store/             # Zustand state management stores (user, products, cart)
│   └── styles.css         # Global design system CSS tokens and styling
├── supabase/              # Supabase schema definitions
├── vite.config.ts         # Vite configuration
└── wrangler.jsonc         # Wrangler config for Cloudflare deployments
```
