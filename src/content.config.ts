import { defineCollection } from 'astro:content';

// No content collections are in use. News and fixtures were removed along with
// the pages that rendered them.
export const collections = {} satisfies Record<string, ReturnType<typeof defineCollection>>;
