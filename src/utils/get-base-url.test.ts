import { beforeEach, describe, expect, it, vi } from 'vitest';

const envMock = vi.hoisted(() => ({
  Env: { NEXT_PUBLIC_APP_URL: undefined as string | undefined },
}));

vi.mock('@/libs/env', () => envMock);

const importGetBaseUrl = async () => {
  vi.resetModules();
  const { getBaseUrl } = await import('@/utils/get-base-url');
  return getBaseUrl;
};

describe('getBaseUrl', () => {
  beforeEach(() => {
    envMock.Env.NEXT_PUBLIC_APP_URL = undefined;
  });

  it('falls back to localhost when the app URL is unset', async () => {
    const getBaseUrl = await importGetBaseUrl();

    expect(getBaseUrl()).toBe('http://localhost:3000');
  });

  it('falls back to localhost when the app URL is an empty string', async () => {
    envMock.Env.NEXT_PUBLIC_APP_URL = '';
    const getBaseUrl = await importGetBaseUrl();

    expect(getBaseUrl()).toBe('http://localhost:3000');
  });

  it('uses the configured app URL when set', async () => {
    envMock.Env.NEXT_PUBLIC_APP_URL = 'https://efferd.example';
    const getBaseUrl = await importGetBaseUrl();

    expect(getBaseUrl()).toBe('https://efferd.example');
  });
});
