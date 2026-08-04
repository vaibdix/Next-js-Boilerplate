import { detectBot } from '@arcjet/next';
import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { routing } from './libs/i18n-routing';
import { createArcjetClient } from '@/libs/arcjet';
import { isClerkPath } from '@/utils/is-clerk-path';
import { isProtectedPath } from '@/utils/is-protected-path';
import { splitLocale } from '@/utils/split-locale';

const handleI18nRouting = createMiddleware(routing);

const handleClerk = clerkMiddleware(async (auth, request) => {
  const { localePrefix, pathWithoutLocale } = splitLocale(
    request.nextUrl.pathname
  );

  if (isProtectedPath(pathWithoutLocale)) {
    await auth.protect({
      unauthenticatedUrl: new URL(
        `${localePrefix}/sign-in`,
        request.url
      ).toString(),
    });
  }

  return handleI18nRouting(request);
});

const arcjetKey = process.env['ARCJET_KEY'];

const arcjetBotProtection =
  arcjetKey === undefined || arcjetKey === ''
    ? undefined
    : createArcjetClient(arcjetKey).withRule(
        detectBot({
          mode: 'LIVE',
          allow: [
            'CATEGORY:SEARCH_ENGINE',
            'CATEGORY:PREVIEW',
            'CATEGORY:MONITOR',
          ],
        })
      );

const proxy = async (request: NextRequest, event: NextFetchEvent) => {
  if (arcjetBotProtection !== undefined) {
    const decision = await arcjetBotProtection.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { pathWithoutLocale } = splitLocale(request.nextUrl.pathname);

  if (isClerkPath(pathWithoutLocale)) {
    return handleClerk(request, event);
  }

  return handleI18nRouting(request);
};

export default proxy;

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
};
