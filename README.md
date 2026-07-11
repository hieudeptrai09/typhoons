# 🌀 Typhoons

An interactive web app for exploring Pacific typhoon and storm data.

### **→ [typhoons.vercel.app](https://typhoons.vercel.app)**

## What you can do

- **Browse the storms dashboard** — highlights, storm lists, distances, and averages
- **Explore names** — active and retired typhoon names, suggestions, and per-name history
- **See "on this day"** — historical facts and storms that were active on today's date
- **Open info & position pages** — storm details with cyclic prev/next navigation
- **Search** — find any storm by name
- **Install it** — works as a Progressive Web App on mobile and desktop

## Built with

- **[Next.js 16](https://nextjs.org/)** (App Router) · **React 19** · **TypeScript**
- **[Ant Design 6](https://ant.design/)** + **[Tailwind CSS 4](https://tailwindcss.com/)**
- **[Supabase](https://supabase.com/) Postgres** for the storm data
- Deployed on **[Vercel](https://vercel.com/)**

## Project structure

```
src/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── (home)/             # Home page
│   ├── (navbar)/           # storms, names, positions, info, search
│   ├── @modal/             # Intercepting-route modals
│   └── api/                # Route handlers backing the pages
└── lib/
    ├── db/                 # Postgres client and queries
    ├── components/         # Shared UI components
    ├── hooks/              # Reusable hooks
    └── layout/             # Navbar and layout
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run format`.

## Author

Made with 🌀 by **Cá Tra** ([@hieudeptrai09](https://github.com/hieudeptrai09)).
