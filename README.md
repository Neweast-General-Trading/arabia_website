# Neweast Arabia Holding

Bilingual holding-company website for Neweast’s Saudi presence. It introduces the group, tells the story, and sends visitors to the three businesses we represent:

- [Neweast Spare Parts](https://www.neweast.cloud/)
- [Neweast Isuzu](http://isuzu.sa/)
- [Neweast NEXTAR](https://nextar-me.com/en)

The public site is English and Arabic (RTL), with a light sand-and-navy identity and the Neweast red `#E30613`. Content is edited from a private CMS. Nothing on the marketing pages is hardcoded that the business team cannot change later.

**Live**

| Surface | URL |
|---|---|
| Website | https://arabia.neweast.cloud |
| English | https://arabia.neweast.cloud/en |
| Arabic | https://arabia.neweast.cloud/ar |
| CMS | https://arabia.neweast.cloud/cms/ |
| Public API | https://arabia.neweast.cloud/api/ |

---

## What this repository contains

Three apps in one monorepo, served behind nginx on the same domain:

| App | Path | Stack | Local port |
|---|---|---|---|
| Public website | `website/` | Next.js App Router, Tailwind CSS | `3020` |
| CMS dashboard | `dashboard/` | Vite + React, base path `/cms/` | `3012` |
| API | `backend/` | NestJS 11, Prisma 6, SQLite | `4000` |

Next.js is used for the public site because SEO is a requirement: server-rendered titles, descriptions, canonicals, `hreflang`, Open Graph, JSON-LD, sitemap, and robots. The dashboard is a React SPA. The API is the single source of truth for copy, media, and inbound messages.

---

## Architecture

```
Browser
   │
   ├─ /            → Next.js website     :3020
   ├─ /cms/        → Vite CMS            :3012
   ├─ /api/        → NestJS              :4000
   └─ /uploads/    → NestJS static files :4000
```

On production, `arabia.neweast.cloud` terminates HTTPS and proxies those paths. The website talks to the API server-side at `http://127.0.0.1:4000`. The CMS and the browser use same-origin `/api/` and `/uploads/`, so no public CORS dance is required.

Content is bilingual at rest (`{ en, ar }` JSON fields). The API localizes on read. The website then shapes digits for the active language: Western `0–9` in English, Eastern Arabic `٠–٩` in Arabic. Phone numbers, emails, and URLs stay Western in both languages.

---

## Local setup

**Requirements:** Node.js 20+, npm.

```bash
git clone https://github.com/Neweast-General-Trading/arabia_website.git
cd arabia_website

cp backend/.env.example backend/.env
cp website/.env.example website/.env.local
cp dashboard/.env.example dashboard/.env

cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..

npm install
npm run dev
```

Then open:

- Website: http://localhost:3020/en and http://localhost:3020/ar
- CMS: http://localhost:3012/cms/
- API: http://localhost:4000/api/public/site?locale=en

Or from the repo root: `npm run db:setup` then `npm run dev`.

### Default CMS login (local seed only)

- Email: `admin@neweast.sa`
- Password: set in `backend/.env` as `ADMIN_PASSWORD`

Change the password before any shared or production use.

---

## What the CMS can edit

Every public surface is driven from the dashboard:

- Logos, favicon, brand colors
- Company name, tagline, office, map, and social links
- Hero banners
- Who we are, stats, overview, mission, vision
- Strategy pillars, story timeline, values, leadership, governance
- Subsidiaries (name, copy, photography, outbound website)
- Per-page SEO (title, description, keywords, share image)
- Media library and the contact inbox

The navigation is: Home → About Us → Corporate Governance → Business → Contact. About has a sticky subnav for Overview, Story, Mission, and Leadership.

---

## Project layout

```
arabia_website/
├── website/          Public Next.js site
│   └── src/app/[locale]/
├── dashboard/        Admin CMS (Vite, /cms/)
├── backend/          NestJS + Prisma + SQLite
│   ├── prisma/       Schema and seed
│   └── uploads/      Media served at /uploads/
├── ecosystem.config.cjs   PM2 process file used on the live server
└── package.json      Root scripts to run all three apps
```

---

## Production notes

- Public hostname: `arabia.neweast.cloud` (HTTPS via Let’s Encrypt).
- Processes are kept alive with PM2 (`arabia-api`, `arabia-website`, `arabia-cms`).
- Nginx must not steal `/api/whatsapp/webhook`, `/api/uploads/`, or `/api/qr-codes/` from the event API on this host.
- `NEXT_PUBLIC_API_URL` and `VITE_API_URL` stay empty in production so the browser stays same-origin.
- Do not run a full Prisma re-seed against a live database. Seed wipes CMS edits. Update rows by slug or id instead.

---

## Brand direction

Keep the holding site light. Do not turn it into a dark full-page hero.

- Page background: sand / off-white `#f7f5f2`
- Footer: navy
- Accent: Neweast red `#E30613`
- English headings: Outfit
- English body: Manrope
- Arabic: GE SS (`website/public/fonts/GESS-*.otf`)

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | API, website, and CMS together |
| `npm run db:setup` | Prisma generate, migrate, and seed |
| `npm run build` | Production build of all three apps |
