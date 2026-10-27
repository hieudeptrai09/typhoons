# 🌀 Typhoons

An interactive web app for exploring Western Pacific typhoon and storm data, covering the basin from 2000 to the present.

### **→ [typhoons.vercel.app](https://typhoons.vercel.app)**

## What you can do

- **Browse the storms dashboard** — highlights, storm lists, distances, and averages (by year, name, and position)
- **Explore names** — active and retired typhoon names, suggestions, and per-name history
- **See "on this day"** — historical facts and storms that were active on today's date
- **Open info & position pages** — storm details with cyclic prev/next navigation, as full pages or intercepted modals
- **Search** — find any storm by name
- **Read the about page** — data sources, credits, and license
- **Install it** — works as a Progressive Web App on mobile and desktop

## Built with

- **[Next.js 16](https://nextjs.org/)** (App Router) · **React 19** · **TypeScript**
- **[Ant Design 6](https://ant.design/)** + **[Tailwind CSS 4](https://tailwindcss.com/)**
- **[Supabase](https://supabase.com/) Postgres** for the storm data, queried server-side via [`postgres`](https://github.com/porsager/postgres)
- **[Jest](https://jestjs.io/)** for unit tests
- Deployed on **[Vercel](https://vercel.com/)**

## Project structure

```
db/
└── schema.sql              # Postgres schema for the storm data

src/
├── app/                    # Next.js App Router — only the files Next.js requires here
│   ├── (home)/             # Home page
│   ├── (navbar)/           # storms, names, positions, info, search, about
│   ├── @modal/             # Intercepting-route modals for info & positions
│   └── api/revalidate/     # On-demand ISR revalidation webhook
└── lib/
    ├── features/           # Route-specific code: <route>/components/, <route>/utils/
    ├── components/
    │   ├── ui/             # Generic, domain-agnostic building blocks
    │   ├── layout/         # Navbar and footer
    │   └── storm/ name/ position/ statistics/   # Shared domain components
    ├── db/                 # client.ts, queries/, row mappers/, cache tags
    ├── providers/          # AntD provider and style registry
    ├── styles/             # Global CSS, generated antd.css, AntD theme
    ├── config/             # App navigation config
    ├── assets/fonts/       # Fonts for the OG image routes
    ├── hooks/              # Reusable hooks
    ├── utils/              # Pure helpers (colors, dates, positions, OG images, …)
    ├── testing/            # Shared test fixtures
    ├── constants.ts        # Shared constants
    └── types.ts            # Shared TypeScript types
```

Pages fetch data directly in server components through `src/lib/db/queries`; the only route handler is the revalidation webhook.

## Development

```bash
npm install
cp .env.example .env.development   # then fill in your Supabase credentials
npm run dev                        # http://localhost:3000
```

The app needs a Supabase Postgres connection; see [.env.example](.env.example) for the variables and [db/schema.sql](db/schema.sql) for the schema.

Other scripts:

| Script             | Does                             |
| ------------------ | -------------------------------- |
| `npm run build`    | Production build                 |
| `npm run start`    | Serve the production build       |
| `npm run lint`     | ESLint                           |
| `npm run test`     | Jest unit tests                  |
| `npm run format`   | Prettier + ESLint `--fix`        |

## License

The data and text are dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Images are **not** covered — they remain under their original copyright and are credited where the author and license are known. See the [about page](https://typhoons.vercel.app/about/) for data sources and credits.

## Author

Made with 🌀 by **Cá Tra** ([@hieudeptrai09](https://github.com/hieudeptrai09)).
