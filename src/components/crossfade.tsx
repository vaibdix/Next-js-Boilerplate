import { ViewTransition } from 'react';

/**
 * Fade streamed content in when its Suspense boundary resolves.
 *
 * @param props The component props.
 * @param props.children The content to reveal with a crossfade.
 * @returns The children wrapped in a view transition.
 */
export const Crossfade = (props: { children: React.ReactNode }) => {
  return (
    <ViewTransition enter="auto" default="none">
      {props.children}
    </ViewTransition>
  );
};
