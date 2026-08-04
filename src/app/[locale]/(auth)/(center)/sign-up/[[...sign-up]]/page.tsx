import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { getI18nPath } from '@/utils/get-i18n-path';
import { generatePageMetadata } from '@/utils/metadata';

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: SignUpPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'SignUp',
    path: '/sign-up',
  });
};

const SignUpPage = async (props: SignUpPageProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <SignUp path={getI18nPath('/sign-up', locale)} />
    </Suspense>
  );
};

export default SignUpPage;
