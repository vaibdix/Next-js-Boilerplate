import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import { generatePageMetadata } from '@/utils/Metadata';

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: SignUpPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'SignUp',
    path: '/sign-up',
  });
}

export default async function SignUpPage(props: SignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <SignUp path={getI18nPath('/sign-up', locale)} />;
}
