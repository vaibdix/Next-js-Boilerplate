'use client';

import * as React from 'react';

const AnnouncerContext = React.createContext<(message: string) => void>(
  () => {}
);

export const useAnnounce = () => {
  return React.useContext(AnnouncerContext);
};

export const AnnouncerProvider = (props: { children: React.ReactNode }) => {
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
};
