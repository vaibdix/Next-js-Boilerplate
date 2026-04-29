import { cacheLife, cacheTag } from 'next/cache';

/**
 * Fetch data with Next.js 16 cache directives.
 * @param tag - Cache tag for targeted revalidation via `revalidateTag(tag)`.
 * @param fetcher - Async function that returns the data.
 * @returns The fetched data.
 */
// oxlint-disable-next-line require-await -- async required by 'use cache' directive
export async function cachedFetch<T>(tag: string, fetcher: () => Promise<T>) {
  'use cache';

  cacheTag(tag);
  cacheLife('days');

  return fetcher();
}

/**
 * Short-lived cache for frequently changing data.
 * @param tag - Cache tag for targeted revalidation.
 * @param fetcher - Async function that returns the data.
 * @returns The fetched data.
 */
// oxlint-disable-next-line require-await -- async required by 'use cache' directive
export async function cachedFetchShort<T>(
  tag: string,
  fetcher: () => Promise<T>
) {
  'use cache';

  cacheTag(tag);
  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  return fetcher();
}
