import { CompassIcon, HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { FullWidthDivider } from '@/components/ui/full-width-divider';
import { Link } from '@/libs/I18nNavigation';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-screen items-center border-x">
        <div>
          <FullWidthDivider />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-mono text-8xl font-black">
                404
              </EmptyTitle>
              <EmptyDescription className="text-nowrap">
                {t('description')}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button render={<Link href="/" />} nativeButton={false}>
                  <HomeIcon data-icon="inline-start" />
                  {t('go_home')}
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="/about/" />}
                  nativeButton={false}
                >
                  <CompassIcon data-icon="inline-start" />
                  {t('explore')}
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <FullWidthDivider />
        </div>
      </div>
    </div>
  );
}
