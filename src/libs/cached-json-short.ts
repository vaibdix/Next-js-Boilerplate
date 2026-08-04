import { cacheLife, cacheTag } from 'next/cache';

import { fetchJson } from '@/utils/fetch-json';

const STALE_SECONDS = 60;
const REVALIDATE_SECONDS = 300;
const EXPIRE_SECONDS = 3600;

export const cachedJsonShort = async (
  tag: string,
  url: string
): Promise<unknown> => {
  'use cache';

  cacheTag(tag);
  cacheLife({
    stale: STALE_SECONDS,
    revalidate: REVALIDATE_SECONDS,
    expire: EXPIRE_SECONDS,
  });

  const data = await fetchJson(url);
  return data;
};
