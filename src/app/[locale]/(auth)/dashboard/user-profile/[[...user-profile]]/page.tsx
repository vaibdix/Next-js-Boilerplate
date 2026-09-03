import { UserProfile } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getI18nPath } from '@/utils/get-i18n-path';

interface UserProfilePageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (
  props: UserProfilePageProps
): Promise<Metadata> => {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
};

const UserProfilePage = async (props: UserProfilePageProps) => {
  const { locale } = await props.params;

  return (
    <div className="my-6 lg:-ml-12">
      <Suspense fallback={null}>
        <UserProfile path={getI18nPath('/dashboard/user-profile', locale)} />
      </Suspense>
    </div>
  );
};

export default UserProfilePage;
