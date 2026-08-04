import { expect, test } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/fr',
  '/fr/about',
  '/fr/contact',
];

const HTTP_SERVER_ERROR = 500;

const clerkSecretKey = process.env['CLERK_SECRET_KEY'] ?? '';
const isClerkConfigured = clerkSecretKey.startsWith('sk_');

test.describe('public routes render', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} responds without a server error`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(HTTP_SERVER_ERROR);
    });
  }
});

test.describe('route behaviour', () => {
  test('/contact resolves its Suspense fallback to real content', async ({
    page,
  }) => {
    await page.goto('/contact');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });

  test('the marketing shell renders its navigation', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('button', { name: 'About' }).first()
    ).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
  });
});

test.describe('authenticated routes', () => {
  test.skip(
    !isClerkConfigured,
    'CLERK_SECRET_KEY is a placeholder; Clerk rejects the handshake'
  );

  test('/dashboard redirects an anonymous visitor to sign-in', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/sign-in/u);
  });

  test('/fr/dashboard keeps the locale on the sign-in redirect', async ({
    page,
  }) => {
    await page.goto('/fr/dashboard');

    await expect(page).toHaveURL(/\/fr\/sign-in/u);
  });

  test('/sign-in renders without a server error', async ({ page }) => {
    const response = await page.goto('/sign-in');

    expect(response?.status()).toBeLessThan(HTTP_SERVER_ERROR);
  });
});

test.describe('console health', () => {
  for (const route of ['/', '/about', '/contact']) {
    test(`${route} logs no console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(route);
      await page.waitForLoadState('networkidle');

      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe('contact api', () => {
  test('rejects a malformed body with 400', async ({ request }) => {
    const response = await request.post('/api/contact', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not-json',
    });

    expect(response.status()).toBe(400);
  });

  test('rejects an invalid submission with 400', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { name: '', email: 'nope', phone: '1', message: 'short' },
    });

    expect(response.status()).toBe(400);
  });

  test('rejects GET with 405', async ({ request }) => {
    const response = await request.get('/api/contact');

    expect(response.status()).toBe(405);
  });
});
