'use client';

import * as React from 'react';
import {
  applyTheme,
  isTheme,
  MEDIA_QUERY,
  resolveTheme,
  setThemeCookie,
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
  setTheme: (_theme: Theme) => {
    // noop — overridden by provider
  },
});

function useTheme() {
  return React.useContext(ThemeContext);
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== 'd') {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [resolvedTheme, setTheme]);

  return null;
}

function ThemeProvider(props: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = React.useState<Theme>(props.initialTheme);
  const [resolved, setResolved] = React.useState<'light' | 'dark'>(() =>
    resolveTheme(props.initialTheme)
  );

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);

    const r = resolveTheme(next);
    setResolved(r);
    applyTheme(r);

    setThemeCookie(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable
    }
  }, []);

  // Apply theme on mount (handles 'system' case where server couldn't resolve)
  React.useEffect(() => {
    const r = resolveTheme(theme);
    setResolved(r);
    applyTheme(r);
  }, [theme]);

  // Listen for system preference changes
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY);
    const handler = () => {
      if (theme === 'system') {
        const r = resolveTheme('system');
        setResolved(r);
        applyTheme(r);
      }
    };

    media.addEventListener('change', handler);

    return () => {
      media.removeEventListener('change', handler);
    };
  }, [theme]);

  // Cross-tab sync via localStorage
  React.useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        const val = event.newValue ?? undefined;

        if (isTheme(val)) {
          setThemeState(val);

          const r = resolveTheme(val);
          setResolved(r);
          applyTheme(r);
          setThemeCookie(val);
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
}

export { ThemeProvider, useTheme };
