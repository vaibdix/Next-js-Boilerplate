import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/libs/I18nNavigation';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-xl font-medium">{t('heading')}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {t('description')}
      </p>
      <Link href="/" className={buttonVariants()}>
        {t('go_home')}
      </Link>
    </div>
  );
}
