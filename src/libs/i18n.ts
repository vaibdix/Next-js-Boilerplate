import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';

import { routing } from './i18n-routing';

const messageLoaders = {
  en: () => import('../locales/en.json'),
  fr: () => import('../locales/fr.json'),
};

export default getRequestConfig(async ({ locale: override }) => {
  const requested = override ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested) ? requested : notFound();

  const messages =
    locale === 'fr' ? await messageLoaders.fr() : await messageLoaders.en();

  return { locale, messages: messages.default };
});
