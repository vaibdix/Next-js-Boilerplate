import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Integrations } from '@/components/integrations';
import { generatePageMetadata } from '@/utils/metadata';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: AboutPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'About',
    path: '/about',
  });
};

const About = async (props: AboutPageProps) => {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return <Integrations />;
};

export default About;
