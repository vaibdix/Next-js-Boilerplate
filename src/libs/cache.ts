import { cacheLife, cacheTag } from 'next/cache';

/**
 * Fetch JSON from a URL and cache the result with a tag for revalidation.
 *
 * Uses the built-in `'days'` cacheLife profile (stale 5m, revalidate 1d,
 * expire 1w). For other timescales, use `cachedJsonShort` or write a
 * dedicated `'use cache'` function inline at the call site.
 *
 * Next.js 16 requires every argument to a `'use cache'` scope to be
 * serializable, so this helper takes a URL string instead of a fetcher
 * closure — see https://nextjs.org/docs/app/api-reference/directives/use-cache.
 * `T` is asserted by the caller at the JSON parse boundary; wrap with a Zod
 * parse at the call site when you need runtime validation.
 * @param tag - Cache tag for targeted revalidation via `revalidateTag(tag)`.
 * @param url - URL to fetch.
 * @returns Parsed JSON response asserted as `T`.
 */
export async function cachedJson<T>(tag: string, url: string): Promise<T> {
  'use cache';

  cacheTag(tag);
  cacheLife('days');

  const r = await fetch(url);
  const data: unknown = await r.json();
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- network boundary; caller asserts T
  return data as T;
}

/**
 * Short-lived JSON cache for frequently changing data.
 *
 * Inline `cacheLife` profile: `stale` 60s, `revalidate` 5min, `expire` 1h.
 * `T` is asserted by the caller at the JSON parse boundary; wrap with a Zod
 * parse at the call site when you need runtime validation.
 * @param tag - Cache tag for targeted revalidation.
 * @param url - URL to fetch.
 * @returns Parsed JSON response asserted as `T`.
 */
export async function cachedJsonShort<T>(tag: string, url: string): Promise<T> {
  'use cache';

  cacheTag(tag);
  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  const r = await fetch(url);
  const data: unknown = await r.json();
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- network boundary; caller asserts T
  return data as T;
}
