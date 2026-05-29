'use client';

import * as React from 'react';

const AnnouncerContext = React.createContext<(message: string) => void>(() => {
  /* noop */
});

/**
 * Hook to announce messages to screen readers via an aria-live region.
 * @returns The announce function from AnnouncerContext.
 */
export function useAnnounce() {
  return React.useContext(AnnouncerContext);
}

/**
 * Provides an aria-live region for polite screen reader announcements.
 * @param props - Component props.
 * @returns The provider wrapping children with an aria-live region.
 */
export function AnnouncerProvider(props: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState('');

  const announce = React.useCallback((text: string) => {
    setMessage('');
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {props.children}
      <output aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </output>
    </AnnouncerContext.Provider>
  );
}
