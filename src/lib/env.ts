/**
 * Reads a server-side environment variable at request time.
 *
 * Vite replaces a literal `import.meta.env.SOME_KEY` with its value during the
 * build. A variable that is unset at build time therefore compiles to
 * `undefined`, and any branch guarded by it is dropped as dead code — so the
 * deployed function can never see a value configured in the host afterwards,
 * no matter how many times it is set. `deliver()` in the registration endpoint
 * was compiled down to `return false` exactly this way.
 *
 * Looking the name up dynamically avoids the substitution: `process.env` is
 * read when the request runs, and `import.meta.env` is kept as a fallback
 * because `astro dev` loads .env into it rather than into `process.env`.
 */
export function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== 'undefined' ? process.env?.[name] : undefined;
  if (fromProcess) return fromProcess;
  // Undefined outside a Vite context, so this must not be indexed blindly.
  const viteEnv = import.meta.env as Record<string, string | undefined> | undefined;
  return viteEnv?.[name];
}
