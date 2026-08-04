import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './i18n-routing';

const messageLoaders = {
  en: () => import('../locales/en.json'),
  fr: () => import('../locales/fr.json'),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === 'fr' ? await messageLoaders.fr() : await messageLoaders.en();

  return { locale, messages: messages.default };
});
