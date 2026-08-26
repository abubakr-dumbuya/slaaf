import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    author: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Fixtures drive both the fixture list and the generated standings. */
const fixtures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fixtures' }),
  schema: z.object({
    date: z.coerce.date(),
    competition: z.string(),
    code: z.enum(['flag', 'tackle']),
    home: z.string(),
    away: z.string(),
    venue: z.string().optional(),
    homeScore: z.number().optional(),
    awayScore: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news, fixtures };
