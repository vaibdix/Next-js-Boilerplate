import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { HeroSection } from '@/components/hero';
import { LogosSection } from '@/components/logos-section';
import { generatePageMetadata } from '@/utils/metadata';

interface IndexPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: IndexPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'Index',
    path: '/',
  });
};

const IndexPage = async (props: IndexPageProps) => {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <LogosSection />
    </>
  );
};

export default IndexPage;
