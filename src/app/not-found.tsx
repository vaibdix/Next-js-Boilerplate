import { CompassIcon, HomeIcon } from 'lucide-react';
import { Manrope } from 'next/font/google';
import Link from 'next/link';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export default function NotFoundPage() {
  return (
    <html lang="en" className={`antialiased ${manrope.variable}`}>
      <body>
        <div className="flex w-full items-center justify-center overflow-hidden">
          <div className="flex h-screen items-center border-x">
            <div>
              <FullWidthDivider />
              <Empty>
                <EmptyHeader>
                  <EmptyTitle className="font-mono text-8xl font-black">
                    404
                  </EmptyTitle>
                  <EmptyDescription className="text-nowrap">
                    The page you are looking for does not exist.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Link href="/" className={buttonVariants()}>
                      <HomeIcon data-icon="inline-start" />
                      Go home
                    </Link>
                    <Link
                      href="/about"
                      className={buttonVariants({ variant: 'outline' })}
                    >
                      <CompassIcon data-icon="inline-start" />
                      Explore
                    </Link>
                  </div>
                </EmptyContent>
              </Empty>
              <FullWidthDivider />
            </div>
          </div>
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
