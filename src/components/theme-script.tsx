'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useRef } from 'react';

import { MEDIA_QUERY, THEME_COOKIE_NAME } from '@/lib/theme';

/**
 * Server-rendered inline script that resolves the active theme from the
 * `theme` cookie (or system preference) and applies the matching class +
 * `color-scheme` to `<html>` BEFORE first paint.
 *
 * Mirrors `applyTheme` from `@/lib/theme` so React hydration sees the same
 * className/style the script wrote. Avoids FOUC on first paint while letting
 * the layout stay free of any `cookies()` read — which would otherwise block
 * the route from prerendering under Next.js 16 Cache Components.
 *
 * Uses `useServerInsertedHTML` so the `<script>` is emitted into the SSR
 * stream rather than rendered as a React element. React 19 warns on any
 * `<script>` tag rendered through the component tree because it never
 * re-executes on client navigation — `useServerInsertedHTML` sidesteps this
 * by inserting the tag into the streamed HTML.
 * @returns `null` — the script is inserted via the SSR stream callback.
 */
export function ThemeScript() {
  const inserted = useRef(false);

  // Inlined to match `applyTheme` semantics; can't `import` since this runs
  // before any module evaluation.
  const script = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE_NAME}=([^;]+)/);var t=m?m[1]:'system';if(t!=='light'&&t!=='dark'&&t!=='system')t='system';if(t==='system')t=matchMedia('${MEDIA_QUERY}').matches?'dark':'light';var d=document.documentElement;d.classList.remove('light','dark');d.classList.add(t);d.style.colorScheme=t}catch(e){}})();`;

  useServerInsertedHTML(() => {
    if (inserted.current) {
      return null;
    }
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
  });

  return null;
}
