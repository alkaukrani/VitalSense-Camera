// Central fetch reference for the whole codebase.
// In Node 18+ and browsers, fetch is global. For older Node, lazily import node-fetch.

export const httpFetch: typeof fetch = ((...args: Parameters<typeof fetch>) => {
  const globalFetch: typeof fetch | undefined = (globalThis as any).fetch;
  if (globalFetch) {
    return globalFetch(...args);
  }
  // Lazy ESM-friendly import to avoid bundler/ESM require issues
  return import('node-fetch').then((mod: any) => (mod.default ?? mod)(...args as any)) as unknown as ReturnType<typeof fetch>;
}) as unknown as typeof fetch;

