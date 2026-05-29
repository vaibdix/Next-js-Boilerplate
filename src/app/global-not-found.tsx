// `global-not-found.tsx` bypasses every layout including `src/app/layout.tsx`,
// so the usual global CSS import from there doesn't reach this page.
// Per Next.js docs, import global styles + fonts directly here.
import '@/styles/global.css';
import { CompassIcon, HomeIcon } from 'lucide-react';
import { Manrope } from 'next/font/google';
import Link from 'next/link';

import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { NotFoundPage } from '@/components/not-found';
import { buttonVariants } from '@/components/ui/button';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`antialiased ${manrope.variable}`}>
      <body>
        <NotFoundPage
          description="The page you're looking for might have been moved or doesn't exist."
          homeButton={
            <Link href="/" className={buttonVariants()}>
              <HomeIcon data-icon="inline-start" />
              Go home
            </Link>
          }
          exploreButton={
            <Link
              href="/about"
              className={buttonVariants({ variant: 'outline' })}
            >
              <CompassIcon data-icon="inline-start" />
              Explore
            </Link>
          }
        />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
