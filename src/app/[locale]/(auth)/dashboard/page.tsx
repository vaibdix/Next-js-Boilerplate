import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { HelloSkeleton } from './hello-skeleton';
import { Hello } from '@/components/hello';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: DashboardPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
};

const DashboardPage = () => {
  return (
    <div className="py-5 [&_p]:my-6">
      <Suspense fallback={<HelloSkeleton />}>
        <Hello />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
