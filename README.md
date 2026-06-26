# 🌹 The Scented Aura — House of Perfume

Welcome to **The Scented Aura**, an elegant e-commerce boutique dedicated to handcrafted luxury fragrances inspired by nature, elegance, and timeless artistry.

This platform offers a seamless shopping experience for premium perfumes, complete with user authentication, wishlist management, cart functionality, and a comprehensive administrative dashboard for catalog and order management.

---

## ✨ Features

### Customer Features
- **🌸 Curated Fragrance Catalog**: Browse handcrafted perfumes with detailed notes and high-quality visuals.
- **🔍 Olfactory Pyramid**: View detailed descriptions including top, heart, and base notes.
- **🛒 Shopping Cart & Wishlist**: Easily manage items you wish to purchase or save for later.
- **🔐 Secure User Authentication**: Powered by Supabase Auth (Sign up, Log in, Profile management).
- **💳 Secure Checkout Workflow**: Seamless order placement and delivery address configuration.
- **📱 Responsive Layout**: Fully optimized and responsive design for mobile, tablet, and desktop screens.

### Admin Features
- **💼 Protected Admin Dashboard**: High-level sales overview, order statistics, and transaction summaries.
- **📦 Catalog Management**: Live product management (add, edit, delete fragrances).
- **📋 Order Processing**: Real-time order tracking, status management, and updates.
- **🔒 Access Control**: Role-based access control checking user authentication and credentials before granting dashboard access.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Routing & SSR Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) & [TanStack Router](https://tanstack.com/router)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL database, authentication, storage, and realtime channels)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔒 Security & SEO

- **Supabase Authentication**: Secure session handling and authenticated routes.
- **Row Level Security (RLS)**: PostgreSQL-level access control on Supabase tables.
- **SEO-Friendly Architecture**: Proper semantic HTML, structured metadata, automatic dynamic XML sitemaps, and robots.txt.
- **Schema Markup**: Integrated JSON-LD WebSite structured schema for enhanced rich results in search engines.

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
├── .vercel/               # Vercel deployment folder
├── public/                # Static assets (favicons, sitemap, robots.txt)
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ui elements)
│   ├── data/              # Static data / mocks
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries (Supabase client, authentication helpers)
│   ├── routes/            # TanStack routes (including __root.tsx shell and page components)
│   ├── services/          # API or backend communication services
│   ├── store/             # Zustand state management stores (user, products, cart)
│   └── styles.css         # Global design system CSS tokens and styling
├── supabase/              # Supabase schema definitions and SQL scripts
├── vite.config.ts         # Vite configuration
└── wrangler.jsonc         # Wrangler config for Cloudflare deployments
```

---

## 👤 Author

**Nitin Kumawat**

Frontend Developer | SEO & Digital Marketing Enthusiast | React Developer

### Skills Demonstrated
React.js • TypeScript • Supabase • Vite • Tailwind CSS • Authentication • E-Commerce Development • UI/UX Design • State Management • GitHub • Vercel • SEO Optimization • Web Performance • Database Integration • Cloud Deployment
