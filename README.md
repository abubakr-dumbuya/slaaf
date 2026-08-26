# slaaf.org

Website for the **Sierra Leone Authority of American Football (SLAAF)** — the
national governing body for tackle and flag football in Sierra Leone.

## Stack

- **[Astro](https://astro.build)** — static output, zero client-side JS by default
- **[Tailwind CSS v4](https://tailwindcss.com)** — design tokens live in `src/styles/global.css`
- **Markdown content collections** — news and fixtures, no database
- Deploys as a static site to any CDN host (Vercel, Cloudflare Pages, Netlify)

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the built site
```

## Project layout

```
src/
  components/     Header, Footer, PageHeader, Circled (the marker-ellipse device)
  content/        news/ and fixtures/ Markdown — see CONTENT.md
  layouts/        Base.astro — <head>, SEO tags, structured data, chrome
  pages/          One file per route
  styles/         global.css — all design tokens
```

## Design

The palette and typography are taken from the existing slaaf.org holding page so
the new site is continuous with the identity already in market:

| Token | Value | Use |
|---|---|---|
| `leone-500` | `#1eb53a` | Flag green — primary accent |
| `atlantic-600` | `#0072c6` | Flag blue — secondary accent |
| `sand-200` | `#e4e5dd` | Warm off-white page ground |
| `ink-950` | `#14150f` | Warm near-black |

Display type is Archivo (heavy, slightly condensed); body copy is Inter.
The `<Circled>` component reproduces the hand-drawn green ellipse used around
"GRIDIRON" on the holding page — use it sparingly, once per screen at most.

## Status

Phase 1 (scaffold, design system, page shells) is complete. Pages that need
copy or data from SLAAF render an "Awaiting content" block listing exactly what
is required — search the codebase for `Placeholder` or `TODO` to find them.

Nothing factual about the organisation has been invented. Founding date, board
members, player numbers, affiliations and competition history are all marked
`TODO` and must be supplied before launch.

## Roadmap

- [x] **Phase 1** — Scaffold, design system, layout shell, page routes
- [ ] **Phase 2** — Real copy for About, Play for Salone, Support
- [ ] **Phase 3** — Fixtures and results, generated standings, team rosters
- [ ] **Phase 4** — Registration form, MailerLite newsletter, donations
- [ ] **Phase 5** — OG images, analytics, Lighthouse pass, a11y audit
- [ ] **Phase 6** — Domain cutover, DNS, handover
