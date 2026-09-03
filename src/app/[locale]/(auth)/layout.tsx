import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';

import { routing } from '@/libs/i18n-routing';
import { ClerkLocalizations } from '@/utils/clerk-localizations';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const AuthContent = async (props: AuthLayoutProps) => {
  const { locale } = await props.params;

  const clerkLocale =
    ClerkLocalizations.supportedLocales[locale] ??
    ClerkLocalizations.defaultLocale;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';
  let afterSignOutUrl = '/';

  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    signUpUrl = `/${locale}${signUpUrl}`;
    dashboardUrl = `/${locale}${dashboardUrl}`;
    afterSignOutUrl = `/${locale}${afterSignOutUrl}`;
  }

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk',
      }}
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      {props.children}
    </ClerkProvider>
  );
};

const AuthLayout = (props: AuthLayoutProps) => {
  return (
    <Suspense fallback={null}>
      <AuthContent {...props} />
    </Suspense>
  );
};

export default AuthLayout;
