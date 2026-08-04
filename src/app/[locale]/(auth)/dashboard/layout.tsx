import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { LogOutIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';
import { Link } from '@/libs/i18n-navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const DashboardContent = async (props: DashboardLayoutProps) => {
  await auth.protect();
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <header className="flex items-center justify-between border-b py-4">
        <nav aria-label={t('dashboard_link')}>
          <ul className="flex items-center gap-4 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="font-medium text-foreground hover:text-foreground/80"
              >
                {t('dashboard_link')}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/user-profile"
                className="text-muted-foreground hover:text-foreground"
              >
                {t('user_profile_link')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <SignOutButton>
            <Button variant="ghost" size="sm">
              <LogOutIcon className="size-4" />
              {t('sign_out')}
            </Button>
          </SignOutButton>
        </div>
      </header>
      <main className="py-8">{props.children}</main>
    </div>
  );
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <Suspense fallback={null}>
      <DashboardContent {...props} />
    </Suspense>
  );
};

export default DashboardLayout;
