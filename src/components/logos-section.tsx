import { getTranslations } from 'next-intl/server';

import { LogoCloud } from '@/components/logo-cloud';
import { DecorIcon } from '@/components/ui/decor-icon';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

export const LogosSection = async () => {
  const t = await getTranslations('Logos');

  return (
    <section className="mb-12">
      <h2 className="py-6 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        {t('trusted_by')}{' '}
        <span className="text-foreground">{t('experts')}</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogoCloud />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
};
