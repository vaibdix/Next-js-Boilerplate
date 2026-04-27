import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/hero';
import { LogosSection } from '@/components/logos-section';
import { generatePageMetadata } from '@/utils/Metadata';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: IndexPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'Index',
    path: '/',
  });
}

export default async function IndexPage(props: IndexPageProps) {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <LogosSection />
    </>
  );
}
