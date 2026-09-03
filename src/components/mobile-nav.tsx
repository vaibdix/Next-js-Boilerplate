import { XIcon, MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { navLinks } from '@/components/nav-links';
import { Button } from '@/components/ui/button';
import { Portal, PortalBackdrop } from '@/components/ui/portal';
import { cn } from '@/lib/utils';
import { Link } from '@/libs/i18n-navigation';

export const MobileNav = () => {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations('Navigation');

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => {
          setOpen(!open);
        }}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              'data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in',
              'size-full p-4'
            )}
            data-slot="open"
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  className="justify-start"
                  key={link.key}
                  variant="ghost"
                  render={<Link href={link.href} prefetch />}
                  nativeButton={false}
                >
                  {t(link.key)}
                </Button>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button
                className="w-full"
                variant="outline"
                render={<Link href="/sign-in" prefetch />}
                nativeButton={false}
              >
                {t('sign_in')}
              </Button>
              <Button
                className="w-full"
                render={<Link href="/sign-up" prefetch />}
                nativeButton={false}
              >
                {t('get_started')}
              </Button>
              <div className="mt-4 flex justify-center">
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
