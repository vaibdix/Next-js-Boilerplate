'use client';

import * as React from 'react';

import {
  applyTheme,
  isTheme,
  MEDIA_QUERY,
  resolveTheme,
  setThemeCookie,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
} from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const ThemeContext = React.createContext<{
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: (_theme: Theme) => {},
});

const TYPING_TARGET_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA']);

const useTheme = () => {
  return React.useContext(ThemeContext);
};

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.isContentEditable || TYPING_TARGET_TAGS.has(target.tagName);
};

const shouldIgnoreThemeHotkey = (event: KeyboardEvent) => {
  return [
    event.defaultPrevented,
    event.repeat,
    event.metaKey,
    event.ctrlKey,
    event.altKey,
    event.key.toLowerCase() !== 'd',
    isTypingTarget(event.target),
  ].includes(true);
};

const getCookieTheme = (): Theme => {
  const pattern = new RegExp(`(?:^|;\\s*)${THEME_COOKIE_NAME}=([^;]+)`, 'u');
  const value = pattern.exec(document.cookie)?.[1];

  return isTheme(value) ? value : 'system';
};

const getInitialTheme = (initialTheme: Theme | undefined): Theme => {
  if (initialTheme !== undefined) {
    return initialTheme;
  }

  if (typeof document === 'undefined') {
    return 'system';
  }

  return getCookieTheme();
};

const ThemeHotkey = () => {
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreThemeHotkey(event)) {
        return;
      }

      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [resolvedTheme, setTheme]);

  return null;
};

const ThemeProvider = (props: {
  initialTheme?: Theme;
  children: React.ReactNode;
}) => {
  const initial = React.useMemo(
    () => getInitialTheme(props.initialTheme),
    [props.initialTheme]
  );

  const [theme, setThemeState] = React.useState<Theme>(initial);
  const [resolved, setResolved] = React.useState<'light' | 'dark'>(() =>
    resolveTheme(initial)
  );

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);

    const resolvedTheme = resolveTheme(next);
    setResolved(resolvedTheme);
    applyTheme(resolvedTheme);

    setThemeCookie(next);

    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  React.useEffect(() => {
    const resolvedTheme = resolveTheme(theme);
    applyTheme(resolvedTheme);
  }, [theme]);

  React.useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY);
    const handler = () => {
      if (theme === 'system') {
        const resolvedTheme = resolveTheme('system');
        setResolved(resolvedTheme);
        applyTheme(resolvedTheme);
      }
    };

    media.addEventListener('change', handler);

    return () => {
      media.removeEventListener('change', handler);
    };
  }, [theme]);

  React.useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        const storedTheme = event.newValue ?? undefined;

        if (isTheme(storedTheme)) {
          setThemeState(storedTheme);

          const resolvedTheme = resolveTheme(storedTheme);
          setResolved(resolvedTheme);
          applyTheme(resolvedTheme);
          setThemeCookie(storedTheme);
        }
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme: resolved, setTheme }),
    [theme, resolved, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, useTheme };
