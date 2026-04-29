'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { ChangeEventHandler } from 'react';
import { usePathname, useRouter } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLocale = event.target.value;

    if (newLocale === locale) {
      return;
    }

    router.push(
      {
        pathname,
        query: Object.fromEntries(new URLSearchParams(window.location.search)),
      },
      { locale: newLocale, scroll: false }
    );
  };

  return (
    <select
      defaultValue={locale}
      onChange={handleChange}
      className="h-8 rounded-md border bg-background px-2 text-sm font-medium text-foreground focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t('change_language')}
    >
      {routing.locales.map((elt) => (
        <option key={elt} value={elt}>
          {elt.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
