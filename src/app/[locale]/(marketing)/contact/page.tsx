import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ContactContent } from './contact-content';
import { ContactSkeleton } from './contact-skeleton';
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

const ContactPage = (props: ContactPageProps) => {
  return (
    <section className="py-12 md:py-16">
      <Suspense fallback={<ContactSkeleton />}>
        <ContactContent params={props.params} />
      </Suspense>
    </section>
  );
};

export default ContactPage;
