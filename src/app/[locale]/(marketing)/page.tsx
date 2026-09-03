import type { Metadata } from 'next';
import { Suspense } from 'react';

import { HeroSkeleton } from './hero-skeleton';
import { LogosSkeleton } from './logos-skeleton';
import { Crossfade } from '@/components/crossfade';
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

const IndexPage = () => {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Crossfade>
          <HeroSection />
        </Crossfade>
      </Suspense>
      <Suspense fallback={<LogosSkeleton />}>
        <Crossfade>
          <LogosSection />
        </Crossfade>
      </Suspense>
    </>
  );
};

export default IndexPage;
