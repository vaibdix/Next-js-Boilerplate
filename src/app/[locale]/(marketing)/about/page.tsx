import type { Metadata } from 'next';

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

const About = () => {
  return <Integrations />;
};

export default About;
