// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.slaaf.org',
  // Pages stay static and CDN-cached; only routes that opt out of
  // prerendering (the registration endpoint) run on demand.
  output: 'static',
  adapter: vercel(),
  // /play was the original route for this page.
  redirects: { '/play': '/get-involved', '/teams': '/events', '/support': '/apparel' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
