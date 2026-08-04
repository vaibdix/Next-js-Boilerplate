import { Env } from '@/libs/env';

export const getBaseUrl = () => {
  if (Env.NEXT_PUBLIC_APP_URL !== undefined && Env.NEXT_PUBLIC_APP_URL !== '') {
    return Env.NEXT_PUBLIC_APP_URL;
  }

  return 'http://localhost:3000';
};
