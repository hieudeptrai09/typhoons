# 🌀 Typhoons

An interactive web app for exploring Pacific typhoon and storm data — dashboards,
naming lists, retired names, "on this day" facts, position pages, and search.

Live site: **https://typhoons.vercel.app**

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router) + **React 19** + **TypeScript**
- **[Ant Design 6](https://ant.design/)** for UI components
- **[Tailwind CSS 4](https://tailwindcss.com/)** for styling
- **[Postgres](https://github.com/porsager/postgres)** (`postgres` client) against a **Supabase** database
- **PWA** via [`next-pwa`](https://github.com/shadowwalker/next-pwa)
- **ESLint** + **Prettier** for linting and formatting

## Features

- **Storms dashboard** — highlights, storm lists, distances, averages, and position grids
- **Names** — active and retired typhoon names, suggestions, and per-name details
- **On this day** — historical facts and storms active on the current date
- **Info & position pages** — detail pages with cyclic prev/next pagination
- **Search** — search across storm names
- Intercepting-route modals for quick detail views
- Installable as a Progressive Web App

## Getting started

### Prerequisites

- **Node.js 20+** (required by Next.js 16)
- **npm**
- Access to a **Supabase Postgres** database containing the typhoon tables
  (the app reads from the `catfisha_typhoons` schema)

### Install

```bash
npm install
```

### Configure environment variables

Environment variables are read from `.env.development` (local) and
`.env.production` (deployment). **Do not commit real secrets** — fill them in
locally or in your hosting provider's secret store.

The key variable the app needs at runtime is the Postgres connection string:

| Variable                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `SUPABASE_POSTGRES_URL` | Pooled Postgres connection string (used by the DB client)|

> The DB client (`src/lib/db/index.ts`) connects with `prepare: false` (Supabase's
> pooled/pgbouncer transaction mode doesn't support prepared statements) and sets
> `search_path` to `catfisha_typhoons, public`.

Additional Supabase-related keys are present in the `.env*` templates
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, service-role keys, etc.); fill in only the
ones your setup requires.

### Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `npm run dev`    | Start the Next.js development server                 |
| `npm run build`  | Build the production bundle                          |
| `npm run start`  | Run the production build                             |
| `npm run lint`   | Lint the codebase with ESLint                        |
| `npm run format` | Format `src/**` with Prettier and auto-fix ESLint    |

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── (home)/             # Home page and its components (fun facts, active storms, …)
│   ├── (navbar)/           # Pages that share the navbar layout
│   │   ├── storms/         # Storms dashboard (views, grids, modals)
│   │   ├── names/          # Name lists, retired names, details
│   │   ├── positions/      # Per-position pages
│   │   ├── info/           # Storm info pages
│   │   └── search/         # Search page
│   ├── @modal/             # Intercepting-route modals
│   ├── api/                # Route handlers (see below)
│   ├── layout.tsx          # Root layout
│   └── sitemap.ts          # Generated sitemap
└── lib/
    ├── db/                 # Postgres client and query helpers
    ├── components/         # Shared UI components
    ├── hooks/              # Reusable hooks
    ├── layout/             # Navbar and layout pieces
    ├── constants/          # Shared constants
    └── types/              # Shared TypeScript types
```

## API routes

Server route handlers live under `src/app/api/`:

| Route                       | Purpose                              |
| --------------------------- | ------------------------------------ |
| `GET /api/facts`            | Random typhoon fact                  |
| `GET /api/history`          | Historical storm data                |
| `GET /api/on-this-day`      | Facts for the current calendar date  |
| `GET /api/active-on-this-day` | Storms active on this day          |
| `GET /api/search/names`     | Search storm names                   |
| `GET /api/suggested-names`  | Suggested names                      |

## Deployment

The app is deployed on **Vercel**. Set the required environment variables in the
Vercel project settings, and Vercel will build with `npm run build` and serve the
Next.js output automatically.
