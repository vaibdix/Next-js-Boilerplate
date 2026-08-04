import type * as React from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

interface NotFoundPageProps {
  description: string;
  homeButton: React.ReactNode;
  exploreButton: React.ReactNode;
}

export const NotFoundPage = (props: NotFoundPageProps) => {
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
};
