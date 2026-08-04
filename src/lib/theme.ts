export type Theme = 'light' | 'dark' | 'system';

export const THEME_COOKIE_NAME = 'theme';
export const THEME_STORAGE_KEY = 'theme';
export const MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const isTheme = (value: string | undefined): value is Theme => {
  return value === 'light' || value === 'dark' || value === 'system';
};

export const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme !== 'system') {
    return theme;
  }

  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
};

export const applyTheme = (resolved: 'light' | 'dark') => {
  const root = document.documentElement;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
};

export const setThemeCookie = (theme: Theme) => {
  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=31536000;SameSite=Lax`;
};
