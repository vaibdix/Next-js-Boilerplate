import { cacheLife, cacheTag } from 'next/cache';

import { fetchJson } from '@/utils/fetch-json';

export const cachedJson = async (
  tag: string,
  url: string
): Promise<unknown> => {
  'use cache';

  cacheTag(tag);
  cacheLife('days');

  const data = await fetchJson(url);
  return data;
};
