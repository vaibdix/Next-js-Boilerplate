import { ArrowRightIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { cacheLife } from 'next/cache';

import { cn } from '@/lib/utils';

/**
 * Cache the current year so reading `new Date()` doesn't break prerendering
 * under Next.js 16's Cache Components. Regenerated at most once per week,
 * which is fine for a copyright footer that only changes once a year.
 *
 * The function must be `async` because the `'use cache'` directive only
 * works on async functions, even when the body itself does no awaiting —
 * see https://nextjs.org/docs/app/api-reference/directives/use-cache.
 * @returns The current calendar year.
 */
// oxlint-disable-next-line eslint/require-await -- 'use cache' requires async
async function getCurrentYear() {
  'use cache';
  cacheLife('weeks');
  return new Date().getFullYear();
}

type LinksGroupProps = {
  title: string;
  links: { title: string; href: string }[];
};

function LinksGroup({ title, links }: LinksGroupProps) {
  return (
    <div className="p-2">
      <h3 className="mt-2 mb-4 text-xs font-medium tracking-wider text-foreground/75 uppercase">
        {title}
      </h3>
      <ul>
        {links.map((link) => (
          <li key={link.title}>
            <a
              className="text-xs text-muted-foreground hover:text-foreground"
              href={link.href}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialCard({
  title,
  href,
  className,
}: React.ComponentProps<'a'> & {
  title: string;
}) {
  return (
    <a
      className={cn(
        'flex items-center justify-between border-y p-2 text-sm hover:bg-muted md:border-t-0 dark:hover:bg-muted/50',
        className
      )}
      href={href}
    >
      <span className="font-medium">{title}</span>
      <ArrowRightIcon className="size-4" />
    </a>
  );
}

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = await getCurrentYear();

  return (
    <footer
      className={cn(
        'border-t',
        'dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.08),transparent)]'
      )}
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="relative grid grid-cols-1 border-x md:grid-cols-4 md:divide-x">
          <div>
            <SocialCard className="border-t-0" href="#" title="Facebook" />
            <LinksGroup
              links={[
                { title: t('pricing'), href: '#' },
                { title: t('testimonials'), href: '#' },
                { title: t('faqs'), href: '#' },
                { title: t('contact_us'), href: '#' },
                { title: t('blog'), href: '#' },
              ]}
              title={t('about_us')}
            />
          </div>
          <div>
            <SocialCard href="#" title="Youtube" />
            <LinksGroup
              links={[
                { title: t('help_center'), href: '#' },
                { title: t('terms'), href: '#' },
                { title: t('privacy'), href: '#' },
                { title: t('security'), href: '#' },
                { title: t('cookie_policy'), href: '#' },
              ]}
              title={t('support')}
            />
          </div>

          <div>
            <SocialCard href="#" title="Twitter" />
            <LinksGroup
              links={[
                { title: t('forum'), href: '#' },
                { title: t('events'), href: '#' },
                { title: t('partners'), href: '#' },
                { title: t('affiliates'), href: '#' },
                { title: t('career'), href: '#' },
              ]}
              title={t('community')}
            />
          </div>
          <div>
            <SocialCard href="#" title="Instagram" />
            <LinksGroup
              links={[
                { title: t('investors'), href: '#' },
                { title: t('terms_of_use'), href: '#' },
                { title: t('privacy_policy'), href: '#' },
                { title: t('cookie_policy'), href: '#' },
                { title: t('legal'), href: '#' },
              ]}
              title={t('press')}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center border-t p-3">
        <p className="text-xs text-muted-foreground">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
