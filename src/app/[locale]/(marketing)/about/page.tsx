import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Integrations } from '@/components/integrations';
import { generatePageMetadata } from '@/utils/Metadata';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: AboutPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'About',
    path: '/about',
  });
}

export default async function About(props: AboutPageProps) {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return <Integrations />;
}
