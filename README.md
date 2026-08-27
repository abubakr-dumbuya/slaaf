# slaaf.org

Website for the **Sierra Leone Authority of American Football (SLAAF)** — the
national governing body for tackle and flag football in Sierra Leone.

## Stack

- **[Astro](https://astro.build)** — static output, zero client-side JS by default
- **[Tailwind CSS v4](https://tailwindcss.com)** — design tokens live in `src/styles/global.css`
- **[Zod](https://zod.dev)** — validates registrations on the server
- Deploys to Vercel: pages are prerendered and CDN-cached, and only the
  registration endpoint runs on demand

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the built site
```

## Environment variables

Player registrations are emailed to **info@slaaf.org**. The only required
variable is `RESEND_API_KEY`; copy `.env.example` to `.env` and set it, and set
the same value in the Vercel project for the deployed site.

Sending requires the `slaaf.org` domain to be verified in Resend (SPF and DKIM
records added to DNS), otherwise Resend rejects the send. `SLAAF_NOTIFY_EMAIL`
and `SLAAF_FROM_EMAIL` override the recipient and sender; `SLAAF_WEBHOOK_URL`
switches delivery to a JSON POST instead of email.

With neither configured, `/api/register` returns 503 and `/play` shows a "not
yet open" notice — the form never reports success for data it did not store.

## Upcoming events

`/events` reads a public Google Calendar's iCalendar feed and renders the
events in the site's own design, rather than embedding Google's iframe. Set
`GOOGLE_CALENDAR_ID` to the calendar's ID (Google Calendar → Settings →
Integrate calendar → Calendar ID) and set the calendar's access permissions to
public. The page is server-rendered, so a newly added event appears without a
rebuild. With no calendar configured the page explains what is missing.

## Project layout

```
src/
  components/     Header, Footer, PageHeader, Circled (the marker-ellipse device)
  layouts/        Base.astro — <head>, SEO tags, structured data, chrome
  lib/            registration.ts — the registration schema and age rules
                  calendar.ts — reads and parses the public calendar feed
                  shop.ts — reads the Shopify collection
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
- [ ] **Phase 4** — ~~Registration form~~ (done), MailerLite newsletter, donations
- [ ] **Phase 5** — OG images, analytics, Lighthouse pass, a11y audit
- [ ] **Phase 6** — Domain cutover, DNS, handover
