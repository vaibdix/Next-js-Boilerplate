import type * as React from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

type NotFoundPageProps = {
  description: string;
  homeButton: React.ReactNode;
  exploreButton: React.ReactNode;
};

/**
 * 404 page layout from `@efferd/not-found-1` (shadcn registry), adapted to
 * accept slot-style button props so the global 404 (`next/link`) and the
 * locale-aware 404 (`@/libs/I18nNavigation`) can each pass their own typed
 * `Link` without leaking the routing layer into this component.
 *
 * Does not include `<html>` / `<body>` — wrap with those at the route level
 * when needed (e.g. `global-not-found.tsx`, which sits outside the `[locale]`
 * root layout).
 * @param props - 404 description and the two pre-built CTA button slots.
 * @returns The 404 page UI without an HTML document wrapper.
 */
export function NotFoundPage(props: NotFoundPageProps) {
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
                {props.description}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                {props.homeButton}
                {props.exploreButton}
              </div>
            </EmptyContent>
          </Empty>
          <FullWidthDivider />
        </div>
      </div>
    </div>
  );
}
