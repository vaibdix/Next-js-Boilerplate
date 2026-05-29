import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { ContactSection } from '@/components/contact-section';
import { generatePageMetadata } from '@/utils/Metadata';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: ContactPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return await generatePageMetadata({
    locale,
    namespace: 'Contact',
    path: '/contact',
  });
}

export default async function ContactPage(props: ContactPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <section className="py-12 md:py-16">
      <ContactSection />
    </section>
  );
}
