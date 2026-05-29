import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';
import { generatePageMetadata } from '@/utils/Metadata';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: SignInPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return await generatePageMetadata({
    locale,
    namespace: 'SignIn',
    path: '/sign-in',
  });
}

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <SignIn path={getI18nPath('/sign-in', locale)} />;
}
