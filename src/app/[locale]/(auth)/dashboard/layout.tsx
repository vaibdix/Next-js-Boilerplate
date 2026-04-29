import { SignOutButton } from '@clerk/nextjs';
import { LogOutIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/button';
import { Link } from '@/libs/I18nNavigation';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
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
}
