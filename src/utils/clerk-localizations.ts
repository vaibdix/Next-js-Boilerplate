import { enUS, frFR } from '@clerk/localizations';

const supportedLocales: Record<string, typeof enUS> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
