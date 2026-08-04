import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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

const DashboardPage = async (props: DashboardPageProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5 [&_p]:my-6">
      <Hello />
    </div>
  );
};

export default DashboardPage;
