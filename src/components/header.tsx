'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo } from '@/components/logo';
import { MobileNav } from '@/components/mobile-nav';
import { navLinks } from '@/components/nav-links';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { Link } from '@/libs/i18n-navigation';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      }}
      aria-label="Toggle theme"
    >
      <SunIcon className="size-4 scale-100 dark:scale-0" />
      <MoonIcon className="absolute size-4 scale-0 dark:scale-100" />
    </Button>
  );
};

export const Header = () => {
  const scrolled = useScroll(10);
  const t = useTranslations('Navigation');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-7xl border-transparent border-b md:rounded-md md:border md:transition-[top,max-width,background-color,border-color,box-shadow] md:ease-out',
        {
          'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-5xl md:shadow':
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-[height,padding] md:ease-out',
          {
            'md:px-2': scrolled,
          }
        )}
      >
        <Link
          aria-label={t('home')}
          className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
          href="/"
        >
          <Logo className="h-4" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map((link) => (
              <Button
                key={link.key}
                size="sm"
                variant="ghost"
                render={<Link href={link.href} />}
                nativeButton={false}
              >
                {t(link.key)}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/sign-in" />}
            nativeButton={false}
          >
            {t('sign_in')}
          </Button>
          <Button
            size="sm"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            {t('get_started')}
          </Button>
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
        <MobileNav />
      </nav>
    </header>
  );
};
