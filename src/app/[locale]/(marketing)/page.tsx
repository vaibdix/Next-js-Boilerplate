import { ArrowRightIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/hero';
import { LogosSection } from '@/components/logos-section';
import { generatePageMetadata } from '@/utils/Metadata';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: IndexPageProps
): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata({ locale, namespace: 'Index', path: '/' });
}

export default async function IndexPage(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <>
      <HeroSection />
      <LogosSection />

      <section className="py-12 md:py-16">
        <div className="relative px-4 md:px-8">
          <h2 className="text-center text-2xl font-bold text-balance text-foreground md:text-3xl">
            {t('features_heading')}
          </h2>
          <p className="mt-4 text-center text-sm tracking-wider text-muted-foreground sm:text-base">
            {t.rich('features_description', {
              zap: () => (
                <span role="img" aria-label={t('zap_emoji_label')}>
                  ⚡️
                </span>
              ),
            })}
          </p>
        </div>
        <ul className="mt-8 grid gap-3 px-4 text-sm text-muted-foreground md:grid-cols-2 md:px-8">
          <li className="flex items-start gap-2">
            <span className="shrink-0">
              <ArrowRightIcon className="mt-0.5 size-4 text-white" />
            </span>
            <span>{t('feature_nextjs')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">
              <ArrowRightIcon className="mt-0.5 size-4 text-white" />
            </span>
            <span>{t('feature_typescript')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">
              <ArrowRightIcon className="mt-0.5 size-4 text-white" />
            </span>
            <span>{t('feature_tailwind')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">
              <ArrowRightIcon className="mt-0.5 size-4 text-white" />
            </span>
            <span>
              {t.rich('feature_auth', {
                clerk: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://clerk.com?utm_source=github&amp;utm_medium=sponsorship&amp;utm_campaign=nextjs-boilerplate"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">📦</span>
            <span>{t('feature_orm')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">💽</span>
            <span>
              {t.rich('feature_db', {
                neon: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://get.neon.com/BMFYNtx"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🌐</span>
            <span>
              {t.rich('feature_i18n', {
                crowdin: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://l.crowdin.com/next-js"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🔴</span>
            <span>{t('feature_forms')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">📏</span>
            <span>{t('feature_lint')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🦊</span>
            <span>{t('feature_git')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🦺</span>
            <span>{t('feature_testing')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🎉</span>
            <span>{t('feature_storybook')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🐰</span>
            <span>
              {t.rich('feature_codereview', {
                coderabbit: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🚨</span>
            <span>
              {t.rich('feature_monitoring', {
                sentry: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://sentry.io/for/nextjs/?utm_source=github&amp;utm_medium=paid-community&amp;utm_campaign=general-fy25q1-nextjs&amp;utm_content=github-banner-nextjsboilerplate-logo"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🖥️</span>
            <span>{t('feature_checkly')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🔐</span>
            <span>
              {t.rich('feature_security', {
                arcjet: (chunks) => (
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                    href="https://launch.arcjet.com/Q6eLbRE"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🤖</span>
            <span>{t('feature_seo')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">⚙️</span>
            <span>{t('feature_devtools')}</span>
          </li>
        </ul>
      </section>
    </>
  );
}
