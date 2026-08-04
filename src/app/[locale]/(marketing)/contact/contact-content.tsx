import { setRequestLocale } from 'next-intl/server';

import { ContactSection } from '@/components/contact-section';

interface ContactContentProps {
  params: Promise<{ locale: string }>;
}

export const ContactContent = async (props: ContactContentProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <ContactSection />;
};
