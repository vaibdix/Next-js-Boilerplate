import { CompassIcon, HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NotFoundPage } from '@/components/not-found';
import { buttonVariants } from '@/components/ui/button-variants';
import { Link } from '@/libs/i18n-navigation';

const NotFound = () => {
  const t = useTranslations('NotFound');

  return (
    <NotFoundPage
      description={t('description')}
      homeButton={
        <Link href="/" className={buttonVariants()}>
          <HomeIcon data-icon="inline-start" />
          {t('go_home')}
        </Link>
      }
      exploreButton={
        <Link href="/about" className={buttonVariants({ variant: 'outline' })}>
          <CompassIcon data-icon="inline-start" />
          {t('explore')}
        </Link>
      }
    />
  );
};

export default NotFound;
