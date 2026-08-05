'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export { useTheme } from 'next-themes';

export const ThemeProvider = (props: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {props.children}
    </NextThemesProvider>
  );
};
