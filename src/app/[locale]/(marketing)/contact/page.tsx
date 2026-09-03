import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ContactContent } from './contact-content';
import { ContactSkeleton } from './contact-skeleton';
import { Crossfade } from '@/components/crossfade';
import { generatePageMetadata } from '@/utils/metadata';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: ContactPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'Contact',
    path: '/contact',
  });
};

const ContactPage = () => {
  return (
    <section className="py-12 md:py-16">
      <Suspense fallback={<ContactSkeleton />}>
        <Crossfade>
          <ContactContent />
        </Crossfade>
      </Suspense>
    </section>
  );
};

export default ContactPage;
