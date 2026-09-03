import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getI18nPath } from '@/utils/get-i18n-path';
import { generatePageMetadata } from '@/utils/metadata';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: SignInPageProps
): Promise<Metadata> => {
  const { locale } = await props.params;

  return generatePageMetadata({
    locale,
    namespace: 'SignIn',
    path: '/sign-in',
  });
};

const SignInPage = async (props: SignInPageProps) => {
  const { locale } = await props.params;

  return (
    <Suspense fallback={null}>
      <SignIn path={getI18nPath('/sign-in', locale)} />
    </Suspense>
  );
};

export default SignInPage;
